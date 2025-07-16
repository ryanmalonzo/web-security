db = db.getSiblingDB('tp');

db.createCollection("users");

db.users.insertMany([
  { username: "alice", email: "alice@example.com", password: "alice123" },
  { username: "bob", email: "bob@example.com", password: "bob123" },
  { username: "charlie", email: "charlie@example.com", password: "charlie123" },
  { username: "admin", email: "admin@example.com", password: "admin123" },
]);

print("Database 'tp' initialized with sample users");