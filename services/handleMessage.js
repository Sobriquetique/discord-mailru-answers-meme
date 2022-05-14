import { getBrowser } from './browser.js'
import { SECOND_AS_MS } from '../config/var.js'

const constructOptions = (message, postfix) => ({
  ['avatar' + postfix]: `https://cdn.discordapp.com/avatars/${
    message.author.id
  }/${
    message.author.avatar
  }.jpg?size=128`,
  ['username' + postfix]: message.author.username,
  ['content' + postfix]: message.content,
})

let queue = new Set()
const subscribe = () => {
  const key = Date.now()
  queue.add(key)
  return () => {
    queue.delete(key)
  }
}

export const handleMessage = async message => {
  if (message.type !== 'REPLY'
    || message.reference === null
    || !message.content?.toLocaleLowerCase().includes('не знаю. я не')
  )
    return

  if (queue.size > 5) {
    await message.reply('Вы че там ахуели спамить? You what there ohueli to spam?')
    return
  }

  const unsubscribe = subscribe()

  try {
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
  catch (e) {
    await message.reply('Упс, что-то пошло не так')
  }
  finally {
    unsubscribe()
  }
}