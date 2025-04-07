const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tourismDB")
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// ✅ Schema Definitions
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

// ✅ Model based on state schema
const Destination = mongoose.model("Destination", stateSchema, "destinations");

// ✅ API route to get data by state
app.get("/api/destinations", async (req, res) => {
  const stateName = req.query.state;

  try {
    const result = await Destination.findOne({ state: stateName });

    if (!result) {
      return res.status(404).json({ error: "State not found" });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
