import * as path from 'node:path'
import puppeteer from 'puppeteer'

class Browser {
  async init() {
    this.browser = await puppeteer.launch({
      defaultViewport: null
    })
  }

  async getScreenshot(options) {
    const page = await this.browser.newPage()
    await page.setViewport({ width: 724, height: 441 })
    await page.goto(
      path.resolve(process.cwd(), 'static', `template.html`),
      { waitUntil: 'networkidle0' }
    )

    await page.evaluate(async options => {
      const
        img1 = document.querySelector('#INJECT_QUESTION_AVATAR'),
        img2 = document.querySelector('#INJECT_ANSWER_AVATAR')

      img1.src = options.avatarFirst
      img2.src = options.avatar

      await Promise.all([img1, img2].map(img => {
        if (img.complete)
          return
        return new Promise((ok, bad) => {
          img.addEventListener('load', ok)
          img.addEventListener('error', bad)
        })
      }))

      ;[
        ['#INJECT_QUESTION_USERNAME', options.usernameFirst],
        ['#INJECT_ANSWER_USERNAME', options.username],
        ['#INJECT_QUESTION_TEXT', options.contentFirst],
        ['#INJECT_ANSWER_TEXT', options.content]
      ].forEach(([ selector, text ]) => {
        document.querySelector(selector).innerText = text
      })
    }, options)

    const imageBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 50,

    })
    await page.close()
    return imageBuffer
  }

}

let browser

export const getBrowser = async () => {
  if (!browser) {
    browser = new Browser()
    await browser.init()
  }
  return browser
}