const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

async function main() {
  await client.connect();
  const db = client.db();

  // Vulnerable endpoint
  app.get("/search", async (req, res) => {
    let q = req.query.user;
    try {
      q = JSON.parse(q);
      const users = await db.collection("users").find(q).toArray();
      res.json(users);
    } catch (e) {
      const users = await db.collection("users").find({ username: q }).toArray();
      res.json(users);
    }
  });

  // Secure endpoint
  app.get("/search/safe", async (req, res) => {
    const username = req.query.user;
    const users = await db.collection("users").find({ username }).toArray();
    res.json(users);
  });

  app.listen(3000, () => console.log("Listening on port 3000"));
}

main().catch(console.error);
