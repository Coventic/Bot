import { Role } from 'discord.js'
import { model, Schema, Document } from 'mongoose'

export interface Warning {
	reason: string
	instigatorId: string
	at: Date
}

export interface MemberDocument extends Document {
	userId: string
	guildId: string
	recentMessages: Date[]
	warnings: Warning[]
	xp: number
}

const MemberSchema = new Schema(
	{
		_id: Schema.Types.String,
		guildId: Schema.Types.String,
		recentMessages: { type: Schema.Types.Array, default: [] },
		warnings: { type: Schema.Types.Array, default: [] },
		xp: { type: Schema.Types.Number, default: 0 },
	},
	{
		timestamps: true,
	}
)

export const SavedMember = model<MemberDocument>('Member', MemberSchema)
