import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
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

export default class Ban implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'ban',
		description: 'Bane o membro mencionado.',
		permissions: ['BAN_MEMBERS'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Mencione o membro para banir.',
				type: 6,
				required: true,
			},
			{
				name: 'days',
				description: 'Diga os dias do banimento.',
				type: 4,
				required: false,
			},
			{
				name: 'reason',
				description: 'Diga o motivo do banimento.',
				type: 3,
				required: false,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const target = interaction.options.getUser('target')
		const days = interaction.options.getInteger('days') ?? 0
		const reason =
			interaction.options.getString('reason') ?? 'Razão não especificada.'
		const memberTarget = interaction.guild.members.cache.get(target.id)

		const ban = new MessageEmbed()
			.setAuthor(
				interaction.user.username,
				interaction.user.displayAvatarURL({ dynamic: true })
			)
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		ban.setDescription('**Banir**\nVocê não pode banir a sí mesmo.')

		if (target.id === interaction.user.id)
			return await interaction.reply({
				embeds: [ban],
				ephemeral: true,
			})

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('confirmation')
				.setLabel('Sim')
				.setStyle('SUCCESS')
		)

		ban.setDescription(
			`**Banir**\nVocê realmente deseja banir o membro ${target.username}?`
		)

		const replied = (await interaction.reply({
			embeds: [ban],
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
				await memberTarget.ban({
					days,
					reason,
				})

				ban.setDescription('Membro banido com sucesso.')

				await interaction.editReply({
					embeds: [ban],
					components: [],
				})
			} catch (err) {
				ban.setDescription('Erro ao tentar banir o membro.')

				await interaction.editReply({
					embeds: [ban],
					components: [],
				})
			}
		})

		collector.on('end', async (collected, reason) => {
			if (reason === 'time')
				ban.setDescription('**Banir**\nO tempo para decidir acabou.')

			await interaction.editReply({
				embeds: [ban],
				components: [],
			})
		})
	}
}
