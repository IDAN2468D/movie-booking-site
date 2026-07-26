const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');
    const bookings = await db.collection('bookings').find().limit(5).toArray();
    console.log('Sample Bookings:', JSON.stringify(bookings, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
