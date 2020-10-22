import goodCompanies from '../out/data_profit'
import kummiData from '../out/data_kummi'
import { Screener } from '../src/Screener'

const screener = new Screener()
let result: any = []

describe('GET COMPANIES DATA FOR MANUAL FILTERING > ANAND ACCOUNT', () => {
  // test(`Logout from screener as Anand`, async () => {
  //   await screener.logout()
  // })

  test(`login to screener as Anand`, async () => {
    await screener.user2Login()
  })

  goodCompanies.map((company: any) => {
    test(`getting data for => ${company.name}`, async () => {
      await screener.gotoCompanyPeers(company.ckey)

      let data: any = await screener.getPeerTableData(company.ckey)

      delete data['S.No.']
      delete data['Name']

      data.name = company.name
      data.ckey = company.ckey
      data.url = screener.getCompanyURL(company.ckey)

      result.push(data)
    })
  })

  test(`write data to data_anand.ts and excel_summary.txt`, async () => {
    await screener.writeToFile(
      'data_anand.ts',
      `export default ${JSON.stringify(result)}`,
    )

    let excelData: string = ''
    let headers = [
      'URL',
      'Name',

      'CMP Rs.',
      'B.V. Rs.',
      'IV Rs.',
      'Face value Rs.',
      'Mar Cap Rs.Cr.',
      'Reserves Rs.Cr.',
      'P/E',
      '3Yrs PE',
      'CMP / BV',
      'PEG',
      'Debt / Eq',
      'Int Coverage',
      'Debt Rs.Cr.',
      'Debt 3Yrs Rs.Cr.',
      'Altman Z Scr',

      'ROCE %',
      'ROCE3yr avg %',
      'ROE %',
      'ROE 3Yr %',
      'EPS Ann Rs.',
      'EPS Prev Ann Rs.',
      'Sales Var 3Yrs %',
      'Profit Var 3Yrs %',
      'Div Yld %',
      'Piotski Scr',
      'Prom. Hold. %',
      'Chg in Prom Hold 3Yr %',
      'Pledged %',
      'EV / EBITDA',
    ]

    headers.map((header) => {
      excelData += `${header}::`
    })
    excelData += '\n'

    result.map((item, index) => {
      // kummi data
      excelData += `${screener.getCompanyURL(item.ckey)}::`
      excelData += `${item.name}::`

      excelData += `${kummiData[index]['CMP Rs.']}::`
      excelData += `${kummiData[index]['B.V. Rs.']}::`
      excelData += `${kummiData[index]['IV Rs.']}::`
      excelData += `${kummiData[index]['Face value Rs.']}::`
      excelData += `${kummiData[index]['Mar Cap Rs.Cr.']}::`
      excelData += `${kummiData[index]['Reserves Rs.Cr.']}::`
      excelData += `${kummiData[index]['P/E']}::`
      excelData += `${kummiData[index]['3Yrs PE']}::`
      excelData += `${kummiData[index]['CMP / BV']}::`
      excelData += `${kummiData[index]['PEG']}::`
      excelData += `${kummiData[index]['Debt / Eq']}::`
      excelData += `${kummiData[index]['Int Coverage']}::`
      excelData += `${kummiData[index]['Debt Rs.Cr.']}::`
      excelData += `${kummiData[index]['Debt 3Yrs Rs.Cr.']}::`
      excelData += `${kummiData[index]['Altman Z Scr']}::`

      // anand data
      excelData += `${item['ROCE %']}::`
      excelData += `${item['ROCE3yr avg %']}::`
      excelData += `${item['ROE %']}::`
      excelData += `${item['ROE 3Yr %']}::`
      excelData += `${item['EPS Ann Rs.']}::`
      excelData += `${item['EPS Prev Ann Rs.']}::`
      excelData += `${item['Sales Var 3Yrs %']}::`
      excelData += `${item['Profit Var 3Yrs %']}::`
      excelData += `${item['Div Yld %']}::`
      excelData += `${item['Piotski Scr']}::`
      excelData += `${item['Prom. Hold. %']}::`
      excelData += `${item['Chg in Prom Hold 3Yr %']}::`
      excelData += `${item['Pledged %']}::`
      excelData += `${item['EV / EBITDA']}::`
      excelData += '\n'
    })

    await screener.writeToFile('excel_summary.txt', excelData)
  })
})
