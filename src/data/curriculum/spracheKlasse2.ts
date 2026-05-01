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
// Dynamic generator: 50 Nomen + 100 distractors → millions of combinations

const grossKleinNomen: string[] = [
  'hund', 'tisch', 'schule', 'baum', 'katze', 'ball', 'blume', 'buch', 'auto', 'haus',
  'fenster', 'kind', 'vogel', 'fisch', 'sommer', 'mond', 'stuhl', 'stern', 'hand', 'tür',
  'heft', 'bett', 'zug', 'brief', 'berg', 'straße', 'garten', 'wiese', 'tier', 'bär',
  'frosch', 'schiff', 'fluss', 'turm', 'burg', 'dorf', 'markt', 'arzt', 'lehrer', 'hase',
  'maus', 'kuh', 'pferd', 'schaf', 'huhn', 'ente', 'fuchs', 'igel', 'pilz', 'bahnhof',
]

const grossKleinDistraktoren: string[] = [
  // Adjektive
  'groß', 'klein', 'schön', 'schnell', 'langsam', 'warm', 'kalt', 'nass', 'trocken', 'hell',
  'dunkel', 'laut', 'leise', 'alt', 'neu', 'weich', 'hart', 'hoch', 'tief', 'weit',
  'eng', 'sauber', 'süß', 'bitter', 'frisch', 'müde', 'hungrig', 'glücklich', 'traurig', 'lustig',
  'wütend', 'mutig', 'stark', 'schwach', 'dünn', 'dick', 'kurz', 'lang', 'bunt', 'rot',
  'blau', 'grün', 'gelb', 'weiß', 'schwarz', 'braun', 'rosa', 'ruhig', 'sanft', 'fleißig',
  // Verben
  'laufen', 'essen', 'schlafen', 'spielen', 'schreiben', 'lesen', 'malen', 'singen', 'springen', 'tanzen',
  'schwimmen', 'fliegen', 'rennen', 'klettern', 'basteln', 'kochen', 'backen', 'zeichnen', 'lachen', 'weinen',
  'rufen', 'fragen', 'helfen', 'suchen', 'finden', 'kaufen', 'bringen', 'holen', 'werfen', 'fangen',
  'sitzen', 'liegen', 'gehen', 'kommen', 'fahren', 'bauen', 'putzen', 'waschen', 'tragen', 'fallen',
  'blühen', 'wachsen', 'träumen', 'flüstern', 'zählen', 'messen', 'öffnen', 'schließen', 'hören', 'sehen',
]

function generateGrossKlein(): SpracheQuestion[] {
  const nomenList = shuffle([...grossKleinNomen]).slice(0, 10)
  return nomenList.map(nomen => {
    const distractors = pick(grossKleinDistraktoren, 3)
    const pos = Math.floor(Math.random() * 4)
    const options = [...distractors.slice(0, pos), nomen, ...distractors.slice(pos)]
    return {
      prompt: 'Welches dieser Wörter ist ein Nomen?',
      options,
      correct: pos,
    }
  })
}

// ── Topic 2: Silben ──────────────────────────────────────────────────────────
// 37 + 37 + 38 + 25 = 137 words

const silbenPool: { word: string; count: 1 | 2 | 3 | 4 }[] = [
  // 1 Silbe (37)
  { word: 'Hund', count: 1 }, { word: 'Haus', count: 1 }, { word: 'Baum', count: 1 },
  { word: 'Fisch', count: 1 }, { word: 'Brot', count: 1 }, { word: 'Ball', count: 1 },
  { word: 'Tisch', count: 1 }, { word: 'Buch', count: 1 }, { word: 'Hand', count: 1 },
  { word: 'Wald', count: 1 }, { word: 'Berg', count: 1 }, { word: 'Kuh', count: 1 },
  { word: 'Maus', count: 1 }, { word: 'Glas', count: 1 }, { word: 'Pferd', count: 1 },
  { word: 'Blatt', count: 1 }, { word: 'Stein', count: 1 }, { word: 'Bein', count: 1 },
  { word: 'Arm', count: 1 }, { word: 'Fuß', count: 1 }, { word: 'Kopf', count: 1 },
  { word: 'Mund', count: 1 }, { word: 'Ohr', count: 1 }, { word: 'Herz', count: 1 },
  { word: 'Zahn', count: 1 }, { word: 'Haar', count: 1 }, { word: 'Licht', count: 1 },
  { word: 'Brief', count: 1 }, { word: 'Burg', count: 1 }, { word: 'Dorf', count: 1 },
  { word: 'Gold', count: 1 }, { word: 'Gras', count: 1 }, { word: 'Korn', count: 1 },
  { word: 'Mond', count: 1 }, { word: 'Stern', count: 1 }, { word: 'Fels', count: 1 },
  { word: 'Fluss', count: 1 },
  // 2 Silben (37)
  { word: 'Katze', count: 2 }, { word: 'Blume', count: 2 }, { word: 'Apfel', count: 2 },
  { word: 'Tiger', count: 2 }, { word: 'Winter', count: 2 }, { word: 'Vogel', count: 2 },
  { word: 'Kuchen', count: 2 }, { word: 'Löwe', count: 2 }, { word: 'Fenster', count: 2 },
  { word: 'Sonne', count: 2 }, { word: 'Mutter', count: 2 }, { word: 'Vater', count: 2 },
  { word: 'Hase', count: 2 }, { word: 'Schüler', count: 2 }, { word: 'Lehrer', count: 2 },
  { word: 'Brille', count: 2 }, { word: 'Birne', count: 2 }, { word: 'Gabel', count: 2 },
  { word: 'Teller', count: 2 }, { word: 'Löffel', count: 2 }, { word: 'Messer', count: 2 },
  { word: 'Kissen', count: 2 }, { word: 'Jacke', count: 2 }, { word: 'Hose', count: 2 },
  { word: 'Tasche', count: 2 }, { word: 'Butter', count: 2 }, { word: 'Blüte', count: 2 },
  { word: 'Regen', count: 2 }, { word: 'Wolke', count: 2 }, { word: 'Lampe', count: 2 },
  { word: 'Kerze', count: 2 }, { word: 'Stiefel', count: 2 }, { word: 'Nummer', count: 2 },
  { word: 'Rücken', count: 2 }, { word: 'Wetter', count: 2 }, { word: 'Feuer', count: 2 },
  { word: 'Wasser', count: 2 },
  // 3 Silben (38)
  { word: 'Tomate', count: 3 }, { word: 'Banane', count: 3 }, { word: 'Kaninchen', count: 3 },
  { word: 'Elefant', count: 3 }, { word: 'Karotte', count: 3 }, { word: 'Schmetterling', count: 3 },
  { word: 'Wasserfall', count: 3 }, { word: 'Gitarre', count: 3 }, { word: 'Kalender', count: 3 },
  { word: 'Computer', count: 3 }, { word: 'Papagei', count: 3 }, { word: 'Kokosnuss', count: 3 },
  { word: 'Ananas', count: 3 }, { word: 'Paprika', count: 3 }, { word: 'Telefon', count: 3 },
  { word: 'Polizei', count: 3 }, { word: 'Bäckerei', count: 3 }, { word: 'Museum', count: 3 },
  { word: 'Geburtstag', count: 3 }, { word: 'Geschwister', count: 3 }, { word: 'Himbeere', count: 3 },
  { word: 'Erdbeere', count: 3 }, { word: 'Holunder', count: 3 }, { word: 'Krankenhaus', count: 3 },
  { word: 'Notizbuch', count: 3 }, { word: 'Feuerwehr', count: 3 }, { word: 'Polizist', count: 3 },
  { word: 'Turnhalle', count: 3 }, { word: 'Klassenraum', count: 3 }, { word: 'Schulranzen', count: 3 },
  { word: 'Rakete', count: 3 }, { word: 'Krokodil', count: 3 }, { word: 'Piraten', count: 3 },
  { word: 'Bibliothek', count: 3 }, { word: 'Melone', count: 3 }, { word: 'Geheimnis', count: 3 },
  { word: 'Tintenfisch', count: 3 }, { word: 'Eichhörnchen', count: 3 },
  // 4 Silben (25)
  { word: 'Schokolade', count: 4 }, { word: 'Kindergarten', count: 4 }, { word: 'Abenteuer', count: 4 },
  { word: 'Regenbogen', count: 4 }, { word: 'Radiergummi', count: 4 }, { word: 'Thermometer', count: 4 },
  { word: 'Mittagessen', count: 4 }, { word: 'Petersilie', count: 4 }, { word: 'Stachelbeere', count: 4 },
  { word: 'Aquarium', count: 4 }, { word: 'Salamander', count: 4 }, { word: 'Osterhase', count: 4 },
  { word: 'Zebrastreifen', count: 4 }, { word: 'Aprikose', count: 4 }, { word: 'Hausaufgaben', count: 4 },
  { word: 'Entschuldigung', count: 4 }, { word: 'Geburtstagskind', count: 4 }, { word: 'Wintermütze', count: 4 },
  { word: 'Regenmantel', count: 4 }, { word: 'Aufgabenheft', count: 4 }, { word: 'Klassenarbeit', count: 4 },
  { word: 'Einkaufszettel', count: 4 }, { word: 'Seifenblase', count: 4 }, { word: 'Überraschung', count: 4 },
  { word: 'Ohrenschmerzen', count: 4 },
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
// 45 + 45 + 45 = 135 sentences; generator picks 4+3+3 balanced

const satzzeichenPeriod: string[] = [
  'Der Hund läuft im Garten',
  'Die Katze schläft auf dem Sofa',
  'Das Kind spielt draußen',
  'Heute scheint die Sonne',
  'Meine Mutter kocht Suppe',
  'Der Ball liegt auf dem Boden',
  'Wir gehen morgen in die Schule',
  'Das Buch liegt auf dem Tisch',
  'Der Vogel sitzt im Baum',
  'Anna hat eine rote Jacke',
  'Der Fisch schwimmt im Teich',
  'Das Mädchen liest ein Buch',
  'Der Junge spielt Fußball',
  'Im Winter liegt Schnee auf den Feldern',
  'Die Blumen blühen im Frühling',
  'Wir trinken Kakao zum Frühstück',
  'Die Kinder laufen auf dem Spielplatz',
  'Das Auto steht in der Garage',
  'Mein Freund wohnt in der Nachbarstraße',
  'Die Sterne leuchten in der Nacht',
  'Der Lehrer erklärt die Aufgabe',
  'Im Herbst fallen die Blätter vom Baum',
  'Das Kaninchen frisst Karotten',
  'Wir spielen nach der Schule draußen',
  'Die Oma bäckt Kuchen für uns',
  'Das Pferd galoppiert über die Wiese',
  'Meine Schwester mag Schokolade',
  'Der Zug fährt in den Bahnhof ein',
  'Die Enten schwimmen auf dem See',
  'Das Feuer brennt im Kamin',
  'Mein Hund bellt laut',
  'Die Schule fängt um acht Uhr an',
  'Paul hat gestern Geburtstag gehabt',
  'Die Katze jagt eine Maus',
  'Das Brot liegt auf dem Teller',
  'Wir haben einen schönen Garten',
  'Der Frosch springt ins Wasser',
  'Lena hat ihr Heft verloren',
  'Der Wind weht stark heute',
  'Die Bibliothek ist neben der Schule',
  'Wir bauen eine Burg aus Sand',
  'Das Schwein wühlt im Schlamm',
  'Der Schmetterling fliegt von Blume zu Blume',
  'Die Sonne geht jeden Abend unter',
  'Das Eichhörnchen klettert auf den Baum',
]

const satzzeichenQuestion: string[] = [
  'Wie heißt du',
  'Wo ist mein Ball',
  'Hast du Hunger',
  'Kommst du heute mit',
  'Was machst du gerade',
  'Bist du müde',
  'Wann fängt die Schule an',
  'Wie alt bist du',
  'Kannst du mir helfen',
  'Magst du Schokolade',
  'Wo wohnst du',
  'Hast du ein Haustier',
  'Wie heißt dein Lehrer',
  'Spielst du gern Fußball',
  'Was ist dein Lieblingsessen',
  'Wann hast du Geburtstag',
  'Hast du schon gegessen',
  'Möchtest du ein Eis',
  'Hast du deine Hausaufgaben gemacht',
  'Wo ist die Toilette',
  'Kann ich auch mitspielen',
  'Wie spät ist es',
  'Gehst du morgen schwimmen',
  'Was ist dein Lieblingstier',
  'Hast du heute Schule',
  'Wer hat das gemacht',
  'Warum weinst du',
  'Schläfst du schon',
  'Darfst du heute länger aufbleiben',
  'Wie heißt deine beste Freundin',
  'Welche Farbe magst du am liebsten',
  'Wo sind meine Schuhe',
  'Kannst du das Wort buchstabieren',
  'Darf ich das Fenster öffnen',
  'Wie war dein Wochenende',
  'Magst du lieber Sommer oder Winter',
  'Was liest du gerade',
  'Kann ich deinen Radiergummi haben',
  'Bist du schon fertig',
  'Wer kommt alles zu deiner Party',
  'Hast du deinen Rucksack gepackt',
  'Wie lange dauert der Film',
  'Kennst du dieses Lied',
  'Wohin fahrt ihr in den Ferien',
  'Was hast du heute in der Schule gelernt',
]

const satzzeichenExcl: string[] = [
  'Pass auf',
  'Komm schnell her',
  'Ich freue mich so sehr',
  'Sei still',
  'Toll gemacht',
  'Das ist so lustig',
  'Vorsicht, ein Auto',
  'Das war super',
  'Hilf mir bitte',
  'Das ist unglaublich',
  'Hör mal zu',
  'Steh sofort auf',
  'Das tut weh',
  'Lauf schneller',
  'Das ist nicht fair',
  'Komm, wir gehen spielen',
  'Schrei nicht so laut',
  'Das ist falsch',
  'Ich kann es nicht glauben',
  'Renn, er kommt näher',
  'Schau, ein Regenbogen',
  'Gib das sofort zurück',
  'Ich hab es endlich geschafft',
  'Lass mich in Ruhe',
  'Leg das sofort weg',
  'Hurra, wir haben gewonnen',
  'Hör sofort damit auf',
  'Wie toll',
  'Wie aufregend',
  'Achtung, Gefahr',
  'So ein Glück',
  'Endlich sind wir da',
  'Feuer, das Haus brennt',
  'Jetzt reicht es aber',
  'Das ist klasse',
  'Schau mal',
  'Bravo, gut gemacht',
  'Auf die Plätze, fertig, los',
  'Halt, stehen bleiben',
  'Das ist einfach wunderbar',
  'Ich will auch mitspielen',
  'Das war ein tolles Abenteuer',
  'Ich hab gewonnen',
  'Nein, niemals',
  'Das ist ja riesig groß',
]

function generateSatzzeichen(): SpracheQuestion[] {
  const periods = pick(satzzeichenPeriod, 4).map(s => ({
    prompt: 'Welches Satzzeichen fehlt am Ende?',
    word: `${s} ___`,
    options: ['.', '?', '!'],
    correct: 0,
  }))
  const questions = pick(satzzeichenQuestion, 3).map(s => ({
    prompt: 'Welches Satzzeichen fehlt am Ende?',
    word: `${s} ___`,
    options: ['.', '?', '!'],
    correct: 1,
  }))
  const excls = pick(satzzeichenExcl, 3).map(s => ({
    prompt: 'Welches Satzzeichen fehlt am Ende?',
    word: `${s} ___`,
    options: ['.', '?', '!'],
    correct: 2,
  }))
  return shuffle([...periods, ...questions, ...excls])
}

// ── Topic 4: Wortarten ───────────────────────────────────────────────────────
// 50 + 50 + 50 = 150 words; generator picks 4 Nomen + 3 Verb + 3 Adj

const wortartenNomen: string[] = [
  'Hund', 'Tisch', 'Schule', 'Blume', 'Kind', 'Baum', 'Freund', 'Sonne', 'Buch', 'Mutter',
  'Vater', 'Haus', 'Auto', 'Ball', 'Katze', 'Vogel', 'Fisch', 'Stern', 'Mond', 'Hand',
  'Fenster', 'Tür', 'Heft', 'Bett', 'Brot', 'Kuchen', 'Wasser', 'Feuer', 'Wald', 'Berg',
  'Fluss', 'See', 'Garten', 'Wiese', 'Straße', 'Brücke', 'Turm', 'Burg', 'Dorf', 'Stadt',
  'Markt', 'Schiff', 'Zug', 'Pferd', 'Kuh', 'Hase', 'Maus', 'Fuchs', 'Igel', 'Frosch',
]

const wortartenVerben: string[] = [
  'laufen', 'essen', 'schlafen', 'spielen', 'schreiben', 'lesen', 'malen', 'singen', 'springen', 'tanzen',
  'schwimmen', 'fliegen', 'rennen', 'klettern', 'basteln', 'kochen', 'backen', 'zeichnen', 'lachen', 'weinen',
  'rufen', 'fragen', 'helfen', 'suchen', 'finden', 'kaufen', 'bringen', 'holen', 'werfen', 'fangen',
  'sitzen', 'liegen', 'gehen', 'kommen', 'fahren', 'bauen', 'putzen', 'waschen', 'tragen', 'fallen',
  'blühen', 'wachsen', 'träumen', 'flüstern', 'zählen', 'messen', 'öffnen', 'schließen', 'hören', 'sehen',
]

const wortartenAdjektive: string[] = [
  'groß', 'klein', 'schön', 'schnell', 'langsam', 'warm', 'kalt', 'nass', 'trocken', 'hell',
  'dunkel', 'laut', 'leise', 'alt', 'neu', 'weich', 'hart', 'hoch', 'tief', 'weit',
  'eng', 'sauber', 'süß', 'bitter', 'frisch', 'müde', 'hungrig', 'glücklich', 'traurig', 'lustig',
  'wütend', 'mutig', 'stark', 'schwach', 'dünn', 'dick', 'kurz', 'lang', 'bunt', 'rot',
  'blau', 'grün', 'gelb', 'weiß', 'schwarz', 'braun', 'rosa', 'ruhig', 'sanft', 'fleißig',
]

function generateWortarten(): SpracheQuestion[] {
  const nomen = pick(wortartenNomen, 4).map(word => ({
    prompt: 'Was für ein Wort ist das?', word, options: ['Nomen', 'Verb', 'Adjektiv'], correct: 0,
  }))
  const verben = pick(wortartenVerben, 3).map(word => ({
    prompt: 'Was für ein Wort ist das?', word, options: ['Nomen', 'Verb', 'Adjektiv'], correct: 1,
  }))
  const adjektive = pick(wortartenAdjektive, 3).map(word => ({
    prompt: 'Was für ein Wort ist das?', word, options: ['Nomen', 'Verb', 'Adjektiv'], correct: 2,
  }))
  return shuffle([...nomen, ...verben, ...adjektive])
}

// ── Topic 5: Artikel ─────────────────────────────────────────────────────────
// 50 + 50 + 50 = 150 nouns; generator picks 4 der + 3 die + 3 das

const artikelDer: string[] = [
  'Hund', 'Tisch', 'Stuhl', 'Ball', 'Baum', 'Vater', 'Wald', 'Mond', 'Zug', 'Apfel',
  'Stern', 'Weg', 'Tag', 'Sommer', 'Winter', 'Frühling', 'Herbst', 'Regen', 'Schnee', 'Wind',
  'Berg', 'Fluss', 'Stein', 'Himmel', 'Vogel', 'Frosch', 'Fuchs', 'Tiger', 'Löwe', 'Bär',
  'Pilz', 'Ast', 'Brief', 'Stift', 'Teppich', 'Spiegel', 'Käfer', 'Zahn', 'Arm', 'Kopf',
  'Schrank', 'Abend', 'Morgen', 'Bruder', 'Onkel', 'Freund', 'Finger', 'Bahnhof', 'Markt', 'Laden',
]

const artikelDie: string[] = [
  'Katze', 'Schule', 'Blume', 'Mutter', 'Tür', 'Sonne', 'Hand', 'Küche', 'Nase', 'Tomate',
  'Straße', 'Brücke', 'Stadt', 'Kuh', 'Maus', 'Ente', 'Gabel', 'Lampe', 'Kerze', 'Jacke',
  'Hose', 'Tasche', 'Uhr', 'Milch', 'Suppe', 'Banane', 'Erdbeere', 'Birne', 'Wiese', 'Wolke',
  'Nacht', 'Woche', 'Musik', 'Farbe', 'Klasse', 'Aufgabe', 'Geschichte', 'Schwester', 'Tante', 'Freundin',
  'Zahl', 'Pause', 'Butter', 'Kirsche', 'Gurke', 'Karotte', 'Blüte', 'Pflanze', 'Insel', 'Karte',
]

const artikelDas: string[] = [
  'Kind', 'Buch', 'Haus', 'Auto', 'Brot', 'Fenster', 'Bett', 'Heft', 'Mädchen', 'Spiel',
  'Tier', 'Wasser', 'Feuer', 'Gras', 'Licht', 'Glas', 'Messer', 'Hemd', 'Kleid', 'Fahrrad',
  'Schiff', 'Boot', 'Pferd', 'Schaf', 'Schwein', 'Huhn', 'Kaninchen', 'Ei', 'Obst', 'Gemüse',
  'Frühstück', 'Bild', 'Papier', 'Lineal', 'Wörterbuch', 'Dorf', 'Land', 'Meer', 'Gebirge', 'Tal',
  'Schloss', 'Rathaus', 'Museum', 'Theater', 'Kino', 'Schwimmbad', 'Krankenhaus', 'Kaufhaus', 'Restaurant', 'Hotel',
]

function generateArtikel(): SpracheQuestion[] {
  const derItems = pick(artikelDer, 4).map(noun => ({
    prompt: 'Welcher Artikel passt?', word: `___ ${noun}`, options: ['der', 'die', 'das'], correct: 0,
  }))
  const dieItems = pick(artikelDie, 3).map(noun => ({
    prompt: 'Welcher Artikel passt?', word: `___ ${noun}`, options: ['der', 'die', 'das'], correct: 1,
  }))
  const dasItems = pick(artikelDas, 3).map(noun => ({
    prompt: 'Welcher Artikel passt?', word: `___ ${noun}`, options: ['der', 'die', 'das'], correct: 2,
  }))
  return shuffle([...derItems, ...dieItems, ...dasItems])
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
