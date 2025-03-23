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

const genresMap = {
    "Action": 1, "Adventure": 2, "AvantGarde": 5, "AwardWinning": 46, "BoysLove": 28, 
    "Comedy": 4, "Drama": 8, "Fantasy": 10, "GirlsLove": 26, "Gourmet": 47, "Horror": 14, 
    "Mystery": 7, "Romance": 22, "Sci-Fi": 24, "SliceofLife": 36, "Sports": 30, 
    "Supernatural": 37, "Suspense": 41
  };
  
  const themeMap = {
    "Adult Cast": 50, "Anthropomorphic": 51, "CGDCT": 52, "Childcare":53, "Combat Sports": 54, "Crossdressing": 81,
    "Delinquents":55, "Detective":55, "Educational":56, "Gag Humor":57, "Gore": 58, "Harem": 35, "HighStakesGame": 59,
    "Historical": 13, "IdolsFemale": 56, "IdolsMale": 61, "Isekai":62, "Iyashikei":63, "LovePolygon":64, "LoveStatusQuo": 74,
    "MagicalSexShift":65, "MahouShoujo":66, "MartialArts":17, "Mecha": 18, "Medical":67, "Military": 38, "Music":19,
    "Mythology":6, "OrganizedCrime":68, "OtakuCulture":69, "Parody":20,"PerformingArts":70, "Pets":71, "Psychological": 40,
    "Racing":3, "Reincarnation":72, "ReverseHarem":73, "Samurai": 21, "School":23, "Showbiz":75,"Space":29,"StrategyGame":11,
    "SuperPower": 31, "Survival":76,"TeamSports":77,"TimeTravel": 45,"UrbanFantasy":82,"Vampire": 32,"VideoGame":79,
    "Villainess":83,"VisualArts":80,"Workplace":48 
       
  };
  
  const demographicMap = {
    "Josei": 43, "Kids": 15, "Seinen": 42, "Shoujo": 25, "Shounen": 27
  };


router.get('/about', (req, res) => res.render('about.ejs'))
server.use('/about', router)