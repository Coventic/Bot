import { SearchResult, Track } from 'erela.js'
import { convertTime } from '../../utils/ConvertTime'
import { createProgressbar } from '../../utils/CreateProgessbar'

import Bot from '../../entities/Bot'
import { log } from '../../utils/Logger'

export interface MusicContext {
	client: Bot
	options: Options
	target?: string | number
}

export interface Options {
	guild: string
	textChannel: string
	voiceChannel: string
}

export interface SeekDuration {
	before: string
	after: string
	to: string
}

export interface SeekObject {
	track: Track
	duration: SeekDuration
}

export interface QueueObject {
	track: TrackObject
	queue: Queue
}

export interface TrackObject extends Track {
	time: string
}

export interface Queue {
	page: number
	endPage: number
	startPage: number
	currentPage: number
	maxPages: number
	current: string
}

export interface NowPlayingObject {
	track: TrackObject
	progressbar: string
}

export interface LoopObject {
	queueRepeat: string
	trackRepeat: string
}

export class Music {
	constructor() {
		log('Ready for play.', 'music')
	}

	async play({ client, target, options }: MusicContext): Promise<SearchResult> {
		let player = client.manager.get(options.guild)

		if (!player) {
			player = client.manager.create({
				guild: options.guild,
				textChannel: options.textChannel,
				voiceChannel: options.voiceChannel,
				volume: 50,
				selfDeafen: true,
				selfMute: false,
			})
		}

		if (player.state !== 'CONNECTED') player.connect()
		let response

		player.set('autoplay', false)

		try {
			response = await player.search(String(target))
		} catch (err) {
			throw new Error('Erro ao procurar a musica.')
		}

		const track = response.tracks[0]

		switch (response.loadType) {
		case 'NO_MATCHES':
			if (!player.queue.current) player.destroy()

			throw new Error('Musica não encontrada.')
			break

		case 'TRACK_LOADED':
			player.queue.add(track)

			if (!player.playing && !player.paused && !player.queue.size) {
				player.play()

				return response
			} else {
				return response
			}
			break

		case 'PLAYLIST_LOADED':
			player.queue.add(response.tracks)

			if (
				!player.playing &&
					!player.paused &&
					player.queue.totalSize === response.tracks.length
			)
				player.play()

			return response
			break

		case 'SEARCH_RESULT':
			player.queue.add(track)

			if (!player.playing && !player.paused && !player.queue.size) {
				player.play()

				return response
			} else {
				return response
			}
			break
		}
	}

	async stop({ client, options }: MusicContext): Promise<void> {
		const player = client.manager.get(options.guild)
		const autoPlay = player.get('autoplay')

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (autoPlay) player.set('autoplay', false)

		player.stop()
		player.queue.clear()
		player.destroy()
	}

	async pause({ client, options }: MusicContext): Promise<Track> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (player.paused) throw new Error('As músicas ja estão pausadas.')

		player.pause(true)

		return player.queue.current as Track
	}

	async resume({ client, options }: MusicContext): Promise<Track> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (!player.paused) throw new Error('As músicas ja estão resumidas.')

		player.pause(false)

		return player.queue.current as Track
	}

	async volume({ client, target, options }: MusicContext): Promise<void> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (Number(target) <= 0 || Number(target) > 100)
			throw new Error(
				'Por favor, escolha um número maior que 0 e maior que 100.'
			)

		player.setVolume(Number(target))
	}

	async skip({ client, options }: MusicContext): Promise<Track> {
		const player = client.manager.get(options.guild)
		const autoPlay = player.get('autoplay')

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (!autoPlay) {
			player.stop()
		} else {
			player.stop()
			player.queue.clear()
			player.set('autoplay', false)
		}

		return player.queue.current as Track
	}

	async jump({ client, target, options }: MusicContext): Promise<void> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (Number(target) < 0 || Number(target) > player.queue.size)
			throw new Error('Digite uma posição válida na fila.')

		player.queue.remove(0, Number(target) - 1)
		player.stop()
	}

	async remove({ client, target, options }: MusicContext): Promise<Track> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento')

		if (Number(target) - 1 > player.queue.size)
			throw new Error('A posição escolhida é maior que a fila.')

		return player.queue.remove(Number(target) - 1)[0]
	}

	async suffle({ client, options }: MusicContext): Promise<void> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		player.queue.shuffle()
	}

	async seek({ client, target, options }: MusicContext): Promise<SeekObject> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		if (Number(target) > player.queue.current.duration)
			throw new Error('O tempo escolhido é maior que a duração da música.')

		player.seek(Number(target))

		return {
			track: player.queue.current as Track,
			duration: {
				before: String(player.queue.current.duration),
				after: convertTime(Number(target)),
				to: Number(target) <= player.position ? 'Forward' : 'Rewind',
			},
		}
	}

	async queue({ client, target, options }: MusicContext): Promise<QueueObject> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		const page = String(target).length && Number(target) ? Number(target) : 1
		const endPage = page * 10
		const startPage = endPage - 10
		const maxPages = Math.ceil(player.queue.length / 10)
		const currentPage = page > maxPages ? maxPages : page

		const tracks = player.queue.slice(startPage, endPage)

		return {
			track: {
				...(player.queue.current as Track),
				time: convertTime(player.queue.current.duration),
			},
			queue: {
				page,
				endPage,
				startPage,
				currentPage,
				maxPages,
				current: tracks
					.map(
						(track, i) =>
							`${startPage + ++i} - ${track.title} \`[${convertTime(
								track.duration
							)}]\``
					)
					.join('\n'),
			},
		}
	}

	async nowPlaying({
		client,
		options,
	}: MusicContext): Promise<NowPlayingObject> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		const total = player.queue.current.duration

		return {
			track: {
				...(player.queue.current as Track),
				time: convertTime(total),
			},
			progressbar: createProgressbar(total, player.position, 20) as string,
		}
	}

	async loop({ client, target, options }: MusicContext): Promise<LoopObject> {
		const player = client.manager.get(options.guild)

		if (!player.queue.current)
			throw new Error('Nenhuma música tocando no momento.')

		switch (target) {
		case 'queue':
			player.setQueueRepeat(!player.queueRepeat)
			break
		case 'track':
			player.setTrackRepeat(!player.trackRepeat)
		}

		return {
			queueRepeat: player.queueRepeat ? 'ativado' : 'desativado',
			trackRepeat: player.trackRepeat ? 'ativado' : 'desativado',
		}
	}
}
