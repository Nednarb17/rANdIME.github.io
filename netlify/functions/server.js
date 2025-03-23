import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import serverless from "serverless-http";

const server = express();
const router = express.Router();
server.use(cors());

server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.json());

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

server.set("views", path.join(__dirname, "../views")); // Adjust path for Netlify Functions
server.use(express.static(path.join(__dirname, "../public"))); // Ensure static files load

// Routes
router.get("/", (req, res) => res.render("index", { error: null }));
router.get("/results", (req, res) => res.render("result", { error: null }));
router.get("/about", (req, res) => res.render("about", { error: null }));

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


  router.post("/results", async (req, res) => {
    try {
      const {
        genres,
        theme,
        type,
        rating,
        Demographics,
        year,
        minscore,
        maxscore,
        searchrelated,
        randomButton,
        episodes,
      } = req.body;
  
      let apiUrl = "";
      let queryParams = [];
      let combinedGenres = [];
      let queryString = "";
      let animeEz = null;
      let error = null;
  
      if (searchrelated) {
        try {
          const { searchrelated } = req.body; // Retrieve the user's input
          console.log("User input:", searchrelated);
        
        // Check if the input is empty
        if (!searchrelated || searchrelated.trim() === "") {
            return res.render("index", { error: "Please enter a valid anime name." });
        }
  
          let searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent( // initial search input
            searchrelated
          )}`;
          let response = await axios.get(searchUrl);
          let animeData = response.data.data; //get data from search
          console.log("API Response Data:", animeData); 
  
          if (!animeData || animeData.length === 0) {
            return res.render("index", { error: "No Anime exist with that name" });
          }
  
          let anime = animeData[0];// First anime result
          const animeId = anime.mal_id; // Extract anime mal_id
  
          let recommendResponse = await axios.get(
            `https://api.jikan.moe/v4/anime/${animeId}/recommendations`
          );
          let recommendations = recommendResponse.data.data;
  
          if (!recommendations || recommendations.length === 0) {
            return res.render("index", { error: "No recommendations found sorry :(" });
          }
  
          const randomIndex = Math.floor(Math.random() * recommendations.length); //select a random anime
          let recommend = recommendations[randomIndex].entry; // Extract recommended anime entry
          let recommendid = recommend.mal_id; // Get Recommended anime id
          console.log("Recommended Anime ID:", recommendid);
  
          let recommendInfo = await axios.get(
            `https://api.jikan.moe/v4/anime/${recommendid}`
          );
          animeEz = recommendInfo.data.data; // Store the final recommended anime info
          console.log("Recommended Anime:", animeEz);
  
          if (!animeEz) {
            return res.render("index", { error: "No Anime found" });
          }
  
          let animebanner = [];
          try {
            let bannerResponse = await axios.get(
              `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(   // Getting Banner
                animeEz.title
              )}`
            );
            animebanner = bannerResponse.data.data;
          } catch (err) {
            console.error("Banner API error:", err.message);
          }
  
          return res.render("result", { anime, animeEz, animebanner }); // final search return
        } catch (err) {
          console.error("Search-related error:", err.message);
          return res.render("index", { error: "I couldn't find an anime. Try again!" });
        }
      } else if (randomButton) {
        try {
          apiUrl = "https://api.jikan.moe/v4/random/anime";
          let response = await axios.get(apiUrl);
          animeEz = response.data.data;
          console.log("randombutton", animeEz)
  
          let animebanner = [];
          try {
            let bannerResponse = await axios.get(
              `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
                animeEz.title
              )}`
            );
            animebanner = bannerResponse.data.data;
          } catch (err) {
            console.error("Banner API error:", err.message);
          }
  
          return res.render("result", { animeEz, animebanner });
        } catch (err) {
          console.error("Random anime error:", err.message);
          return res.render("index", { error: "I couldn't find an anime. Try again!" });
        }
      } else {
        //  Convert genre,theme,demographics names to IDs
        if (genres) {
          let genresIDs = Array.isArray(genres)
            ? genres.map((g) => genresMap[g]).filter(Boolean)
            : [genresMap[genres]];
          if (genresIDs.length) combinedGenres.push(...genresIDs);
        }
  
        if (theme) {
          let themeIDs = Array.isArray(theme)
            ? theme.map((t) => themeMap[t]).filter(Boolean)
            : [themeMap[theme]];
          if (themeIDs.length) combinedGenres.push(...themeIDs);
        }
  
        if (Demographics) {
          let demoID = demographicMap[Demographics];
          if (demoID) combinedGenres.push(demoID);
        }
        // Add genres (including themes and demographics) to the query params
        if (combinedGenres.length) {
          queryParams.push(`genres=${combinedGenres.join(",")}`);
        }
  
        if (type) queryParams.push(`type=${type}`);
  
        if (rating) {
          const validRatings = ["g", "pg", "pg13", "r17", "r"];
          if (validRatings.includes(rating)) {
            queryParams.push(`rating=${rating}`);
          }
        }
  
        if (minscore) {
          const minScoreRatings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
          if (minScoreRatings.includes(minscore)) {
              queryParams.push(`min_score=${minscore}`);
          }
      }
  
      if (maxscore) {
        const maxScoreRatings = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        if (maxScoreRatings.includes(maxscore)) {
            queryParams.push(`max_score=${maxscore}`);
        }
    }
  
        if (year) {
          queryParams.push(`start_date=${year}-01-01`);
          queryParams.push(`end_date=${year}-12-31`);
        }
        // Add them all
        queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
        apiUrl = `https://api.jikan.moe/v4/anime${queryString}`;
  
        let response = await axios.get(apiUrl);
        let anime = response.data.data;
        let animepage = response.data.pagination.last_visible_page;   // check how many pages 
        //randomize to a page
        console.log("Anime before filtering:", anime.length);
        if (animepage > 1) {
          const randomPage = Math.floor(Math.random() * animepage) + 1;
          const randomPageApiUrl = `https://api.jikan.moe/v4/anime?page=${randomPage}&${queryParams.join("&")}`;
          let newResponse = await axios.get(randomPageApiUrl);
          anime = newResponse.data.data;
        }
  
        if (req.body.episodes === "true") {
          anime = anime.filter((a) => a.episodes && a.episodes >= 1 && a.episodes <= 13);
        }
  
        let selectedAnime = anime.length > 0 ? anime[Math.floor(Math.random() * anime.length)] : null;
  
        if (!selectedAnime) {
          const errorMessages = [
            "Failed to find an anime. Try again!",
            "I couldn't find an anime. What did you do?",
            "What did you enter weirdo? Just try again",
            "Oh, you thought that would be a real anime? Cute." ,
            "Your request was so rare, even the Dragon Balls can't grant it!",
            "This search is as empty as a filler episode… Try a new one!",
            "Nothing came back, Unlucky",
            "Maybe try searching for something that actually exists?",
            "Nothing found. Just like your ability to make good choices.",
            "No anime found. Maybe your taste is too niche for reality?",
            "No anime? Maybe fate wants you to rewatch an old favorite!",
            "No anime found. Have you tried turning it off and on again?",
            "We couldn't find what you were looking for, but i believe in you!",
            "Your search has been sent to another timeline. We'll get back to you in 3017.",
            "Nothing found… but an ominous presence now lingers in your room.",
            "Your anime was last seen running from tax evasion charges.",
            "Oh Man i don't know what happened",
            "Your anime was found, but it was guarded by a Final Boss. We were not prepared.",
            "I searched high and low, but all I found was disappointment. Specifically, in you.",
            "I triple-checked, and nope, still no results. Have you considered making better choices?",
            "Even MAL's deepest archives have never heard of this fever dream you just selected.",
            "Might as well just go touch some grass because i think you broke me.",
            "404: Anime Not Found. But please, keep trying. I love watching people struggle.",
            "Even my code is refusing to process whatever the hell you entered.",
            "Failed to find an anime. Try again!",
            "I couldn't find an anime. What did you do?",
            "What did you enter weirdo? Just try again",
            "L"
          ];
    
          // Select a random error message
          const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
  
          return res.render("index", { error: randomError });
        }
  
  
        console.log("Anime after filtering:", anime.length);
         console.log("theone",selectedAnime);
        animeEz = selectedAnime;
        let animebanner = [];
  
        try {
          let bannerResponse = await axios.get(
            `https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
              animeEz.title
            )}`
          );
          animebanner = bannerResponse.data.data;
        } catch (err) {
          console.error("Banner API error:", err.message);
        }
  
        return res.render("result", { animeEz, animebanner });
      }
    } catch (error) {
      console.error("Error fetching anime:", error.message);
      return res.render("index", { error: "An unexpected error occurred. Please try again later!" });
    }
    
  });
  







 

  server.use("/", router);

export const handler = serverless(server)