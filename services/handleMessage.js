import { getBrowser } from './browser.js'

const constructOptions = (message, postfix) => ({
  ['avatar' + postfix]: message.author.avatar,
  ['username' + postfix]: message.author.username,
  ['content' + postfix]: message.content,
})

export const handleMessage = async message => {
  if (message.type !== 'REPLY'
    || message.reference === null
    || !message.content?.toLocaleLowerCase().includes('я не знаю')
  )
    return

  const
    firstMessage = await message.channel.messages.fetch(message.reference.messageId),
    options = {
      ...constructOptions(message, ''),
      ...constructOptions(firstMessage, 'First')
    }

    const browser = await getBrowser()
    await browser.getScreenshot(options)


}