import { SavedUser, UserDocument } from '../../models/User'
import { DatabaseWrapper } from '../../index'
import SnowflakeEntity from '../../../entities/Snowflake'

export default class UserRepository extends DatabaseWrapper<
	SnowflakeEntity,
	UserDocument
> {
	async getOrCreate({ id }: SnowflakeEntity) {
		const savedUser = await SavedUser.findById(id)

		return savedUser ?? (await this.create({ id }))
	}

	async create({ id }: SnowflakeEntity) {
		return new SavedUser({ _id: id }).save()
	}

	async delete({ id }: SnowflakeEntity) {
		return await SavedUser.findByIdAndDelete({ _id: id })
	}
}
