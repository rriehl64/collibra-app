// MongoDB script to insert users into the users collection
// Run with: mongo --port <port> <database_name> insert-users.js

// Define the users to insert
const users = [
  {
    _id: ObjectId("68858d836074df1f2ca7134c"),
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "$2b$10$sjAk3PqZ1KOiKVoHzNVUIO1Ig/kJ0MvPcM9JXeTlQc/Shy1moP4iK",
    department: "IT",
    jobTitle: "System Administrator",
    assignedDomains: [],
    preferences: {},
    createdAt: ISODate("2025-07-27T02:22:59.773+00:00"),
    lastActive: ISODate("2025-08-15T01:24:14.062+00:00"),
    __v: 0
  },
  {
    _id: ObjectId("68858d836074df1f2ca7134d"),
    name: "Data Steward",
    email: "steward@example.com",
    role: "data-steward",
    password: "$2b$10$5KOkAR4e1zYQ.0H9ODGBke9GFPtBd6JPuomDfYvP/QW30T6OTlJYG",
    department: "Data Management",
    jobTitle: "Data Governance Lead",
    assignedDomains: [],
    preferences: {},
    createdAt: ISODate("2025-07-27T02:22:59.774+00:00"),
    lastActive: ISODate("2025-07-27T02:22:59.774+00:00"),
    __v: 0
  },
  {
    _id: ObjectId("68858d836074df1f2ca7134e"),
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    password: "$2b$10$2FWXGtf7u7gIRfDmMZvKo./5UuXJSLY2w/gSz4VnKjOhpxrDR0ZcK",
    department: "Marketing",
    jobTitle: "Marketing Analyst",
    assignedDomains: [],
    preferences: {},
    createdAt: ISODate("2025-07-27T02:22:59.774+00:00"),
    lastActive: ISODate("2025-07-27T02:22:59.775+00:00"),
    __v: 0
  }
];

// Insert the users into the collection
// This will fail if users with these IDs already exist
print("Attempting to insert users...");
try {
  db.users.insertMany(users, { ordered: false });
  print("Users inserted successfully!");
} catch (e) {
  print("Error occurred during insertion: " + e.message);
  print("Some users may have been inserted.");
}

// Alternative: upsert (update if exists, insert if not)
print("\nAlternatively, upserting users (update if exists)...");
users.forEach(user => {
  db.users.updateOne(
    { _id: user._id },
    { $set: user },
    { upsert: true }
  );
});
print("Users upserted successfully!");

// Count users in collection
const count = db.users.countDocuments();
print(`\nTotal users in collection: ${count}`);

// List all users (name and email only)
print("\nUsers in the database:");
db.users.find({}, { name: 1, email: 1, role: 1 }).forEach(user => {
  print(`${user.name} (${user.email}) - ${user.role}`);
});
