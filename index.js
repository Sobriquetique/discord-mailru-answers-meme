import dotenv from 'dotenv'
import { Client, Collection, Intents } from 'discord.js'
import { handleMessage } from './services/handleMessage.js'

const ENV = dotenv.config().parsed

const main = async () => {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

  client.once('ready', () => {
    console.log('ready')
  })

  client.on('messageCreate', async message => {
    try {
      await handleMessage(message)
    }
    catch (e) {
      console.error(e)
    }
  })

  await client.login(ENV.DISCORD_APP_TOKEN)
}

main()
  .catch(e => console.error(e))