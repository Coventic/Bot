import { IEvent } from '../interfaces/IEvent'
import { REST } from '@discordjs/rest'
import { log } from '../utils/Logger'

import Bot from '../entities/Bot'
import config from '../config'
import server from '../api/server'

export default class Ready implements IEvent {
	constructor() {
		server()
	}

	public name = 'ready'
	public async invoke(client: Bot): Promise<any> {
		const rest = new REST({ version: '9' }).setToken(config.client.token)

		try {
			await rest.put(`/applications/${client.user.id}/commands`, {
				body: client.interactionCommandManager.interactions,
			})

			log('Refreshing slash commands', 'client')
		} catch (err) {
			console.error(`Refreshing slash commands error: ${err.message}`, 'client')
		}

		client.manager.init(client.user.id)

		client.user.setActivity('Use a slash command.', {
			url: 'https://www.twitch.tv/Krowkaz',
			type: 'STREAMING',
		})

		log(`Ready in ${client.user.username}`, 'client')
	}
}
