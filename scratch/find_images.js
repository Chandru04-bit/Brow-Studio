async function searchPexels(query) {
  try {
    const res = await fetch(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const regex = /https:\/\/images\.pexels\.com\/photos\/(\d+)\/pexels-photo-\1\.jpeg/g;
    const matches = new Set();
    let m;
    while ((m = regex.exec(html)) !== null) {
      matches.add(m[0]);
    }
    console.log(`Query "${query}" found ${matches.size} photos:`);
    console.log(Array.from(matches).slice(0, 5));
  } catch (err) {
    console.error(err);
  }
}

async function run() {
  await searchPexels('eyelashes');
  await searchPexels('eyebrow');
  await searchPexels('lash extensions');
  await searchPexels('beauty salon');
  await searchPexels('woman smiling beauty');
}

run();
