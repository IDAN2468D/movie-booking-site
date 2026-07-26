async function check() {
  for (const s of ['w500', 'w780', 'original']) {
    const res = await fetch(`https://image.tmdb.org/t/p/${s}/t6HIrqRAclMCA60NsSmeqe9RmNV.jpg`, { method: 'HEAD' });
    console.log(s, res.status);
  }
}
check();
