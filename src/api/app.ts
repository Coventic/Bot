import { v4 } from 'uuid'
import { renderFile } from 'ejs'
import { resolve, sep } from 'path'

import DiscordStrategy from './strategies/Discord'
import express from 'express'
import store from 'connect-mongo'
import session from 'express-session'
import passport from 'passport'
import helmet from 'helmet'
import morgan from 'morgan'

import config from '../config'
import routes from './routes'

const app = express()

passport.use(DiscordStrategy)

app.use('/public', express.static(resolve(`.${sep}public`)))

app.use(morgan('dev'))

app.use(
	session({
		secret: config.api.secret,
		name: 'discord',
		saveUninitialized: false,
		resave: false,
		genid: () => {
			return v4().replace(/ -/g, '')
		},
		cookie: {
			maxAge: 60000 * 60 * 24,
		},
		store: store.create({
			mongoUrl: config.database.uri,
			dbName: 'session',
		}),
	})
)

app.use(passport.initialize())
app.use(passport.session())

app.use(helmet())

app.engine('html', renderFile)
app.set('view engine', 'html')

app.use(config.api.prefix, routes)

export { app }
