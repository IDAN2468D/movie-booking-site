const { MongoClient } = require('mongodb');

async function main() {
  const uri = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/movie-booking?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('movie-booking');
    const bookings = await db.collection('bookings').find().toArray();

    let totalRevenue = 0;
    let totalTickets = 0;
    const movieCounts = {};
    const movieRevenue = {};

    bookings.forEach(b => {
      totalRevenue += b.total || 0;
      const ticketsCount = (b.seats && Array.isArray(b.seats)) ? b.seats.length : 0;
      totalTickets += ticketsCount;

      const title = (b.movie && b.movie.title) ? b.movie.title : 'Unknown';
      movieCounts[title] = (movieCounts[title] || 0) + 1;
      movieRevenue[title] = (movieRevenue[title] || 0) + (b.total || 0);
    });

    const topMovies = Object.entries(movieCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, count]) => ({ title, count, revenue: movieRevenue[title] }));

    const sortedByDate = [...bookings].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    const recentBooking = sortedByDate[0] || {};

    console.log('--- REPORT ---');
    console.log('Total Bookings:', bookings.length);
    console.log('Total Revenue:', totalRevenue.toFixed(2));
    console.log('Total Tickets Sold:', totalTickets);
    console.log('Average Order Value:', bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0);
    console.log('Top Movies:', JSON.stringify(topMovies, null, 2));
    console.log('Most Recent Booking:', JSON.stringify({
      title: recentBooking.movie ? recentBooking.movie.title : 'N/A',
      total: recentBooking.total,
      date: recentBooking.createdAt
    }, null, 2));
    console.log('--------------');

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await client.close();
  }
}

main();
