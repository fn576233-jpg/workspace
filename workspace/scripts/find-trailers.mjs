import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'

const verified = JSON.parse(readFileSync(new URL('./verified-trailers.json', import.meta.url), 'utf8'))

const wanted = {
  'incredible-hulk': 'The Incredible Hulk 2008 Official Trailer',
  'captain-america-first-avenger': 'Captain America The First Avenger Official Trailer',
  'iron-man-3': 'Iron Man 3 Official Trailer',
  'captain-america-civil-war': 'Captain America Civil War Official Trailer',
  'antman-and-the-wasp': 'Ant-Man and the Wasp Official Trailer',
  'spider-man-far-from-home': 'Spider-Man Far From Home Official Trailer',
  'shang-chi': 'Shang-Chi and the Legend of the Ten Rings Official Trailer',
  eternals: 'Eternals Official Trailer Marvel Studios',
  quantumania: 'Ant-Man and the Wasp Quantumania Official Trailer',
  'brave-new-world': 'Captain America Brave New World Official Trailer',
  thunderbolts: 'Thunderbolts Official Trailer',
  'fantastic-four-first-steps': 'Fantastic Four First Steps Official Trailer',
  'deadpool-2': 'Deadpool 2 Official Trailer',
  logan: 'Logan Official Trailer Wolverine',
  'dark-phoenix': 'X-Men Dark Phoenix Official Trailer',
  'new-mutants': 'New Mutants Official Trailer',
  x2: 'X2 X-Men United Official Trailer',
  'amazing-spider-man': 'The Amazing Spider-Man Official Trailer',
  'amazing-spider-man-2': 'The Amazing Spider-Man 2 Official Trailer',
  'venom-let-there-be-carnage': 'Venom Let There Be Carnage Official Trailer',
  morbius: 'Morbius Official Trailer',
  'madame-web': 'Madame Web Official Trailer',
  blade: 'Blade 1998 Official Trailer',
  'spider-man-2002': 'Spider-Man 2002 Official Trailer',
  'punisher-2004': 'The Punisher 2004 Official Trailer',
}

function extractVideoIds(html) {
  const ids = []
  const re = /"videoRenderer":\{"videoId":"([^"]+)"[\s\S]{0,2000}?"title":\{"runs":\[\{"text":"([^"]+)"[\s\S]{0,2500}?"ownerText":\{"runs":\[\{"text":"([^"]+)"/g
  let m
  while ((m = re.exec(html)) !== null && ids.length < 6) {
    ids.push({ id: m[1], title: m[2], channel: m[3] })
  }
  return ids
}

const results = {}
for (const [key, query] of Object.entries(wanted)) {
  if (verified[key]) continue
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en-US' } })
    const html = await res.text()
    const hits = extractVideoIds(html)
    const good = hits.filter(
      (h) => h.channel.toLowerCase().includes('marvel') ||
        h.channel.toLowerCase().includes('20th century') ||
        h.channel.toLowerCase().includes('sony pictures') ||
        h.channel.toLowerCase().includes('walt disney') ||
        h.channel.toLowerCase().includes('columbia pictures') ||
        h.channel.toLowerCase().includes('official') ||
        h.title.toLowerCase().includes('official trailer'),
    )
    const chosen = good[0] ?? hits[0]
    results[key] = chosen ?? null
    console.log(`  ${key}: ${chosen ? chosen.id + ' | ' + chosen.title + ' | ' + chosen.channel : 'NONE'}`)
  } catch (e) {
    console.log(`  ${key}: ERROR ${e.message}`)
    results[key] = null
  }
  await new Promise((r) => setTimeout(r, 400))
}

const final = { ...verified }
for (const [key, v] of Object.entries(results)) {
  if (v) final[key] = { id: v.id, title: v.title }
}
writeFileSync(new URL('./verified-trailers.json', import.meta.url), JSON.stringify(final, null, 2))
console.log('\nUpdated verified-trailers.json')
