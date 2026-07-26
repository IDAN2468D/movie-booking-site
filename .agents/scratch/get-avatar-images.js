async function getImages() {
  const res = await fetch('https://api.themoviedb.org/3/movie/76600/images?api_key=993de0b76b63e6f4a2d6abfef0df66ce');
  const data = await res.json();
  console.log('Posters count:', data.posters?.length);
  for (const p of (data.posters || []).slice(0, 5)) {
    const checkRes = await fetch(`https://image.tmdb.org/t/p/w500${p.file_path}`, { method: 'HEAD' });
    console.log(p.file_path, checkRes.status);
  }
}
getImages();
