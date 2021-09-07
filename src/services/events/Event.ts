import { readdir as read } from 'fs'
import { promisify } from 'util'

import Bot from '../../entities/Bot'
import { log } from '../../utils/Logger'
import { IEvent } from '../../interfaces/IEvent'

const readdir = promisify(read)

export default class EventManager {
	constructor(private client: Bot) {}

	private handlers = new Array<IEvent>()
	private customHandlers = new Array<IEvent>()
	private lavalinkHandlers = new Array<IEvent>()

	public async handle(): Promise<void> {
		const handler = await readdir('./src/events')
		for (const prop of handler.filter(
			(e) => e !== 'custom' && e !== 'lavalink'
		)) {
			const { default: Event } = await import(`../../events/${prop}`)

			this.handlers.push(new Event())
		}

		const customHandler = await readdir('./src/events/custom')
		for (const prop of customHandler) {
			const { default: Event } = await import(`../../events/custom/${prop}`)

			this.customHandlers.push(new Event())
		}

		const lavalinkHandler = await readdir('./src/events/lavalink')
		for (const prop of lavalinkHandler) {
			const { default: Event } = await import(`../../events/lavalink/${prop}`)

			this.lavalinkHandlers.push(new Event())
		}

		await this.hookEvents()
	}

	public async hookEvents(): Promise<void> {
		for (const handler of this.handlers) {
			this.client.on(handler.name, handler.invoke.bind(handler, this.client))

			log(`Event: ${handler.name}`, 'loading')
		}

		for (const handler of this.customHandlers) {
			this.client.eventHook.on(
				handler.name,
				handler.invoke.bind(handler, this.client)
			)

			log(`Custom event: ${handler.name}`, 'loading')
		}

		for (const handler of this.lavalinkHandlers) {
			this.client.manager.on(
				handler.name,
				handler.invoke.bind(handler, this.client)
			)

			log(`Lavalink event: ${handler.name}`, 'loading')
		}
	}
}
