import {
	IInteractionCommand,
	IInteractionConfig,
	IInteractionContext,
	InteractionTypes,
} from '../interfaces/IInteraction'

import {
	ButtonInteraction,
	GuildMember,
	Interaction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from 'discord.js'
import config from '../config'

export default class Unban implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'unban',
		description: 'Desbane o membro selecionado.',
		permissions: ['BAN_MEMBERS'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Digite o id do membro.',
				type: InteractionTypes.STRING,
				required: true,
			},
			{
				name: 'reason',
				description: 'Diga o motivo para o desbanimento.',
				type: InteractionTypes.STRING,
				required: false,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const target = interaction.options.getString('target')
		const reason =
			interaction.options.getString('reason') ?? 'Razão não especificada.'
		const bans = await interaction.guild.bans.fetch()
		const targetBan = (await bans.filter(
			(e) => e.user.id === target
		)[0]) as GuildMember

		const unban = new MessageEmbed()
			.setAuthor(
				interaction.user.username,
				interaction.user.displayAvatarURL({ dynamic: true })
			)
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		unban.setDescription('**Desbanir**\nO membro não está banido.')

		if (!targetBan)
			return await interaction.reply({
				embeds: [unban],
			})

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('confirmation')
				.setLabel('Sim')
				.setStyle('SUCCESS')
		)

		unban.setDescription(
			`**Desbanir**\nVocê realmente deseja desbanir o membro ${targetBan.user.username}?`
		)

		const replied = (await interaction.reply({
			embeds: [unban],
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
				await interaction.guild.bans.remove(target, reason)

				unban.setDescription('Membro desbanido com sucesso.')

				await interaction.editReply({
					embeds: [unban],
					components: [],
				})
			} catch (err) {
				unban.setDescription('Erro ao tentar desbanir o membro.')

				await interaction.editReply({
					embeds: [unban],
					components: [],
				})
			}
		})

		collector.on('end', async (collected, reason) => {
			if (reason === 'time')
				unban.setDescription('O tempo para decidir acabou.')

			await interaction.editReply({
				embeds: [unban],
				components: [],
			})
		})
	}
}
