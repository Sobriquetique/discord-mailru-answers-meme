import { __projectRoot } from '../config/root.js'
import * as path from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'

const filePath = path.resolve(__projectRoot, 'generated', 'channelRouter.json')

class ChannelRouter {
  constructor() {
    this.map = {}
  }

  async initialize() {
    try {
      try {
        await fs.promises.access(filePath)
      }
      catch (e) {
        await fs.promises.writeFile(filePath, '{}', { encoding: 'utf-8' })
      }
      const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' })
      this.map = JSON.parse(content) || {}
    }
    catch (e) {
      console.error(e)
    }

    this.generateToken()
    setInterval(() => {
      this.generateToken()
    }, 1000 * 30)
  }

  generateToken() {
    const value = crypto.randomBytes(16).toString("hex")
    this.token = {
      value,
      isSet: false,
    }
    console.log('Last token: ', value)
  }

  async setSpamChannelIdForGuildId({ guildId, channelId }) {
    this.map[guildId] = channelId
    this.token.isSet = true
    await fs.promises.writeFile(filePath, JSON.stringify(this.map), { encoding: 'utf-8' })
    console.log('this.map: ', this.map)
  }

  getSpamChannelIdByGuildId(guildId) {
    return this.map[guildId]
  }

  async getResponseOrNull(message) {
    try {
      if (message.content?.includes(this.token.value)) {
        if (this.token.isSet) {
          return 'Жди следующего токена чел'
        }
        await this.setSpamChannelIdForGuildId({ guildId: message.guildId, channelId: message.channelId })
        return 'Этот канал признан сральней'
      }
      return null
    }
    catch (e) {
      return null
    }
  }
}

export const channelRouter = new ChannelRouter()