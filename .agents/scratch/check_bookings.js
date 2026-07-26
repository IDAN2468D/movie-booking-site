const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Most likely collection names: 'bookings', 'purchases', 'orders'
    const targetCollection = collections.find(c => ['bookings', 'purchases', 'orders'].includes(c.name))?.name || 'bookings';
    
    const count = await db.collection(targetCollection).countDocuments();
    console.log(`Count in ${targetCollection}:`, count);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
