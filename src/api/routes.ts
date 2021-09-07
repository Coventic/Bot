import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.get('/oauth/login', passport.authenticate('discord'))
router.get(
	'/oauth/redirect',
	passport.authenticate('discord', {
		failureRedirect: '/oauth/error'
	}),
	(request, response) => {
		response.redirect('/')	
	}
)

router.get('/', (request, response) => {
	if (!request.user)
		return response.redirect('/oauth/login')

	console.log(request.user)

	response.render(__dirname + '/views/index.ejs')
})

export default router
