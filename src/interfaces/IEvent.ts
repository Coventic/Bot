import Bot from '../entities/Bot'

export interface IEventContext {
	client: string
	data?: string
}

export interface IEvent {
	name: string
	invoke(...args): Promise<any>
}
