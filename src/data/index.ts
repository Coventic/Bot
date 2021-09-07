import { Document, connect } from 'mongoose'
import config from '../config'
import { log } from '../utils/Logger'

connect(config.database.uri, { ...config.database.params })
	.then(() => log('Ready for Hooks', 'database'))
	.catch((err) => log(`Error: ${err.message}`, 'database'))

export abstract class DatabaseWrapper<T1, T2 extends Document> {
	get(identifier: T1) {
		return this.getOrCreate(identifier)
	}

	protected abstract getOrCreate(type: T1): Promise<T2>
	protected abstract create(type: T1): Promise<T2>
	protected abstract delete(type: T1): Promise<T2>

	save(savedType: T2) {
		return savedType.save()
	}
}
