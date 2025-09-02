// import mongoose from 'mongoose';

// // Use a fallback in-memory database if MongoDB is not available
// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-app';

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//       maxPoolSize: 10,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log('✅ Connected to MongoDB');
//       return mongoose;
//     }).catch((error) => {
//       console.error('❌ MongoDB connection failed:', error.message);
//       console.log('💡 To fix this:');
//       console.log('1. Install MongoDB: brew install mongodb-community');
//       console.log('2. Start MongoDB: brew services start mongodb-community');
//       console.log('3. Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env.local');
//       throw error;
//     });
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

//export default dbConnect;

import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sb9984108_db_user:N98UgcTTwDEarKI@cluster0.xxxxx.mongodb.net/";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("myDatabase"); // create/use database
    const collection = database.collection("myCollection"); // create/use collection

    const doc = { name: "Saikat", role: "Developer" };
    await collection.insertOne(doc);

    console.log("Document inserted!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

export default run;