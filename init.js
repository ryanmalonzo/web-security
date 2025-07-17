db = db.getSiblingDB('tp');

db.createCollection("reviews");

db.reviews.insertMany([
  {
    productName: "iPhone 15 Pro",
    rating: 5,
    comment: "Amazing camera quality and performance!",
    reviewer: {
      username: "alice_tech",
      email: "alice@example.com",
      fullName: "Alice Johnson",
      passwordHash: "$2b$10$abc123defghijklmnopqrstuvwxyz",
      verified: true,
      joinDate: "2023-01-15"
    },
    reviewDate: "2024-01-20",
    helpful: 23,
    verified_purchase: true
  },
  {
    productName: "Samsung Galaxy S24",
    rating: 4,
    comment: "Great phone but battery could be better.",
    reviewer: {
      username: "bob_reviewer",
      email: "bob@example.com", 
      fullName: "Bob Smith",
      passwordHash: "$2b$10$def456ghijklmnopqrstuvwxyzabc",
      verified: true,
      joinDate: "2023-03-22"
    },
    reviewDate: "2024-02-15",
    helpful: 12,
    verified_purchase: true
  },
  {
    productName: "MacBook Pro M3",
    rating: 5,
    comment: "Perfect for development work. Fast and reliable.",
    reviewer: {
      username: "charlie_dev",
      email: "charlie@example.com",
      fullName: "Charlie Brown",
      passwordHash: "$2b$10$ghi789jklmnopqrstuvwxyzabcdef",
      verified: false,
      joinDate: "2023-06-10"
    },
    reviewDate: "2024-03-01",
    helpful: 45,
    verified_purchase: true
  },
  {
    productName: "Dell XPS 13",
    rating: 3,
    comment: "Decent laptop but overpriced for what you get.",
    reviewer: {
      username: "admin_user",
      email: "admin@example.com",
      fullName: "Admin User",
      passwordHash: "$2b$10$jkl012mnopqrstuvwxyzabcdefghi",
      verified: true,
      joinDate: "2022-12-01"
    },
    reviewDate: "2024-01-30",
    helpful: 8,
    verified_purchase: false
  },
  {
    productName: "AirPods Pro",
    rating: 4,
    comment: "Great noise cancellation, comfortable fit.",
    reviewer: {
      username: "sarah_music",
      email: "sarah@example.com",
      fullName: "Sarah Wilson",
      passwordHash: "$2b$10$mno345pqrstuvwxyzabcdefghijkl",
      verified: true,
      joinDate: "2023-08-14"
    },
    reviewDate: "2024-02-28",
    helpful: 19,
    verified_purchase: true
  }
]);

print("Database 'tp' initialized with sample reviews");