import express, { Router } from "express";
import serverless from "serverless-http";

const api = express();

const router = Router();
router.get("/hello", (req, res) => res.send("Hello World!"));

api.use("/api/", router);

export const handler = serverless(api);

import express from "express";
import path from "path";
import { handler } from "@netlify/functions";  // Import Netlify function handler

const app = express();

// Set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define your routes
app.get("/", (req, res) => {
  res.render("index", { title: "My App" });
});

// Export the handler for Netlify functions using ES modules syntax
export { handler as netlifyHandler };