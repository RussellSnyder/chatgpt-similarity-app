//import modules: express, dotenv
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const app = express();
const { EventEmitter } = require("events");
const OpenAI = require("openai");
//accept json data in requests

app.use(cors());

app.use(express.json());

//setup environment variables
dotenv.config();

const getEmbedding = require("./utils/getEmbedding");
const cosineSimilarity = require("./utils/cosineSimilarity");
const calculateCost = require("./utils/calculateCost");

//build openai instance using OpenAIApi
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//post request to /api/chatgpt
app.post("/api/similarity", async (req, res) => {
  try {
    //extract the text from the request body
    const { text1, text2 } = req.body;

    // embedding 1
    const embedding1 = await getEmbedding(text1);
    const embedding2 = await getEmbedding(text2);

    const similarity = cosineSimilarity(embedding1, embedding2);
    const cost = calculateCost([text1, text2]);

    res.json({ similarity, cost, embedding1, embedding2 });
  } catch (error) {
    console.error(error);
  }
});

//set the PORT
const PORT = process.env.SERVER_PORT || 5001;

//start the server on the chosen PORT
app.listen(PORT, console.log(`Server started on port ${PORT}`));
