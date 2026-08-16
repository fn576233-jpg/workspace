import { writeFileSync } from 'node:fs'

const candidates = {
  'iron-man': '8hYlB38asDY',
  'incredible-hulk': 'xbqNb2QKRNI',
  'iron-man-2': 'BoohRoVA9WQ',
  thor: 'JOddp-nlNvQ',
  'captain-america-first-avenger': 'JerVrbLgaX4',
  avengers: 'eOrNdBpGMv8',
  'iron-man-3': 'ke1YwdP_GEE',
  'thor-dark-world': 'npvJ9FTgZbM',
  'captain-america-winter-soldier': '7SlILk2WMTI',
  'guardians-of-the-galaxy': 'd96cjJhvlMA',
  'avengers-age-of-ultron': 'tmeOjFno6Do',
  antman: 'pWdKf3MneyI',
  'captain-america-civil-war': 'dKrVh6qofhI',
  'doctor-strange': 'HSzx-zryEgM',
  'guardians-vol2': 'dW1BIid8Osg',
  'spider-man-homecoming': '39udgGPyYMg',
  'thor-ragnarok': 'v7MGUNV8MxU',
  'black-panther': 'dxWvtMOGAhw',
  'infinity-war': '6ZfuNTqbHE8',
  'antman-and-the-wasp': '8_rTdO0lUz4',
  'captain-marvel': 'Z1BCujX3pw8',
  endgame: 'TcMBFSGVi1c',
  'spider-man-far-from-home': 'Nt9L1jCQdcU',
  'black-widow': 'RxAtuMu_ph4',
  'shang-chi': 'gKkcUB2g_ZU',
  eternals: 'A_J9T7THENw',
  'spider-man-no-way-home': 'JfVOs4VSpmA',
  'multiverse-of-madness': 'aWzlQ2N6qqg',
  'thor-love-and-thunder': 'Go8nTmfrQd8',
  'wakanda-forever': 'RlOB3UALvrQ',
  quantumania: '5WfTEZqnv30',
  'guardians-vol3': 'u3V5KDHRQvk',
  'the-marvels': 'wS_qbDztgVY',
  'deadpool-and-wolverine': '73_1biulkYk',
  'brave-new-world': '1pHDWLdC_RQ',
  thunderbolts: 'R3F5zKQc4EM',
  'fantastic-four-first-steps': 'lEXWBma67pM',
  deadpool: 'ONHBaC-pfsk',
  'deadpool-2': 'D86RtevtA2Y',
  logan: 'Div0iP65aZM',
  'xmen-first-class': 'UrbHykKUfTM',
  'days-of-future-past': 'pK2zYHWDZKo',
  'dark-phoenix': 'MSj0uGDvbAg',
  'new-mutants': '5kJJdPj0K9I',
  'x2': 'IwSfL0hZ1VM',
  'amazing-spider-man': 'tnhIn0WSP04',
  'amazing-spider-man-2': 'bpXrcTF_UuI',
  venom: 'u9Mv98Gr5pY',
  'venom-let-there-be-carnage': '9Ff6eyi2jNQ',
  'into-the-spider-verse': 'g4Hbz2jLxvQ',
  'across-the-spider-verse': 'cqGjhVJWtEg',
  morbius: 'FpKaB5dvSw4',
  'madame-web': 'Tuw0d4aPZUE',
  'blade': 'g5TyeD0wTRE',
  'spider-man-2002': 'TYMMOjBEXMM',
  'punisher-2004': '7_B-eDTeQUk',
}

async function verify(key, id) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  try {
    const res = await fetch(url)
    if (res.status === 404) return { key, id, ok: false, title: null }
    const data = await res.json()
    return { key, id, ok: true, title: data.title ?? null }
  } catch {
    return { key, id, ok: false, title: null, error: 'network' }
  }
}

const keys = Object.keys(candidates)
const results = []
for (let i = 0; i < keys.length; i += 5) {
  const batch = keys.slice(i, i + 5)
  const out = await Promise.all(batch.map((k) => verify(k, candidates[k])))
  results.push(...out)
}

const ok = results.filter((r) => r.ok)
const bad = results.filter((r) => !r.ok)
console.log('=== VALID ===')
for (const r of ok) console.log(`  ${r.key}: ${r.id} | ${r.title}`)
console.log('=== INVALID / UNVERIFIED ===')
for (const r of bad) console.log(`  ${r.key}: ${r.id}`)

const out = {}
for (const r of ok) out[r.key] = { id: r.id, title: r.title }
writeFileSync(new URL('./verified-trailers.json', import.meta.url), JSON.stringify(out, null, 2))
console.log('\nWrote verified-trailers.json')
