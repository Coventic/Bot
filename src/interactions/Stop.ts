import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
} from '../interfaces/IInteraction'

import { Music } from '../modules/music/index'

export default class Stop implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'stop',
		description: 'Para de tocar todas as musicas.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [],
	}

	public async invoke({
		interaction,
		client,
	}: IInteractionContext): Promise<any> {
		const voiceChannel = interaction.guild.members.cache.get(
			interaction.user.id
		).voice.channel.id

		const textChannel = interaction.guild.channels.cache.get(
			interaction.channel.id
		).id

		const options = {
			guild: interaction.guild.id,
			textChannel,
			voiceChannel,
		}

		const manager = new Music()

		try {
			await manager.stop({
				client,
				options,
			})

			interaction.reply({
				content: 'Saindo do canal.',
			})
		} catch (err) {
			return interaction.reply({
				content: err.message,
			})
		}
	}
}
