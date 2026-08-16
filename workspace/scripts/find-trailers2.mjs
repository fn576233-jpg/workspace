import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'

const verified = JSON.parse(readFileSync(new URL('./verified-trailers.json', import.meta.url), 'utf8'))

const wanted = {
  thunderbolts: 'THUNDERBOLTS 2025 Official Trailer Marvel Studios',
  'fantastic-four-first-steps': 'Fantastic Four First Steps Official Trailer Marvel',
  'deadpool-2': 'Deadpool 2 Official Trailer',
  logan: 'Logan Official Trailer 2017 Wolverine',
  'dark-phoenix': 'X-Men Dark Phoenix Final Trailer Official',
  'new-mutants': 'The New Mutants Official Trailer 2020',
  x2: 'X2 X-Men United Official Trailer',
  'amazing-spider-man': 'The Amazing Spider-Man Official Trailer 2012',
  'amazing-spider-man-2': 'The Amazing Spider-Man 2 Official Trailer 2014',
  'venom-let-there-be-carnage': 'Venom Let There Be Carnage Official Trailer',
  morbius: 'Morbius Official Trailer 2022',
  'madame-web': 'Madame Web Official Trailer 2024',
  blade: 'Blade 1998 Official Trailer Wesley Snipes',
  'spider-man-2002': 'Spider-Man 2002 Official Trailer Tobey Maguire',
  'punisher-2004': 'The Punisher 2004 Official Trailer Thomas Jane',
  'shang-chi-marvel': 'Shang-Chi and the Legend of the Ten Rings Trailer Marvel Entertainment',
  'quantumania-marvel': 'Ant-Man and the Wasp Quantumania Trailer Marvel Entertainment',
  'brave-new-world-marvel': 'Captain America Brave New World Trailer Marvel Entertainment',
}

function extractVideoIds(html) {
  const ids = []
  const re = /"videoRenderer":\{"videoId":"([^"]+)"[\s\S]{0,2000}?"title":\{"runs":\[\{"text":"([^"]+)"[\s\S]{0,2500}?"ownerText":\{"runs":\[\{"text":"([^"]+)"/g
  let m
  while ((m = re.exec(html)) !== null && ids.length < 8) {
    ids.push({ id: m[1], title: m[2], channel: m[3] })
  }
  return ids
}

const results = {}
let attempts = 0
for (const [key, query] of Object.entries(wanted)) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  let ok = false
  for (let t = 0; t < 3 && !ok; t++) {
    try {
      await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500))
      const res = await fetch(url, { headers: { 'Accept-Language': 'en-US' } })
      if (res.status !== 200) throw new Error(`status ${res.status}`)
      const html = await res.text()
      const hits = extractVideoIds(html)
      const good = hits.filter(
        (h) =>
          h.channel.toLowerCase().includes('marvel') ||
          h.channel.toLowerCase().includes('sony pictures') ||
          h.channel.toLowerCase().includes('20th century') ||
          h.channel.toLowerCase().includes('walt disney') ||
          h.channel.toLowerCase().includes('columbia pictures'),
      )
      const fallback = hits.find((h) => h.title.toLowerCase().includes('official'))
      const chosen = good[0] ?? fallback ?? hits[0]
      results[key] = chosen ?? null
      console.log(`  ${key}: ${chosen ? chosen.id + ' | ' + chosen.title.slice(0, 60) + ' | ' + chosen.channel : 'NONE'}`)
      ok = true
    } catch (e) {
      attempts++
      console.log(`  ${key}: retry (${e.message})`)
    }
  }
  if (!ok) {
    results[key] = null
    console.log(`  ${key}: FAILED`)
  }
}

const final = { ...verified }
for (const [key, v] of Object.entries(results)) {
  const drop = key.replace(/-(marvel)$/, '')
  if (v) final[drop] = { id: v.id, title: v.title }
}
writeFileSync(new URL('./verified-trailers.json', import.meta.url), JSON.stringify(final, null, 2))
console.log('\nUpdated verified-trailers.json')
