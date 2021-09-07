import { GuildMember } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'
import MemberRepository from '../data/repositories/member'
import { log } from '../utils/Logger'

export default class GuildMemberAdd implements IEvent {
	constructor(private memberRepository = new MemberRepository()) {}

	public name = 'guildMemberAdd'
	public async invoke(client: Bot, member: GuildMember): Promise<any> {
		if (member.user.bot) return

		try {
			await this.memberRepository.getOrCreate(member)

			log(`Create member ${member.user.username} (${member.id})`, 'database')
		} catch (err) {
			return log(`Create member error: ${err.message}`, 'database')
		}
	}
}
