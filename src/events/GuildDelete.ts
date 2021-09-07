import { Guild } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'
import GuildRepository from '../data/repositories/guild'
import { log } from '../utils/Logger'

export default class GuildDelete implements IEvent {
	constructor(private guildRepository = new GuildRepository()) {}

	public name = 'guildDelete'
	public async invoke(client: Bot, guild: Guild): Promise<any> {
		try {
			await this.guildRepository.delete(guild)

			log(`Delete guild ${guild.name} (${guild.id})`, 'database')
		} catch (err) {
			return log(`Delete guild error: ${err.message}`, 'database')
		}
	}
}
