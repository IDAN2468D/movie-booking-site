const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');

    // Let's test what the GET route does
    // movieId is typically passed from the frontend. Let's see what movies exist in the db and their IDs.
    const bookings = await db.collection('bookings').find({
      status: "confirmed"
    }).toArray();

    console.log("All confirmed bookings:", bookings.length);

    // Let's print out what would happen if we query for movie id 687163, showtime "19:30"
    const movieBookings = await db.collection('bookings').find({
      "movie.id": 687163,
      showtime: "19:30",
      status: "confirmed"
    }).toArray();
    console.log("Bookings for movie 687163, showtime 19:30 (without date filter):", movieBookings.length);
    console.log("Seats:", movieBookings.flatMap(b => b.seats));

    // Now query with date: "21.6.2026"
    const dateBookings = await db.collection('bookings').find({
      "movie.id": 687163,
      showtime: "19:30",
      date: "21.6.2026",
      status: "confirmed"
    }).toArray();
    console.log("Bookings for movie 687163, showtime 19:30, date 21.6.2026:", dateBookings.length);

    // Now query with date: undefined
    const undefinedDateBookings = await db.collection('bookings').find({
      "movie.id": 687163,
      showtime: "19:30",
      date: undefined,
      status: "confirmed"
    }).toArray();
    console.log("Bookings for movie 687163, showtime 19:30, date undefined:", undefinedDateBookings.length);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main();
