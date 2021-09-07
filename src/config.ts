import dotenv from 'dotenv'
dotenv.config()

export default {
	client: {
		id: '',
		token: process.env.CLIENT_TOKEN,
		secret: process.env.CLIENT_SECRET,
		owner: '',
		defaultColor: 0x2f3136,
	},
	database: {
		uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@krowka.wqxzy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
		params: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		},
	},
	api: {
		prefix: '/',
		secret: '',
		callback:
			'',
	},
	lavalink: [
		{
			host: '',
			port: 443,
			password: '',
			retryDelay: 3000,
			secure: true,
		},
	],
	spotify: {
		id: '',
		secret: '',
	},
}
