import config from './config'
import Bot from './entities/Bot'

export const client = new Bot()
export const globalMemberMap = new Map<string, any>()

async function bootstrap() {
	await client.eventManager.handle()

	await client.interactionCommandManager.handle()

	client.login(config.client.token)
}

bootstrap()
