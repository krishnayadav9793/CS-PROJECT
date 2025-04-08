require("dotenv").config(); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500", // allow frontend origin from .env
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log(" MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
  });


const attractionSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  wikipedia: String
});

const citySchema = new mongoose.Schema({
  city: String,
  attractions: [attractionSchema]
});

const stateSchema = new mongoose.Schema({
  state: String,
  cities: [citySchema]
});

const Destination = mongoose.model("Destination", stateSchema, "destinations");


app.get("/api/destinations", async (req, res) => {
  const stateName = req.query.state;

  try {
    const result = await Destination.findOne({ state: stateName });

    if (!result) {
      console.warn(` No data found for state: ${stateName}`);
      return res.status(404).json({ error: "State not found" });
    }

    res.json(result);
  } catch (err) {
    console.error(" Error during /api/destinations:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
