import { getBrowser } from './browser.js'
import { channelRouter } from './ChannelRouter.js'

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

const matches = ['не знаю', 'хз', 'сложна']

export const handleMessage = async (message, client) => {
  const routerResponse = await channelRouter.getResponseOrNull(message)
  if (routerResponse) {
    await message.reply(routerResponse)
  }

  if (message.type !== 'REPLY'
    || message.reference === null
    || !matches.reduce((result, toMatch) => {
      if (message.content?.toLocaleLowerCase().includes(toMatch))
        return true
      return result
    }, false)
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


    const
      routedChannelId = channelRouter.getSpamChannelIdByGuildId(message.guildId),
      body = {
        files: [{
          attachment: imageBuffer,
          file: imageBuffer,
          name: `stuff.jpg`
        }]
      }
    if (!routedChannelId) {
      await message.reply(body)
      return
    }

    const channel = client.channels.cache.find(channel => channel.id === routedChannelId)
    channel.send(body)
  }
  catch (e) {
    await message.reply(e.message)
  }
  finally {
    unsubscribe()
  }
}