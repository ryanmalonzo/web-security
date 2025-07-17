const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db();

  // Vulnerable endpoint
  app.get("/reviews", async (req, res) => {
    let q = req.query.id;
    try {
      q = JSON.parse(q);
      const reviews = await db.collection("reviews").find(q).toArray();
      res.json(reviews);
    } catch (e) {
      const reviews = await db.collection("reviews").find({ _id: new ObjectId(q) }).toArray();
      res.json(reviews);
    }
  });

  // Secure endpoint
  app.get("/reviews/safe", async (req, res) => {
    const reviewId = req.query.id;
    const reviews = await db.collection("reviews").find({ _id: new ObjectId(reviewId) }).toArray();
    res.json(reviews);
  });

  // Completely secure endpoint - no error leakage
  app.get("/reviews/safe/v2", async (req, res) => {
    const reviewId = req.query.id;
    
    // Validate that id is a valid ObjectId string
    if (!reviewId || typeof reviewId !== 'string' || !ObjectId.isValid(reviewId)) {
      return res.json([]);
    }
    
    try {
      const reviews = await db.collection("reviews").find({ _id: new ObjectId(reviewId) }).toArray();
      res.json(reviews);
    } catch (e) {
      res.json([]);
    }
  });

  app.listen(3000, () => console.log("Listening on port 3000"));
}

main().catch(console.error);
