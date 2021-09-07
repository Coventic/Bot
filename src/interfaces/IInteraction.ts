import { CommandInteraction, PermissionString } from 'discord.js'
import Bot from '../entities/Bot'

export interface IInteractionOptions {
	name: string
	description: string
	type: InteractionTypes
	required: boolean
}

export enum InteractionTypes {
	SUB_COMMAND = 1,
	SUB_COMMAND_GROUP = 2,
	STRING = 3,
	INTEGER = 4,
	BOOLEAN = 5,
	USER = 6,
	CHANNEL = 7,
	ROLE = 8,
	MENTIONABLE = 9,
	NUMBER = 10,
}

export interface IInteractionContext {
	client: Bot
	interaction: CommandInteraction
}

export interface IInteractionConfig {
	name: string
	description: string
	options?: IInteractionOptions[]
	permissions: PermissionString[]
	maintenance: boolean
	disabled: boolean
}

export interface IInteractionCommand {
	config?: IInteractionConfig
	invoke({ ...context }: IInteractionContext): Promise<any>
}
