
const testEmail = async () => {
  const payload = {
    email: 'test@example.com',
    movieTitle: 'סרט בדיקה',
    seats: ['A1', 'A2'],
    price: 90,
    orderId: 'TEST-123',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmAnU6pZ94DWeo9wZ6.jpg',
    date: '27.04.2024',
    time: '19:30',
    hall: 'אולם 1',
    userName: 'בודק'
  };

  try {
    const response = await fetch('http://localhost:3000/api/send-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    console.log('Response:', data);
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
};

testEmail();
