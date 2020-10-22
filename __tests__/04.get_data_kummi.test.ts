import goodCompanies from '../out/data_profit'
import { Screener } from '../src/Screener'

const screener = new Screener()
let result: any = []

describe('GET COMPANIES DATA FOR MANUAL FILTERING > KUMMI ACCOUNT', () => {
  test(`login to screener as Kummi`, async () => {
    await screener.user1Login()
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

  test(`write data to data_kummi.ts and excel_summary.txt`, async () => {
    await screener.writeToFile(
      'data_kummi.ts',
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
    ]

    headers.map((header) => {
      excelData += `${header}::`
    })
    excelData += '\n'

    result.map((item) => {
      excelData += `${screener.getCompanyURL(item.ckey)}::`
      excelData += `${item.name}::`
      excelData += `${item['CMP Rs.']}::`
      excelData += `${item['B.V. Rs.']}::`
      excelData += `${item['IV Rs.']}::`
      excelData += `${item['Face value Rs.']}::`
      excelData += `${item['Mar Cap Rs.Cr.']}::`
      excelData += `${item['Reserves Rs.Cr.']}::`
      excelData += `${item['P/E']}::`
      excelData += `${item['3Yrs PE']}::`
      excelData += `${item['CMP / BV']}::`
      excelData += `${item['PEG']}::`
      excelData += `${item['Debt / Eq']}::`
      excelData += `${item['Int Coverage']}::`
      excelData += `${item['Debt Rs.Cr.']}::`
      excelData += `${item['Debt 3Yrs Rs.Cr.']}::`
      excelData += `${item['Altman Z Scr']}::`
      excelData += '\n'
    })

    await screener.writeToFile('excel_summary.txt', excelData)
  })
})
