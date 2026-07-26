const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');
    const users = await db.collection('users').find({}).toArray();
    console.log('Users in DB:', users.length);
    users.forEach(u => {
      console.log(`User: ${u.email}, name: ${u.name}, points: ${u.points}`);
    });

    const bookings = await db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(5).toArray();
    console.log('\nLatest 5 Bookings:');
    bookings.forEach(b => {
      console.log(`Booking ID: ${b._id}, movie: ${b.movie?.title || b.movie?.displayTitle}, user: ${b.userEmail}, seats: ${JSON.stringify(b.seats)}, date: ${b.date}, showtime: ${b.showtime}, createdAt: ${b.createdAt}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
