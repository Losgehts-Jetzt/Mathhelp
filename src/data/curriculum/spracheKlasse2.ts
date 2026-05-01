// Deutsch-Curriculum Klasse 2
// Bildungsplan 2016 Baden-Württemberg · Grundschule

export interface SpracheQuestion {
  prompt: string
  word?: string
  options: string[]
  correct: number
}

export interface SpracheTopicConfig {
  id: string
  label: string
  emoji: string
  sublabel: string
  from: string
  to: string
  shadow: string
  generate: () => SpracheQuestion[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

// ── Topic 1: Groß- und Kleinschreibung ───────────────────────────────────────

const grossKleinPool: { words: [string, string, string, string]; nomen: 0 | 1 | 2 | 3 }[] = [
  { words: ['hund', 'schön', 'laufen', 'groß'], nomen: 0 },
  { words: ['rennen', 'tisch', 'klein', 'hell'], nomen: 1 },
  { words: ['warm', 'spielen', 'schule', 'blau'], nomen: 2 },
  { words: ['grün', 'essen', 'leise', 'baum'], nomen: 3 },
  { words: ['katze', 'schnell', 'singen', 'rot'], nomen: 0 },
  { words: ['liegen', 'ball', 'kalt', 'lustig'], nomen: 1 },
  { words: ['dunkel', 'schwimmen', 'blume', 'weich'], nomen: 2 },
  { words: ['groß', 'tanzen', 'alt', 'buch'], nomen: 3 },
  { words: ['auto', 'schreiben', 'laut', 'nass'], nomen: 0 },
  { words: ['sanft', 'haus', 'fliegen', 'frisch'], nomen: 1 },
  { words: ['froh', 'springen', 'fenster', 'weich'], nomen: 2 },
  { words: ['ruhig', 'schlafen', 'gelb', 'kind'], nomen: 3 },
  { words: ['vogel', 'heiß', 'malen', 'leise'], nomen: 0 },
  { words: ['lesen', 'fisch', 'lang', 'hell'], nomen: 1 },
  { words: ['schnell', 'müde', 'sommer', 'rennen'], nomen: 2 },
  { words: ['traurig', 'weinen', 'neu', 'mond'], nomen: 3 },
  { words: ['stuhl', 'klein', 'basteln', 'dunkel'], nomen: 0 },
  { words: ['klettern', 'stern', 'hoch', 'schön'], nomen: 1 },
  { words: ['weit', 'kochen', 'leise', 'heft'], nomen: 3 },
  { words: ['hand', 'fleißig', 'lachen', 'blau'], nomen: 0 },
  { words: ['springen', 'tür', 'warm', 'süß'], nomen: 1 },
  { words: ['mutig', 'backen', 'zug', 'dunkel'], nomen: 2 },
  { words: ['sauber', 'malen', 'frisch', 'bett'], nomen: 3 },
  { words: ['brief', 'laufen', 'eng', 'schön'], nomen: 0 },
  { words: ['still', 'berg', 'zeichnen', 'kalt'], nomen: 1 },
]

function generateGrossKlein(): SpracheQuestion[] {
  return pick(grossKleinPool, 10).map(({ words, nomen }) => ({
    prompt: 'Welches dieser Wörter ist ein Nomen?',
    options: [...words],
    correct: nomen,
  }))
}

// ── Topic 2: Silben ──────────────────────────────────────────────────────────

const silbenPool: { word: string; count: 1 | 2 | 3 | 4 }[] = [
  { word: 'Hund', count: 1 },
  { word: 'Haus', count: 1 },
  { word: 'Baum', count: 1 },
  { word: 'Fisch', count: 1 },
  { word: 'Brot', count: 1 },
  { word: 'Ball', count: 1 },
  { word: 'Tisch', count: 1 },
  { word: 'Buch', count: 1 },
  { word: 'Hand', count: 1 },
  { word: 'Wald', count: 1 },
  { word: 'Katze', count: 2 },
  { word: 'Blume', count: 2 },
  { word: 'Apfel', count: 2 },
  { word: 'Tiger', count: 2 },
  { word: 'Winter', count: 2 },
  { word: 'Vogel', count: 2 },
  { word: 'Kuchen', count: 2 },
  { word: 'Löwe', count: 2 },
  { word: 'Fenster', count: 2 },
  { word: 'Sonne', count: 2 },
  { word: 'Mutter', count: 2 },
  { word: 'Vater', count: 2 },
  { word: 'Tomate', count: 3 },
  { word: 'Banane', count: 3 },
  { word: 'Kaninchen', count: 3 },
  { word: 'Elefant', count: 3 },
  { word: 'Karotte', count: 3 },
  { word: 'Schmetterling', count: 3 },
  { word: 'Wasserfall', count: 3 },
  { word: 'Gitarre', count: 3 },
  { word: 'Kalender', count: 3 },
  { word: 'Schokolade', count: 4 },
  { word: 'Kindergarten', count: 4 },
  { word: 'Abenteuer', count: 4 },
]

function generateSilben(): SpracheQuestion[] {
  return pick(silbenPool, 10).map(({ word, count }) => ({
    prompt: 'Wie viele Silben hat das Wort?',
    word,
    options: ['1', '2', '3', '4'],
    correct: count - 1,
  }))
}

// ── Topic 3: Satzzeichen ─────────────────────────────────────────────────────

const satzzeichenPool: { sentence: string; mark: '.' | '?' | '!' }[] = [
  { sentence: 'Der Hund läuft im Garten', mark: '.' },
  { sentence: 'Die Katze schläft auf dem Sofa', mark: '.' },
  { sentence: 'Das Kind spielt draußen', mark: '.' },
  { sentence: 'Heute scheint die Sonne', mark: '.' },
  { sentence: 'Meine Mutter kocht Suppe', mark: '.' },
  { sentence: 'Der Ball liegt auf dem Boden', mark: '.' },
  { sentence: 'Wir gehen morgen in die Schule', mark: '.' },
  { sentence: 'Das Buch liegt auf dem Tisch', mark: '.' },
  { sentence: 'Der Vogel sitzt im Baum', mark: '.' },
  { sentence: 'Anna hat eine rote Jacke', mark: '.' },
  { sentence: 'Wie heißt du', mark: '?' },
  { sentence: 'Wo ist mein Ball', mark: '?' },
  { sentence: 'Hast du Hunger', mark: '?' },
  { sentence: 'Kommst du heute mit', mark: '?' },
  { sentence: 'Was machst du gerade', mark: '?' },
  { sentence: 'Bist du müde', mark: '?' },
  { sentence: 'Wann fängt die Schule an', mark: '?' },
  { sentence: 'Wie alt bist du', mark: '?' },
  { sentence: 'Kannst du mir helfen', mark: '?' },
  { sentence: 'Magst du Schokolade', mark: '?' },
  { sentence: 'Das ist wunderschön', mark: '!' },
  { sentence: 'Komm schnell her', mark: '!' },
  { sentence: 'Ich freue mich so sehr', mark: '!' },
  { sentence: 'Pass auf', mark: '!' },
  { sentence: 'Schau mal', mark: '!' },
  { sentence: 'Das ist klasse', mark: '!' },
  { sentence: 'Hurra, wir haben gewonnen', mark: '!' },
  { sentence: 'Hör sofort damit auf', mark: '!' },
]

const MARKS: ('.' | '?' | '!')[] = ['.', '?', '!']

function generateSatzzeichen(): SpracheQuestion[] {
  return pick(satzzeichenPool, 10).map(({ sentence, mark }) => ({
    prompt: 'Welches Satzzeichen fehlt am Ende?',
    word: `${sentence} ___`,
    options: ['.', '?', '!'],
    correct: MARKS.indexOf(mark),
  }))
}

// ── Topic 4: Wortarten ───────────────────────────────────────────────────────

const wortartenPool: { word: string; type: 0 | 1 | 2 }[] = [
  // 0 = Nomen
  { word: 'Hund', type: 0 },
  { word: 'Tisch', type: 0 },
  { word: 'Schule', type: 0 },
  { word: 'Blume', type: 0 },
  { word: 'Kind', type: 0 },
  { word: 'Baum', type: 0 },
  { word: 'Freund', type: 0 },
  { word: 'Sonne', type: 0 },
  { word: 'Buch', type: 0 },
  { word: 'Mutter', type: 0 },
  // 1 = Verb
  { word: 'laufen', type: 1 },
  { word: 'essen', type: 1 },
  { word: 'schlafen', type: 1 },
  { word: 'spielen', type: 1 },
  { word: 'schreiben', type: 1 },
  { word: 'lesen', type: 1 },
  { word: 'malen', type: 1 },
  { word: 'singen', type: 1 },
  { word: 'springen', type: 1 },
  { word: 'tanzen', type: 1 },
  // 2 = Adjektiv
  { word: 'groß', type: 2 },
  { word: 'klein', type: 2 },
  { word: 'schön', type: 2 },
  { word: 'schnell', type: 2 },
  { word: 'warm', type: 2 },
  { word: 'kalt', type: 2 },
  { word: 'müde', type: 2 },
  { word: 'lustig', type: 2 },
  { word: 'traurig', type: 2 },
  { word: 'laut', type: 2 },
]

function generateWortarten(): SpracheQuestion[] {
  return pick(wortartenPool, 10).map(({ word, type }) => ({
    prompt: 'Was für ein Wort ist das?',
    word,
    options: ['Nomen', 'Verb', 'Adjektiv'],
    correct: type,
  }))
}

// ── Topic 5: Artikel ─────────────────────────────────────────────────────────

const artikelPool: { noun: string; article: 'der' | 'die' | 'das' }[] = [
  { noun: 'Hund', article: 'der' },
  { noun: 'Tisch', article: 'der' },
  { noun: 'Stuhl', article: 'der' },
  { noun: 'Ball', article: 'der' },
  { noun: 'Baum', article: 'der' },
  { noun: 'Vater', article: 'der' },
  { noun: 'Wald', article: 'der' },
  { noun: 'Mond', article: 'der' },
  { noun: 'Zug', article: 'der' },
  { noun: 'Apfel', article: 'der' },
  { noun: 'Katze', article: 'die' },
  { noun: 'Schule', article: 'die' },
  { noun: 'Blume', article: 'die' },
  { noun: 'Mutter', article: 'die' },
  { noun: 'Tür', article: 'die' },
  { noun: 'Sonne', article: 'die' },
  { noun: 'Hand', article: 'die' },
  { noun: 'Küche', article: 'die' },
  { noun: 'Nase', article: 'die' },
  { noun: 'Tomate', article: 'die' },
  { noun: 'Kind', article: 'das' },
  { noun: 'Buch', article: 'das' },
  { noun: 'Haus', article: 'das' },
  { noun: 'Auto', article: 'das' },
  { noun: 'Brot', article: 'das' },
  { noun: 'Fenster', article: 'das' },
  { noun: 'Bett', article: 'das' },
  { noun: 'Heft', article: 'das' },
  { noun: 'Mädchen', article: 'das' },
  { noun: 'Spiel', article: 'das' },
]

const ARTICLES: ('der' | 'die' | 'das')[] = ['der', 'die', 'das']

function generateArtikel(): SpracheQuestion[] {
  return pick(artikelPool, 10).map(({ noun, article }) => ({
    prompt: 'Welcher Artikel passt?',
    word: `___ ${noun}`,
    options: ['der', 'die', 'das'],
    correct: ARTICLES.indexOf(article),
  }))
}

// ── Export ───────────────────────────────────────────────────────────────────

export const spracheKlasse2Topics: SpracheTopicConfig[] = [
  {
    id: 'gross-klein',
    label: 'Groß- und Kleinschreibung',
    emoji: '🔤',
    sublabel: 'Welches Wort ist ein Nomen?',
    from: 'from-violet-400',
    to: 'to-purple-500',
    shadow: 'shadow-purple-300',
    generate: generateGrossKlein,
  },
  {
    id: 'silben',
    label: 'Silben',
    emoji: '✂️',
    sublabel: 'Wie viele Silben hat das Wort?',
    from: 'from-sky-400',
    to: 'to-cyan-500',
    shadow: 'shadow-cyan-300',
    generate: generateSilben,
  },
  {
    id: 'satzzeichen',
    label: 'Satzzeichen',
    emoji: '❓',
    sublabel: 'Welches Zeichen fehlt am Ende?',
    from: 'from-amber-400',
    to: 'to-orange-500',
    shadow: 'shadow-orange-300',
    generate: generateSatzzeichen,
  },
  {
    id: 'wortarten',
    label: 'Wortarten',
    emoji: '📝',
    sublabel: 'Nomen, Verb oder Adjektiv?',
    from: 'from-emerald-400',
    to: 'to-teal-500',
    shadow: 'shadow-teal-300',
    generate: generateWortarten,
  },
  {
    id: 'artikel',
    label: 'Artikel',
    emoji: '🏷️',
    sublabel: 'der, die oder das?',
    from: 'from-rose-400',
    to: 'to-pink-500',
    shadow: 'shadow-pink-300',
    generate: generateArtikel,
  },
]
