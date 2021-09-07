import { Client, Intents } from 'discord.js'
import { EventEmitter } from 'stream'
import { Manager, Payload } from 'erela.js'
import Spotify from 'erela.js-spotify'
import EventManager from '../services/events/Event'
import InteractionCommandManager from '../services/commands/Interaction'
import config from '../config'

export default class Bot extends Client {
	constructor() {
		super({
			intents: [
				Intents.FLAGS.GUILDS,
				Intents.FLAGS.GUILD_BANS,
				Intents.FLAGS.GUILD_INTEGRATIONS,
				Intents.FLAGS.GUILD_INVITES,
				Intents.FLAGS.GUILD_MEMBERS,
				Intents.FLAGS.GUILD_MESSAGES,
				Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
				Intents.FLAGS.GUILD_VOICE_STATES,
			],
		})
	}

	public eventHook = new EventEmitter()
	public eventManager = new EventManager(this)
	public interactionCommandManager = new InteractionCommandManager(this)

	public manager = new Manager({
		send: (id: string, payload: Payload) => {
			const guild = this.guilds.cache.get(id)
			if (guild) guild.shard.send(payload)
		},
		plugins: [
			new Spotify({
				clientID: config.spotify.id,
				clientSecret: config.spotify.secret,
			}),
		],
		nodes: config.lavalink,
		autoPlay: true,
	})
}
