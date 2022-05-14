import { getBrowser } from './browser.js'

const constructOptions = (message, postfix) => ({
  ['avatar' + postfix]: `https://cdn.discordapp.com/${
    message.author.id
  }/${
    message.author.avatar
  }.webp?size=128`,
  ['username' + postfix]: message.author.username,
  ['content' + postfix]: message.content,
})

export const handleMessage = async message => {
  if (message.type !== 'REPLY'
    || message.reference === null
    || !message.content?.toLocaleLowerCase().includes('я не знаю')
  )
    return

  console.log(message)
  const
    firstMessage = await message.channel.messages.fetch(message.reference.messageId),
    options = {
      ...constructOptions(message, ''),
      ...constructOptions(firstMessage, 'First')
    }

    const browser = await getBrowser()
    const imageBuffer = await browser.getScreenshot(options)

  await message.reply({
    files: [{
      attachment: imageBuffer,
      file: imageBuffer,
      name: `${message.content}.jpg`
    }]
  })

}