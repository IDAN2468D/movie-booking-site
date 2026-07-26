const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');

    // Let's test with various movies in the database
    const movieIds = [1523145, 1470130, 1226863, 687163, 1198994, 1084577, 278, 1171145, 1318447, 424, 936075, 1184918, 1, 1083381, 1339713, 1275779, 19404, 1304313, 1451344];

    console.log("Simulating GET /api/bookings with date='21.6.2026', showtime='19:30':");
    for (const id of movieIds) {
      const bookings = await db.collection("bookings").find({
        "movie.id": id,
        showtime: "19:30",
        date: "21.6.2026",
        status: "confirmed"
      }).toArray();
      const occupied = bookings.flatMap(b => b.seats);
      if (occupied.length > 0) {
        console.log(`Movie ${id}: occupied seats =`, occupied);
      }
    }

    console.log("\nSimulating GET /api/bookings with date=undefined, showtime='19:30':");
    for (const id of movieIds) {
      const bookings = await db.collection("bookings").find({
        "movie.id": id,
        showtime: "19:30",
        date: undefined, // this is undefined value
        status: "confirmed"
      }).toArray();
      const occupied = bookings.flatMap(b => b.seats);
      if (occupied.length > 0) {
        console.log(`Movie ${id}: occupied seats =`, occupied);
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
