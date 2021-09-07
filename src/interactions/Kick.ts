import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import {
	ButtonInteraction,
	Interaction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from 'discord.js'
import config from '../config'

export default class Kick implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'kick',
		description: 'Expulsa o membro mencionado.',
		permissions: ['KICK_MEMBERS'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Mencione o membro para expulsar.',
				type: InteractionTypes.USER,
				required: true,
			},
			{
				name: 'reason',
				description: 'Diga o motivo da expulsão.',
				type: InteractionTypes.STRING,
				required: false,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const target = interaction.options.getUser('target')
		const reason =
			interaction.options.getString('reason') ?? 'Razão não especificada.'
		const memberTarget = interaction.guild.members.cache.get(target.id)

		const kick = new MessageEmbed()
			.setAuthor(
				interaction.user.username,
				interaction.user.displayAvatarURL({ dynamic: true })
			)
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		kick.setDescription('**Banir**\nVocê não pode expulsar a sí mesmo.')

		if (target.id === interaction.user.id)
			return await interaction.reply({
				embeds: [kick],
			})

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('confirmation')
				.setLabel('Sim')
				.setStyle('SUCCESS')
		)

		kick.setDescription(
			`**Banir**\nVocê realmente deseja banir o membro ${target.username}?`
		)

		const replied = (await interaction.reply({
			embeds: [kick],
			components: [actionRow],
			fetchReply: true,
		})) as Message

		const filter = (i: Interaction) => i.user.id === interaction.user.id
		const collector = replied.createMessageComponentCollector({
			filter,
			time: 3 * 60 * 1000,
		})

		collector.on('collect', async (i: ButtonInteraction) => {
			try {
				await memberTarget.kick(reason)

				kick.setDescription('O membro foi expulso com sucesso.')

				await interaction.editReply({
					embeds: [kick],
					components: [],
				})
			} catch (err) {
				kick.setDescription('Erro ao tentar expulsar o membro.')

				await interaction.editReply({
					embeds: [kick],
					components: [],
				})
			}
		})

		collector.on('end', async (collected, reason) => {
			if (reason === 'time')
				kick.setDescription('**Banir**\nO tempo para decidir acabou.')

			await interaction.editReply({
				embeds: [kick],
				components: [],
			})
		})
	}
}
