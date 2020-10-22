const path = require('path')
const mkdirp = require('mkdirp')

const cnfg = {
  takeScreenshotOnFailure: true,
  saveScreenshotOnFailure: false,
}

const env = jasmine.getEnv()
// create a reference to original "it" method
const { it: originalIt } = env

const today = new Date().toISOString().split('T')[0]
const screenshotsPath = path.resolve(__dirname, `./__screenshots__/${today}`)
const toFilename = (s) => s.replace(/[^a-z0-9.-]+/gi, '_')

env.it = (description, fn, timeout) => {
  const result = originalIt(
    description,
    async () => {
      try {
        return await fn()
      } catch (e) {
        if (cnfg.takeScreenshotOnFailure || cnfg.saveScreenshotOnFailure) {
          let filePath = null
          let screenBuffer = null

          if (cnfg.saveScreenshotOnFailure) {
            mkdirp.sync(screenshotsPath)

            let message = e.stack
            message = message.match(new RegExp(`${__dirname}(.*)`))
            if (message && message[1]) {
              message = message[1].replace(/^.*[\\/]/, '').replace(/:.+$/, '')
            }

            filePath = path.join(
              screenshotsPath,
              toFilename(`${message}__${description}.png`),
            )
          }

          screenBuffer = await page.screenshot({
            path: filePath,
            fullPage: true,
          })

          if (cnfg.takeScreenshotOnFailure) {
            reporter.addAttachment('Screenshot', screenBuffer, 'image/png')
          }
        }

        throw e
      }
    },
    timeout,
  )

  return result
}
