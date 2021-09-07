import { log } from '../utils/Logger'
import { app } from './app'

export default function server(): void {
	app.listen(3001, () => {
		log('Ready on port 3001', 'api')
	})
}
