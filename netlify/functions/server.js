import express, {Router} from 'express'
import serverless from 'serverless-http'
const server = express()
const router = Router()
server.set('view engine', 'ejs')
router.get('/', (req, res) => res.render('index.ejs'))
server.use('/', router)
export const handler = serverless(server)
router.get('/results', (req, res) => res.render('result.ejs'))
server.use('/results', router)
router.get('/about', (req, res) => res.render('about.ejs'))
server.use('/about', router)