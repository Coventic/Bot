import { model, Schema, Document } from 'mongoose'

export class Module {
	enabled = true
}

export interface LogEvent {
	enabled: boolean
	channel: string
	event: EventType
	message: string
}

export type EventType =
	| 'BAN'
	| 'WARN'
	| 'UNBAN'
	| 'CONFIG_UPDATE'
	| 'LEVEL_UP'
	| 'MEMBER_JOIN'
	| 'MEMBER_LEAVE'
	| 'MESSAGE_DELETED'

export type MessageFilter =
	| 'BAN_LINKS'
	| 'BAN_WORDS'
	| 'MASS_MENTIONS'
	| 'MASS_CAPS'
	| 'MASS_ATTACHMENTS'

export interface AutoPunishment {
	warnings: number
	minutes: number
	type: 'BAN' | 'KICK'
}

export interface LevelRole {
	level: number
	role: string
}

export class MusicModule extends Module {}

export class LogsModule extends Module {
	events: LogEvent[] = []
}

export class LevelingModule extends Module {
	levelRoles: LevelRole[] = []
	ignoredRoles: string[] = []
	xpPerMessage = 50
	maxMessagesPerMinute = 3
}

export class AutoModModule extends Module {
	ignoredRoles: string[] = []
	autoDeleteMessages = true
	filters: MessageFilter[] = []
	banWords: string[] = []
	banLinks: string[] = []
	autoWarnUsers = true
	filterThreshold = 5
	punishments: AutoPunishment[]
}

export class GuildSettings {
	ignoredChannels: string[] = []
	autoRoles: string[] = []
	prefix = '.'
}

export interface GuildDocument extends Document {
	_id: string
	settings: GuildSettings
	logsModule: LogsModule
	musicModule: MusicModule
	autoModModule: AutoModModule
	levelingModule: LevelingModule
}

const GuildSchema = new Schema(
	{
		_id: Schema.Types.String,
		settings: { type: Schema.Types.Mixed, default: new GuildSettings() },
		logModule: { type: Schema.Types.Mixed, default: new LogsModule() },
		musicModule: { type: Schema.Types.Mixed, default: new MusicModule() },
		autoModModule: { type: Schema.Types.Mixed, default: new AutoModModule() },
		levelingModule: { type: Schema.Types.Mixed, default: new LevelingModule() },
	},
	{
		timestamps: true,
	}
)

export const SavedGuild = model<GuildDocument>('Guild', GuildSchema)
