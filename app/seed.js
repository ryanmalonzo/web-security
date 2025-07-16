const { MongoClient } = require("mongodb");

async function init() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  // cleanup
  await db.collection("users").deleteMany({});

  await db.collection("users").insertMany([
    { username: "alice", email: "alice@example.com", password: "alice123" },
    { username: "bob", email: "bob@example.com", password: "bob123" },
    { username: "charlie", email: "charlie@example.com", password: "charlie123" },
    { username: "admin", email: "admin@example.com", password: "admin123" },
  ]);

  console.log("DB initialized");
  await client.close();
}

init().catch(console.error);
