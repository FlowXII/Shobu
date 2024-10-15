import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

    const database = client.db("core");
    const collection = database.collection("tournaments");
    const cursor = collection.find({}); // Find all documents
    console.log(cursor);
    const results = await cursor.toArray(); // Convert cursor to array
    console.log(results);
  } finally {
    await client.close();
  }
}

export default run; // Export the run function as default
