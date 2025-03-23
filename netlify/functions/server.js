import express, {Router} from 'express'
import serverless from 'serverless-http'
import express, { response } from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'node:url';

export const handler = serverless(server)
const server = express()
const router = Router()
server.set('view engine', 'ejs')
app.use(cors());

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

router.get('/', async (req, res) => res.render('index.ejs'))
server.use('/', router)

router.get('/results', async(req, res) => res.render('result.ejs'))
server.use('/results', router)


router.get('/about', (req, res) => res.render('about.ejs'))
server.use('/about', router)