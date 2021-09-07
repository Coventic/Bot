import { GuildDocument, SavedGuild } from '../../models/Guild'
import { DatabaseWrapper } from '../../index'
import SnowflakeEntity from '../../../entities/Snowflake'

export default class GuildRepository extends DatabaseWrapper<
	SnowflakeEntity,
	GuildDocument
> {
	async getOrCreate({ id }: SnowflakeEntity) {
		const savedGuild = await SavedGuild.findById(id)

		return savedGuild ?? (await this.create({ id }))
	}

	async create({ id }: SnowflakeEntity) {
		return new SavedGuild({ _id: id }).save()
	}

	async delete({ id }: SnowflakeEntity) {
		return await SavedGuild.findOneAndDelete({ _id: id })
	}
}
