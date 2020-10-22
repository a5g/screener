import goodCompanies from '../out/companies_with_good_profit'
import { Screener } from '../src/Screener'

const screener = new Screener()

let trimmed: any = []

describe('TRIM PROFIT DATA', () => {
  goodCompanies.map((company: any) => {
    test(`trim profit data for => ${company.name}`, () => {
      let obj: any = {}

      obj.name = company.name
      obj.ckey = company.ckey
      obj.url = screener.getCompanyURL(company.ckey)

      let t_data = []

      company.data.map((item) => {
        if (
          item.plkey.indexOf('Sales') > -1 ||
          item.plkey.indexOf('Net Profit') > -1
        ) {
          let pl: any = {}

          pl.plkey = item.plkey
          pl['Mar 2015'] = item['Mar 2015']
          pl['Mar 2016'] = item['Mar 2016']
          pl['Mar 2017'] = item['Mar 2017']
          pl['Mar 2018'] = item['Mar 2018']
          pl['Mar 2019'] = item['Mar 2019']
          pl['Mar 2020'] = ''
          pl['TTM'] = ''

          if (item['Mar 2020']) {
            pl['Mar 2020'] = item['Mar 2020']
          }

          if (item['TTM']) {
            pl['TTM'] = item['TTM']
          }

          // obj.push(pl)
          t_data.push(pl)
        }
      })

      obj.data = t_data
      obj.rating = company.rating

      trimmed.push(obj)
    })
  })

  test(`write profit data to data_profit.ts and excel_profit.txt`, async () => {
    await screener.writeToFile(
      'data_profit.ts',
      `export default ${JSON.stringify(trimmed)}`,
    )

    let excelData: string = ''
    let headers = [
      'URL',
      'Name',
      'Rating',
      'PL Key',
      'Mar 2015',
      'Mar 2016',
      'Mar 2017',
      'Mar 2018',
      'Mar 2019',
      'Mar 2020',
      'TTM',
    ]

    headers.map((header) => {
      excelData += `${header}::`
    })
    excelData += '\n'

    trimmed.map((item) => {
      // console.log(item.name)
      let emptyCols = false
      excelData += `${item.url}::`
      excelData += `${item.name}::`
      excelData += `${JSON.stringify(item.rating)}::`

      let salesIndex = -1
      let netProfitIndex = -1

      item.data.map((item, index) => {
        if (item.plkey.indexOf('Sales') > -1) {
          salesIndex = index
        }

        if (item.plkey.indexOf('Net Profit') > -1) {
          netProfitIndex = index
        }
      })

      if (salesIndex > -1) {
        excelData += `${item.data[salesIndex].plkey}::`
        excelData += `${item.data[salesIndex]['Mar 2015']}::`
        excelData += `${item.data[salesIndex]['Mar 2016']}::`
        excelData += `${item.data[salesIndex]['Mar 2017']}::`
        excelData += `${item.data[salesIndex]['Mar 2018']}::`
        excelData += `${item.data[salesIndex]['Mar 2019']}::`
        excelData += `${item.data[salesIndex]['Mar 2020']}::`
        excelData += `${item.data[salesIndex]['TTM']}::`
        excelData += '\n'
        emptyCols = true
      }

      if (netProfitIndex > -1) {
        if (emptyCols) {
          excelData += ` ::`
          excelData += ` ::`
          excelData += ` ::`
        }

        excelData += `${item.data[netProfitIndex].plkey}::`
        excelData += `${item.data[netProfitIndex]['Mar 2015']}::`
        excelData += `${item.data[netProfitIndex]['Mar 2016']}::`
        excelData += `${item.data[netProfitIndex]['Mar 2017']}::`
        excelData += `${item.data[netProfitIndex]['Mar 2018']}::`
        excelData += `${item.data[netProfitIndex]['Mar 2019']}::`
        excelData += `${item.data[netProfitIndex]['Mar 2020']}::`
        excelData += `${item.data[netProfitIndex]['TTM']}::`
      }

      excelData += '\n\n'
    })

    await screener.writeToFile('excel_profit.txt', excelData)
  })
})
