import input from '../input'

const fs = require('fs')

let companies = []
let selectors = {
  LOGIN_EMAIL_TEXT: 'input[id="id_username"]',
  LOGIN_PASSWORD_TEXT: 'input[id="id_password"]',
  LOGIN_BTN: 'button[type="submit"]',
  ACCOUNT_BTN: 'button[class="account"]',
  LOGOUT_BTN: 'form[action="/logout/"] button[type="submit"]',
  QUERY_TEXT: 'textarea[name="query"]',
  QUERY_RUN_BTN: 'form[action="/screen/raw/"] button[type="submit"]',
  RESULT_INFO:
    'div[class="card card-large"] > div[class*="flex-align-center"] > div:nth-child(1)',
  COMPANY_LINKS: 'a[href*="/company/"]',
  NEXT_PAGE_BTN:
    'div.card.card-large > div:nth-child(5) > div > div:nth-child(1) > div > a:nth-child(1)',
  NEXT_PAGE_BTN2:
    'div.card.card-large > div:nth-child(5) > div > div:nth-child(1) > div:nth-child(3) > a:nth-child(1)',
  PL_TABLE_HEADERS: 'section#profit-loss table.data-table thead tr th',
  PL_TABLE_ROWS: 'section#profit-loss table.data-table tbody tr',
  NAME_COLUMN: 'table[class*="data-table"] tr:nth-child(1) th:nth-child(2) a',
  PEER_TABLE_HEADERS:
    'div#peers-table-placeholder table.data-table tbody tr:nth-child(1) th',
  PEER_TABLE_ROWS: 'div#peers-table-placeholder table.data-table tbody tr',
}
const TIMEOUT = 5000

export class Screener {
  async click(selector) {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: TIMEOUT,
    })

    await (await page.$(selector)).click()
  }

  async getText(selector) {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: TIMEOUT,
    })

    return page.evaluate((elmnt) => elmnt.textContent, await page.$(selector))
  }

  async gotoScreener() {
    await page.goto(input.BASE_URL)
    await page.waitFor(500)
  }

  async login(email = input.USER1_EMAIL, password = input.USER1_PASSWORD) {
    await page.goto(`${input.BASE_URL}/login/`)
    await page.type(selectors.LOGIN_EMAIL_TEXT, email)
    await page.type(selectors.LOGIN_PASSWORD_TEXT, password)
    await page.click(selectors.LOGIN_BTN)
    await page.waitFor(500)
  }

  async logout() {
    await this.gotoScreener()
    await (await page.$(selectors.ACCOUNT_BTN)).hover()
    await page.click(selectors.LOGOUT_BTN)
    await page.waitFor(500)
  }

  async user1Login() {
    await this.login(input.USER1_EMAIL, input.USER1_PASSWORD)
  }

  async user2Login() {
    await this.login(input.USER2_EMAIL, input.USER2_PASSWORD)
  }

  async runQuery() {
    await page.goto(`${input.BASE_URL}/screen/new/`)
    await page.type(selectors.QUERY_TEXT, input.QUERY)
    await page.click(selectors.QUERY_RUN_BTN)
    await page.waitFor(500)
    // await page.waitForNavigation({ waitUntil: 'load' })
  }

  async getTotalPageCount() {
    let txt = (await this.getText(selectors.RESULT_INFO))
      .replace(/\n/g, '')
      .trim()
      .split(' ')

    return parseInt(txt[txt.length - 1], 10)
  }

  async getPageCounts() {
    let txt = (await this.getText(selectors.RESULT_INFO))
      .replace(/\n/g, '')
      .trim()
      .split(' ')

    return {
      total: parseInt(txt[txt.length - 1], 10),
      current: parseInt(txt[txt.length - 3], 10),
    }
  }

  async getCompanies() {
    const links = await page.$$(selectors.COMPANY_LINKS)
    let data = []

    links.map(async (link) => {
      let name = (await page.evaluate((el) => el.textContent, link))
        .replace(/\n/g, '')
        .trim()
      let ckey = (
        await page.evaluate((el) => el.getAttribute('href'), link)
      ).split('/')[2]

      data.push({ name, ckey })
    })

    await page.waitFor(100)
    await Promise.all(data)

    companies.push(...data)

    let pageCount = await this.getPageCounts()

    if (pageCount.current === pageCount.total) {
      return companies
    }

    if (pageCount.current < pageCount.total) {
      await this.clickNextPageButton(pageCount.current)
      return this.getCompanies()
    }

    return companies
  }

  async getTableData(headerSelector, rowsSelector) {
    const data = await page.evaluate(
      (hSelector, rSelector) => {
        const ths = Array.from(document.querySelectorAll(hSelector))
        const trs = Array.from(document.querySelectorAll(rSelector))
        let headers = ths.map((th) => th.innerText)
        headers[0] = 'plkey'

        let results = []

        console.log(`${trs.length} rows in member table!`)

        trs.forEach((tr) => {
          let r = {}
          let tds = Array.from(tr.querySelectorAll('td')).map(
            (td) => td.innerText,
          )

          headers.forEach((k, i) => (r[k] = tds[i]))
          results.push(r)
        })

        return results
      },
      headerSelector,
      rowsSelector,
    )

    return data
  }

  async sortByName() {
    await page.click(selectors.NAME_COLUMN)
    await page.waitFor(100)
    await page.click(selectors.NAME_COLUMN)
    await page.waitFor(100)
  }

  async getPLTableData() {
    return this.getTableData(
      selectors.PL_TABLE_HEADERS,
      selectors.PL_TABLE_ROWS,
    )
  }

  async getPeerTableData(company) {
    const data = await page.evaluate(
      (hSelector, rSelector, comp) => {
        const ths = Array.from(document.querySelectorAll(hSelector))
        const trs = Array.from(document.querySelectorAll(rSelector))
        let headers = ths.map((th) => th.innerText)
        let r = {}

        trs.forEach((tr, index) => {
          if (index > 0) {
            let tds = Array.from(tr.querySelectorAll('td')).map(
              (td) => td.innerText,
            )

            let html = Array.from(tr.querySelectorAll('td'))[1].innerHTML

            if (html.indexOf(`/${comp}/`) > -1) {
              headers.forEach((k, i) => (r[k] = tds[i]))
            }
          }
        })

        return r
      },
      selectors.PEER_TABLE_HEADERS,
      selectors.PEER_TABLE_ROWS,
      company,
    )

    return data
  }

  async gotoCompany(company: string) {
    await page.goto(`${input.BASE_URL}/company/${company}`, {
      waitUntil: 'load',
    })
  }

  async gotoCompanyPeers(company) {
    await page.goto(`${input.BASE_URL}/company/${company}/#peers`, {
      waitUntil: 'load',
    })
    // await page.waitFor(200)
    // anand
    await page.waitForSelector(selectors.PEER_TABLE_ROWS, {
      visible: true,
      timeout: TIMEOUT,
    })
  }

  getCompanyURL(company) {
    return `${input.BASE_URL}/company/${company}/`
  }

  async gotoCompanyPL(company: string) {
    await page.goto(
      `${input.BASE_URL}/company/${company}/consolidated/#profit-loss`,
      {
        waitUntil: 'load',
      },
    )

    await page.waitForSelector(selectors.PL_TABLE_ROWS, {
      visible: true,
      timeout: TIMEOUT,
    })
  }

  async clickNextPageButton(index = 1) {
    if (index === 1) {
      await this.click(selectors.NEXT_PAGE_BTN)
      await page.waitForNavigation({ waitUntil: 'load' })
    } else {
      await this.click(selectors.NEXT_PAGE_BTN2)
      await page.waitForNavigation({ waitUntil: 'load' })
    }
  }

  async clickNextPageButton2() {
    await this.click(selectors.NEXT_PAGE_BTN2)
    await page.waitForNavigation({ waitUntil: 'load' })
  }

  async writeToFile(file: string, content: string) {
    return fs.writeFile(`out/${file}`, content, function(err) {
      if (err) return console.log(err)
    })
  }
}
