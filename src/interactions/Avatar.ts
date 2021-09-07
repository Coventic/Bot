import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'
import config from '../config'

export default class Avatar implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'avatar',
		description: 'Envia o avatar do usuário mencionado.',
		permissions: [],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Mencione o usuário.',
				type: InteractionTypes.USER,
				required: false,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const user = interaction.options.getUser('target') || interaction.user

		const avatarURL = user.displayAvatarURL({
			dynamic: true,
			size: 2048,
			format: 'png',
		})

		const avatar = new MessageEmbed()
			.setAuthor(
				interaction.user.username,
				interaction.user.displayAvatarURL({ dynamic: true })
			)
			.setDescription(
				`Avatar de ${user.username}\nClique [aqui](${avatarURL}) para fazer o download.`
			)
			.setImage(avatarURL)
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		await interaction.reply({
			embeds: [avatar],
		})
	}
}
