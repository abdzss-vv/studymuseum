import fs from 'node:fs';
import path from 'node:path';

const ASSETS_TO_DOWNLOAD = [
  { url: '/__l5e/assets-v1/e4536dcf-8358-4815-ab84-66e9509c35d2/OverusedGrotesk-Bold.ttf', dest: 'public/fonts/OverusedGrotesk-Bold.ttf' },
  { url: '/__l5e/assets-v1/92955638-0dde-45f4-a085-8ecb9be87961/OverusedGrotesk-SemiBold.ttf', dest: 'public/fonts/OverusedGrotesk-SemiBold.ttf' },
  { url: '/__l5e/assets-v1/9c68c904-ca1f-40d0-9795-a41ff75a54c6/great-wave-card-back.png', dest: 'src/assets/great-wave-card-back.png' },
  { url: '/__l5e/assets-v1/050d24d7-7b58-4f85-9fc8-f906d19d7e13/great-wave-front.png', dest: 'src/assets/great-wave-front.png' },
  { url: '/__l5e/assets-v1/4de32608-f59d-4e48-a56d-61190709ef6e/great-wave.jpg', dest: 'src/assets/great-wave.jpg' },
  { url: '/__l5e/assets-v1/6ea701ab-6188-42fa-81ba-f531fb5e2247/mona-lisa-front.png', dest: 'src/assets/mona-lisa-front.png' },
  { url: '/__l5e/assets-v1/7fef84f8-5eda-441f-900d-b9033aac0302/mona-lisa.jpg', dest: 'src/assets/mona-lisa.jpg' },
  { url: '/__l5e/assets-v1/0e2092ed-1452-4a09-bbe5-2fda33ea73cf/museum-begin-session.png', dest: 'src/assets/museum-begin-session.png' },
  { url: '/__l5e/assets-v1/5a24b74c-7194-48d5-add9-2bbf1e76cca3/museum-collection.png', dest: 'src/assets/museum-collection.png' },
  { url: '/__l5e/assets-v1/2bf58a7a-afa3-4e36-98fe-8482d2e99f79/museum-logo.png', dest: 'src/assets/museum-logo.png' },
  { url: '/__l5e/assets-v1/52d83f7e-f681-4650-83a9-79972871e836/museum-progress.png', dest: 'src/assets/museum-progress.png' },
  { url: '/__l5e/assets-v1/9f02c1b1-07fb-4bd8-ad22-871e35c9a90a/museum-scene-clean.png', dest: 'src/assets/museum-scene-clean.png' },
  { url: '/__l5e/assets-v1/0147ea51-bd29-40ea-b4cf-aa2402f088af/museum-settings.png', dest: 'src/assets/museum-settings.png' },
  { url: '/__l5e/assets-v1/d31f9b22-c725-4cdd-9174-15f5c26e0713/museum-tests.png', dest: 'src/assets/museum-tests.png' },
  { url: '/__l5e/assets-v1/3fc74e1f-29be-47c0-955c-9835f3517467/pearl-earring-card-back.png', dest: 'src/assets/pearl-earring-card-back.png' },
  { url: '/__l5e/assets-v1/bd8c9add-a9c7-4587-935e-bfad2dbe7b8c/pearl-earring-front.png', dest: 'src/assets/pearl-earring-front.png' },
  { url: '/__l5e/assets-v1/e04634fe-8634-4bae-9cd5-1f109358b466/reward-card-back.png', dest: 'src/assets/reward-card-back.png' },
  { url: '/__l5e/assets-v1/48948a5b-7956-4f22-9247-cee638d16f95/starry-night.jpg', dest: 'src/assets/starry-night.jpg' },
  { url: '/__l5e/assets-v1/81c5757b-0b3f-407e-8be0-c13a705df7d8/timer-done-chime.wav', dest: 'src/assets/timer-done-chime.wav' },
];

async function downloadAll() {
  console.log('Downloading binary files from Lovable CDN...');
  for (const item of ASSETS_TO_DOWNLOAD) {
    fs.mkdirSync(path.dirname(item.dest), { recursive: true });
    const fullUrl = `https://studymuseum.lovable.app${item.url}`;
    const res = await fetch(fullUrl);
    if (!res.ok) throw new Error(`Failed to fetch ${fullUrl}: ${res.statusText}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(item.dest, buf);
    console.log(`Saved: ${item.dest}`);
  }

  console.log('Cleaning up all .asset.json files...');
  function removeAssetJson(dir) {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) removeAssetJson(p);
      else if (f.name.endsWith('.asset.json')) fs.unlinkSync(p);
    }
  }
  removeAssetJson('src/assets');
  console.log('Done downloading assets!');
}

downloadAll().catch(console.error);
