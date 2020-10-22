import { Screener } from '../src/Screener'

const screener = new Screener()

describe('Login Tests', () => {
  test(`Login to screener as Kummi`, async () => {
    await screener.user1Login()
  })
})
