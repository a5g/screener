import { Screener } from '../src/Screener'

const screener = new Screener()

describe('CLEAN DATA', () => {
  test(`delete data from all files in 'out' folder`, async () => {
    await screener.writeToFile('_companies.ts', 'export default []')
    await screener.writeToFile(
      'companies_with_good_profit.ts',
      'export default []',
    )
    await screener.writeToFile('data_anand.ts', 'export default []')
    await screener.writeToFile('data_kummi.ts', 'export default []')
    await screener.writeToFile('data_profit.ts', 'export default []')
    await screener.writeToFile('excel_profit.txt', '')
    await screener.writeToFile('excel_summary.txt', '')
  })
})
