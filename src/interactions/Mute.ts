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
	Role,
	TextChannel,
} from 'discord.js'

import { globalMemberMap } from '../index'

import ms from 'ms'
import config from '../config'

export default class Mute implements IInteractionCommand {
	constructor() {}

	public config: IInteractionConfig = {
		name: 'mute',
		description: 'Muta o membro mencionado.',
		permissions: ['MUTE_MEMBERS'],
		maintenance: false,
		disabled: false,
		options: [
			{
				name: 'target',
				description: 'Mencione o membro para mutar.',
				type: InteractionTypes.USER,
				required: true,
			},
			{
				name: 'time',
				description: 'Digite o tempo que o membro ficara mutado.',
				type: InteractionTypes.STRING,
				required: true,
			},
		],
	}

	public async invoke({
		interaction,
		client,
	}: IInteractionContext): Promise<any> {
		const target = interaction.options.getUser('target')
		const time = interaction.options.getString('time')
		let role = interaction.guild.roles.cache.find(
			(role) => role.name === 'Muted'
		)

		if (!role) {
			role = await interaction.guild.roles.create({
				name: 'Muted',
				permissions: [],
			})
		}

		const mute = new MessageEmbed()
			.setAuthor(target.username, target.displayAvatarURL({ dynamic: true }))
			.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
			.setColor(config.client.defaultColor)
			.setFooter(`© ${interaction.guild.name}™`)

		const targetMember = interaction.guild.members.cache.get(target.id)

		globalMemberMap.set(
			`mute-${target.id}`,
			targetMember.roles.cache.map((e) => e)
		)

		interaction.guild.channels.cache
			.filter((channel) => channel.type === 'GUILD_TEXT')
			.forEach((channel: TextChannel) =>
				channel.permissionsFor(role).remove(['SEND_MESSAGES', 'ADD_REACTIONS'])
			)

		mute.setDescription(
			`**Mutar**\nO membro ${target.username} ja está mutado.`
		)

		if (targetMember.roles.cache.has(role.id))
			return await interaction.reply({
				embeds: [mute],
			})

		mute.setDescription('**Mutar**\nVocê não pode me mutar.')

		if (target.id === client.user.id)
			return await interaction.reply({
				embeds: [mute],
			})

		mute.setDescription('**Mutar**\nVocê não pode mutar a sí mesmo.')

		if (target.id === interaction.user.id)
			return await interaction.reply({
				embeds: [mute],
			})

		const actionRow = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId('confirmation')
				.setLabel('Sim')
				.setStyle('SUCCESS')
		)

		mute.setDescription(
			`**Mutar**\nVocê realmente deseja mutar o membro ${target.username}?`
		)

		const replied = (await interaction.reply({
			embeds: [mute],
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
				await targetMember.roles.set([role.id])

				mute.setDescription('Membro mutado com sucesso.')

				await interaction.editReply({
					embeds: [mute],
					components: [],
				})
			} catch (err) {
				mute.setDescription('Erro ao tentar mutar o membro.')

				await interaction.editReply({
					embeds: [mute],
					components: [],
				})
			}
		})

		collector.on('end', async (collected, reason) => {
			if (reason === 'time') mute.setDescription('O tempo para decidir acabou.')

			await interaction.editReply({
				embeds: [mute],
				components: [],
			})
		})

		setTimeout(async () => {
			if (!targetMember.roles.cache.has(role.id)) return

			try {
				await targetMember.roles.set(globalMemberMap.get(`mute-${target.id}`))

				await interaction.editReply({
					content: `Membro desmutado após ${time}.`,
					components: [],
				})
			} catch (err) {
				await interaction.editReply({
					content: 'Erro ao tentar desmutar o membro.',
					components: [],
				})
			}
		}, ms(time))
	}
}
