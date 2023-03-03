import dotenv from 'dotenv'
import { Client, Intents  } from 'discord.js'
import { handleMessage } from './services/handleMessage.js'
import { channelRouter } from './services/ChannelRouter.js'

const ENV = dotenv.config().parsed

const main = async () => {
  const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
    ]
  })

  client.once('ready', () => {
    console.log('ready')
  })

  client.on('messageCreate', async message => {
    try {
      await handleMessage(message, client)
    }
    catch (e) {
      console.error(e)
    }
  })

  client.on('error', e => {
    console.error(e)
  })

  await client.login(ENV.DISCORD_APP_TOKEN)

  await channelRouter.initialize()
}

main()
  .catch(e => console.error(e))