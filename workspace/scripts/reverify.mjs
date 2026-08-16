import { writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'

const verified = JSON.parse(readFileSync(new URL('./verified-trailers.json', import.meta.url), 'utf8'))

const drop = ['quantumania', 'thunderbolts', 'madame-web', 'punisher-2004']
const keepOverride = {
  'shang-chi': { id: 'MfVyikMrJ_o', title: 'IGN' },
}

for (const k of drop) delete verified[k]
for (const [k, v] of Object.entries(keepOverride)) verified[k] = v

const keys = Object.keys(verified)
const results = []
for (let i = 0; i < keys.length; i += 5) {
  const batch = keys.slice(i, i + 5)
  const out = await Promise.all(
    batch.map(async (k) => {
      const id = verified[k].id
      const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
      try {
        const res = await fetch(url)
        if (res.status === 404) return { key: k, ok: false }
        const data = await res.json()
        return { key: k, ok: true, title: data.title }
      } catch {
        return { key: k, ok: false }
      }
    }),
  )
  results.push(...out)
  await new Promise((r) => setTimeout(r, 300))
}

let count = 0
const final = {}
for (const r of results) {
  if (r.ok) {
    final[r.key] = { id: verified[r.key].id, title: r.title ?? verified[r.key].title }
    console.log(`  OK  ${r.key}: ${verified[r.key].id}`)
    count++
  } else {
    console.log(`  BAD ${r.key}: ${verified[r.key].id}`)
  }
}
writeFileSync(new URL('./verified-trailers.json', import.meta.url), JSON.stringify(final, null, 2))
console.log(`\n${count} verified trailers`)
