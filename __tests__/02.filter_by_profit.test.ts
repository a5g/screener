import input from '../input'
import companies from '../out/_companies'
import { Screener } from '../src/Screener'

const screener = new Screener()

let getSalesFilterYearKeys = (data) => {
  let keys = []
  input.SALES_FILTER.map((year) => {
    if (data.indexOf(`Mar ${year}`) > -1) {
      keys.push(`Mar ${year}`)
    }
  })

  return keys
}

// let isValidSeries = (list: number[], percentge = input.GROWTH_PERCENT) => {
//   let flag = true
//   // console.log(`series: `, list)

//   for (let i = 0; i < list.length - 1; i++) {
//     if (list[i] <= 0 || list[i + 1] < list[i] + list[i] * (percentge / 100)) {
//       flag = false
//       break
//     }
//   }

//   return flag
// }

let isValidSeriesByCount = (list, percentge = input.GROWTH_PERCENT) => {
  let cnt = 0

  for (let i = 0; i < list.length - 1; i++) {
    if (
      list[i + 1] > 0 &&
      list[i + 1] >= list[i] + list[i] * (percentge / 100)
    ) {
      cnt += 1
    }
  }

  return cnt
}

let getRating = (data: any) => {
  let values = []
  let rating = []
  let keys = getSalesFilterYearKeys(Object.keys(data[0]))

  if (keys.length === input.SALES_FILTER.length) {
    data.map(async (item: any) => {
      if (
        item.plkey.toLowerCase().indexOf('sales') > -1 ||
        item.plkey.toLowerCase().indexOf('net profit') > -1
      ) {
        values = keys.map((key) => parseFloat(item[key]))

        // isValidSeries - flag method
        // if (isValidSeries(values)) {
        //   rating.push(item.plkey)
        // }

        // isValidSeries - count method
        if (isValidSeriesByCount(values) > 2) {
          rating.push(item.plkey)
        }
      }
    })
  }

  return rating
}

describe('FILTER COMPANIES BY PROFIT', () => {
  let goodProfitCompanies = []

  test(`login to screener`, async () => {
    await screener.user1Login()
  })

  companies.map((company) => {
    test(`get P&L data for company ${company.name}`, async () => {
      await screener.gotoCompanyPL(company.ckey)

      let obj: any = {}
      obj.name = company.name
      obj.ckey = company.ckey
      obj.data = await screener.getPLTableData()
      obj.rating = getRating(obj.data)

      if (obj.rating.indexOf('Net Profit') > -1) {
        goodProfitCompanies.push(obj)
      }
    })
  })

  test('save companies_with_good_profit', async () => {
    await screener.writeToFile(
      'companies_with_good_profit.ts',
      `export default ${JSON.stringify(goodProfitCompanies)}`,
    )

    console.log(`TOTAL: ${companies.length}`)
    console.log(`Good Profit Companies: ${goodProfitCompanies.length}`)
  })
})
