import { Screener } from '../src/Screener'

const screener = new Screener()

describe('GET COMPANIES LIST', () => {
  test(`login to screener`, async () => {
    await screener.user1Login()
  })

  test('reset _companies.ts', async () => {
    await screener.writeToFile('_companies.ts', 'export default []')
  })

  test('run the query', async () => {
    await screener.runQuery()
    await screener.sortByName()
  })

  test('get companies', async () => {
    let companies = []
    companies.push(...(await screener.getCompanies()))

    await screener.writeToFile(
      '_companies.ts',
      `export default ${JSON.stringify(companies)}`,
    )

    await screener.writeToFile(
      'data_profit.ts',
      `export default ${JSON.stringify(companies)}`,
    )
  })
})
