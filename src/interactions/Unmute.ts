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

import { globalMemberMap } from '../index'
import config from '../config'

export default class Unmute implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'unmute',
		description: 'Desmuta o membro mencionado.',
		permissions: ['MUTE_MEMBERS'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Mencione o membro para desmutar.',
				type: InteractionTypes.USER,
				required: true,
			},
		],
	}

	public async invoke({ interaction }: IInteractionContext): Promise<any> {
		const target = interaction.options.getUser('target')
		const targetMember = interaction.guild.members.cache.get(target.id)

		const role = interaction.guild.roles.cache.find(
			(role) => role.name === 'Muted'
		)

		const unmute = new MessageEmbed()
			.setAuthor(target.username, target.displayAvatarURL({ dynamic: true }))
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		unmute.setDescription(
			`**Desmutar**\nO membro ${target.username} não está mutado.`
		)

		if (!targetMember.roles.cache.has(role.id))
			return await interaction.reply({
				embeds: [unmute],
			})

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('confirmation')
				.setLabel('Sim')
				.setStyle('SUCCESS')
		)

		unmute.setDescription(
			`**Desmutar**\nVocê realmente deseja desmutar o membro ${target.username}?`
		)

		const replied = (await interaction.reply({
			embeds: [unmute],
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
				await targetMember.roles.set(globalMemberMap.get(`mute-${target.id}`))

				unmute.setDescription('Membro desmutado com sucesso')

				await interaction.editReply({
					embeds: [unmute],
					components: [],
				})
			} catch (err) {
				unmute.setDescription('Erro ao tentar desmutar o membro.')

				await interaction.editReply({
					embeds: [unmute],
					components: [],
				})
			}
		})

		collector.on('end', async (collected, reason) => {
			if (reason === 'time')
				unmute.setDescription('O tempo para decidir acabou.')

			await interaction.editReply({
				embeds: [unmute],
				components: [],
			})
		})
	}
}
