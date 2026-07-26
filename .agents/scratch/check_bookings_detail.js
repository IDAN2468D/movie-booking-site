const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');
    const bookings = await db.collection('bookings').find({}).toArray();
    console.log('Total bookings:', bookings.length);
    bookings.forEach((b, i) => {
      console.log(`[${i}] ID: ${b._id}, movie: ${b.movie?.id} - ${b.movie?.title || b.movie?.displayTitle}, seats: ${JSON.stringify(b.seats)}, date: ${b.date}, showtime: ${b.showtime}, createdAt: ${b.createdAt}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
