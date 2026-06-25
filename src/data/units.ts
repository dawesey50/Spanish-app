import type { Unit, Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // ── Unit 1 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_01',
    unitId: 'unit_01',
    title: 'Hello & Goodbye',
    questionTypes: ['multipleChoice', 'typing', 'sentenceBuilder'],
    wordIds: ['w001', 'w002', 'w003', 'w004', 'w005'],
    grammarNote: {
      tip: "Spanish greetings change with the time of day. 'Buenos días' is for the morning, 'buenas tardes' for the afternoon, and 'buenas noches' for the evening and night. 'Hola' works any time!",
      examples: [
        { spanish: '¡Buenos días, señora García!', english: 'Good morning, Mrs. García!' },
        { spanish: 'Buenas noches, que duermas bien.', english: 'Good night, sleep well.' },
      ],
    },
  },
  {
    id: 'lesson_02',
    unitId: 'unit_01',
    title: 'Introductions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w006', 'w007', 'w008', 'w009', 'w010', 'w011', 'w012'],
    grammarNote: {
      tip: "Spanish has two words for 'you': 'tú' (informal – use with friends, family, children) and 'usted' (formal – use with strangers, elders, bosses). '¿Cómo te llamas?' is informal; '¿Cómo se llama usted?' is formal.",
      examples: [
        { spanish: 'Me llamo Ana. ¿Y tú, cómo te llamas?', english: 'My name is Ana. And you, what is your name? (informal)' },
        { spanish: 'Mucho gusto, señor López.', english: 'Nice to meet you, Mr. López. (formal)' },
      ],
    },
  },
  {
    id: 'lesson_03',
    unitId: 'unit_01',
    title: 'Numbers 1–20',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w013', 'w014', 'w015', 'w016', 'w017', 'w018', 'w019', 'w020'],
    grammarNote: {
      tip: "'Uno' becomes 'un' before a masculine noun and 'una' before a feminine noun. Numbers 16–29 are written as one word: dieciséis, diecisiete, veintidós, veintitrés, etc.",
      examples: [
        { spanish: 'Tengo un hermano y una hermana.', english: 'I have one brother and one sister.' },
        { spanish: 'Son las dos de la tarde.', english: 'It is two in the afternoon.' },
      ],
    },
  },
  {
    id: 'lesson_27',
    unitId: 'unit_01',
    title: 'Asking Questions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w172', 'w173', 'w174', 'w175', 'w176', 'w177', 'w178'],
    grammarNote: {
      tip: "Spanish question words always carry an accent mark: ¿qué? (what), ¿dónde? (where), ¿cuándo? (when), ¿quién? (who), ¿por qué? (why), ¿cuánto? (how much), ¿cómo? (how). Without the accent these words are conjunctions, not questions.",
      examples: [
        { spanish: '¿Dónde está el baño, por favor?', english: 'Where is the bathroom, please?' },
        { spanish: '¿Por qué estudias español?', english: 'Why do you study Spanish?' },
      ],
    },
  },
  {
    id: 'lesson_28',
    unitId: 'unit_01',
    title: 'Unit 1 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w001', 'w002', 'w003', 'w005', 'w006', 'w007', 'w009', 'w011', 'w013', 'w015', 'w019', 'w172', 'w174', 'w175'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 1 Review! This lesson revisits the key vocabulary and phrases from all Unit 1 lessons: greetings, introductions, numbers, and question words. Focus on any words you found tricky earlier.",
      examples: [
        { spanish: 'Buenos días, me llamo Ana. ¿Cómo te llamas?', english: 'Good morning, my name is Ana. What is your name?' },
        { spanish: 'Mucho gusto. Tengo veinte años. ¿Y tú?', english: 'Nice to meet you. I am twenty years old. And you?' },
      ],
    },
  },

  // ── Unit 2 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_04',
    unitId: 'unit_02',
    title: 'At the Café',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w021', 'w022', 'w023', 'w024', 'w025'],
    grammarNote: {
      tip: "In Spanish, all nouns are masculine (el / un) or feminine (la / una). Nouns ending in -o are usually masculine and nouns ending in -a are usually feminine — but 'el agua' (water) is an exception as a feminine noun that takes 'el' to avoid a clash of vowel sounds.",
      examples: [
        { spanish: 'Quiero un café y una manzana.', english: 'I want a coffee and an apple.' },
        { spanish: 'La cuenta, por favor.', english: 'The bill, please.' },
      ],
    },
  },
  {
    id: 'lesson_05',
    unitId: 'unit_02',
    title: 'Food & Meals',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w026', 'w027', 'w028', 'w029', 'w030'],
    grammarNote: {
      tip: "To say you like something in Spanish, use 'me gusta' + singular noun or infinitive, or 'me gustan' + plural noun. The thing you like is the subject — think of it as 'it pleases me': 'me gusta el arroz' (rice pleases me = I like rice).",
      examples: [
        { spanish: 'Me gusta el pollo asado.', english: 'I like roast chicken.' },
        { spanish: '¿Te gustan las manzanas?', english: 'Do you like apples?' },
      ],
    },
  },
  {
    id: 'lesson_06',
    unitId: 'unit_02',
    title: 'Essential Verbs',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w031', 'w032', 'w033', 'w034', 'w035'],
    grammarNote: {
      tip: "Spanish has two verbs for 'to be': 'ser' (permanent identity, nationality, profession, characteristics) and 'estar' (temporary states, emotions, location). Choosing correctly is one of the most important skills in Spanish.",
      examples: [
        { spanish: 'Soy médico. (ser — permanent identity)', english: 'I am a doctor.' },
        { spanish: 'Estoy en casa. (estar — temporary location)', english: 'I am at home.' },
      ],
    },
  },
  {
    id: 'lesson_07',
    unitId: 'unit_02',
    title: 'Action Verbs',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w036', 'w037', 'w038', 'w039', 'w040'],
    grammarNote: {
      tip: "Regular Spanish verbs end in -ar, -er, or -ir. For 'yo' (I) in the present tense: -ar → -o (hablo), -er → -o (como), -ir → -o (escribo). For 'tú': -ar → -as (hablas), -er → -es (comes), -ir → -es (escribes).",
      examples: [
        { spanish: 'Hablo español todos los días.', english: 'I speak Spanish every day.' },
        { spanish: '¿Comes carne o eres vegetariano?', english: 'Do you eat meat or are you vegetarian?' },
      ],
    },
  },
  {
    id: 'lesson_30',
    unitId: 'unit_02',
    title: 'Unit 2 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w021', 'w022', 'w023', 'w024', 'w025', 'w026', 'w028', 'w030', 'w031', 'w032', 'w033', 'w036', 'w037'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 2 Review! Covering café and food vocabulary, essential verbs (ser, estar, tener, querer, poder), and action verbs. Pay special attention to the ser vs. estar distinction.",
      examples: [
        { spanish: 'Quisiera un café con leche, por favor.', english: 'I would like a coffee with milk, please.' },
        { spanish: 'Como arroz y bebo agua todos los días.', english: 'I eat rice and drink water every day.' },
      ],
    },
  },

  // ── Unit 3 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_08',
    unitId: 'unit_03',
    title: 'Getting Around',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w041', 'w042', 'w043', 'w044'],
    grammarNote: {
      tip: "To ask politely in travel situations, use 'quisiera' (I would like) instead of 'quiero' (I want). It comes from 'querer' and is the conditional form — softer and more polite, just like 'would like' in English.",
      examples: [
        { spanish: 'Quisiera un billete de ida y vuelta.', english: 'I would like a return ticket.' },
        { spanish: '¿Me puede decir dónde está la estación?', english: 'Can you tell me where the station is?' },
      ],
    },
  },
  {
    id: 'lesson_09',
    unitId: 'unit_03',
    title: 'Directions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w045', 'w046', 'w047', 'w048', 'w049', 'w050'],
    grammarNote: {
      tip: "When giving directions in Spanish, use the imperative (command form). For most verbs: 'gira' (turn), 'sigue' (continue), 'cruza' (cross). Combine with 'a la derecha / izquierda' (to the right / left) and 'recto' (straight ahead).",
      examples: [
        { spanish: 'Sigue recto y luego gira a la izquierda.', english: 'Go straight and then turn left.' },
        { spanish: 'El banco está muy cerca, a dos minutos.', english: 'The bank is very close, two minutes away.' },
      ],
    },
  },
  {
    id: 'lesson_29',
    unitId: 'unit_03',
    title: 'Getting There by Transport',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w179', 'w180', 'w181', 'w182', 'w183', 'w184'],
    grammarNote: {
      tip: "To say how you travel, use 'ir en + transport': 'voy en metro' (I go by metro), 'voy en autobús' (I go by bus). Exception: 'ir a pie' (to go on foot) — use 'a', not 'en'. You can also use 'coger' or 'tomar' (to take): 'cojo el tren'.",
      examples: [
        { spanish: 'Voy al trabajo en metro todos los días.', english: 'I go to work by metro every day.' },
        { spanish: '¿Tomamos un taxi o vamos en autobús?', english: 'Shall we take a taxi or go by bus?' },
      ],
    },
  },
  {
    id: 'lesson_31',
    unitId: 'unit_03',
    title: 'Unit 3 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w041', 'w042', 'w043', 'w044', 'w045', 'w046', 'w047', 'w048', 'w050', 'w179', 'w180', 'w182', 'w184'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 3 Review! Covering travel vocabulary (airport, hotel, station, ticket), directions (left, right, straight, near, far), and transport (metro, bus, car, train). Practice giving and following directions!",
      examples: [
        { spanish: '¿Dónde está la estación de metro más cercana?', english: 'Where is the nearest metro station?' },
        { spanish: 'Coge el tren y baja en la segunda parada.', english: 'Take the train and get off at the second stop.' },
      ],
    },
  },

  // ── Unit 4 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_10',
    unitId: 'unit_04',
    title: 'Family Members',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w051', 'w052', 'w053', 'w054', 'w055', 'w056', 'w057', 'w058', 'w059', 'w060'],
    grammarNote: {
      tip: "Family member nouns come in masculine/feminine pairs: hermano/hermana, hijo/hija, abuelo/abuela. For a mixed group, use the masculine plural: 'mis hermanos' can mean 'my brothers' or 'my brothers and sisters'. Use 'mi' (my, singular) and 'mis' (my, plural).",
      examples: [
        { spanish: 'Mis abuelos son muy simpáticos.', english: 'My grandparents are very nice.' },
        { spanish: 'Tengo dos hermanos y una hermana.', english: 'I have two brothers and one sister.' },
      ],
    },
  },
  {
    id: 'lesson_11',
    unitId: 'unit_04',
    title: 'Describing Things',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w061', 'w062', 'w063', 'w064', 'w065', 'w066', 'w067', 'w068', 'w069', 'w070'],
    grammarNote: {
      tip: "Adjectives in Spanish must agree with the noun in gender and number. Adjectives ending in -o become -a for feminine: 'bueno/buena'. Adjectives ending in -e (like 'grande') or a consonant don't change for gender, only for number: 'grande/grandes'.",
      examples: [
        { spanish: 'Un coche rojo y grande.', english: 'A big red car.' },
        { spanish: 'Una ciudad bonita y tranquila.', english: 'A pretty, peaceful city.' },
      ],
    },
  },
  {
    id: 'lesson_12',
    unitId: 'unit_04',
    title: 'Colors',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w071', 'w072', 'w073', 'w074', 'w075', 'w076', 'w077', 'w078'],
    grammarNote: {
      tip: "Colors are adjectives and agree in gender and number with the noun. Most follow the pattern: rojo/roja/rojos/rojas. Colors ending in -e (verde) only change for plural (verde/verdes). Colors from other languages often stay unchanged: beige, rosa, naranja.",
      examples: [
        { spanish: 'Quiero la camisa azul, no la roja.', english: 'I want the blue shirt, not the red one.' },
        { spanish: 'Tiene los ojos verdes y el pelo negro.', english: 'She has green eyes and black hair.' },
      ],
    },
  },
  {
    id: 'lesson_13',
    unitId: 'unit_04',
    title: 'Time & Frequency',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w079', 'w080', 'w081', 'w082', 'w083', 'w084', 'w085', 'w086'],
    grammarNote: {
      tip: "To tell the time in Spanish, use 'son las...' for all hours except 1:00 which uses 'es la una'. Add 'y media' (half past) or 'y cuarto' (quarter past). For 'to the hour' use 'menos': 'son las cuatro menos diez' (ten to four).",
      examples: [
        { spanish: 'Son las ocho y cuarto de la mañana.', english: 'It is quarter past eight in the morning.' },
        { spanish: 'Siempre desayuno a las siete.', english: 'I always have breakfast at seven.' },
      ],
    },
  },
  {
    id: 'lesson_32',
    unitId: 'unit_04',
    title: 'Unit 4 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w051', 'w052', 'w053', 'w054', 'w057', 'w058', 'w061', 'w062', 'w063', 'w064', 'w071', 'w072', 'w079', 'w080'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 4 Review! Covering family vocabulary, adjectives (big/small, good/bad, new/old), colors, and time expressions. Remember that adjectives agree in gender and number with the noun they describe.",
      examples: [
        { spanish: 'Mi hermana mayor tiene los ojos azules.', english: 'My older sister has blue eyes.' },
        { spanish: 'Siempre llego tarde los lunes.', english: 'I always arrive late on Mondays.' },
      ],
    },
  },

  // ── Unit 5 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_14',
    unitId: 'unit_05',
    title: 'At the Shop',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w087', 'w088', 'w089', 'w090', 'w091', 'w092'],
    grammarNote: {
      tip: "When shopping, use '¿Cuánto cuesta?' (how much does it cost?) for a single item, or '¿Cuánto cuestan?' for multiple items. To say something is cheap or expensive: 'es barato/caro'. To browse: 'solo estoy mirando' (I'm just looking).",
      examples: [
        { spanish: '¿Cuánto cuesta esta chaqueta?', english: 'How much does this jacket cost?' },
        { spanish: 'Es muy caro. ¿Tiene algo más barato?', english: 'It is very expensive. Do you have something cheaper?' },
      ],
    },
  },
  {
    id: 'lesson_15',
    unitId: 'unit_05',
    title: 'Paying & Money',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w093', 'w094', 'w095', 'w096', 'w097', 'w098', 'w099'],
    grammarNote: {
      tip: "To pay, say 'quisiera pagar' (I'd like to pay) or '¿puedo pagar con tarjeta?' (can I pay by card?). 'El cambio' means the change you receive back. 'La tarjeta de crédito/débito' is credit/debit card. In many countries, cash is still preferred.",
      examples: [
        { spanish: '¿Puedo pagar con tarjeta de crédito?', english: 'Can I pay by credit card?' },
        { spanish: 'Quédese con el cambio.', english: 'Keep the change.' },
      ],
    },
  },
  {
    id: 'lesson_16',
    unitId: 'unit_05',
    title: 'Clothes',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w100', 'w101', 'w102', 'w103', 'w104', 'w105', 'w106'],
    grammarNote: {
      tip: "To ask for a different size say '¿lo tiene en una talla más grande/pequeña?' (do you have it in a larger/smaller size?). To ask to try something on: '¿puedo probarme esto?' Clothing items are mostly masculine: el vestido, el pantalón, el abrigo, la camisa.",
      examples: [
        { spanish: 'Me queda grande. ¿Tiene una talla menos?', english: 'It is too big on me. Do you have one size smaller?' },
        { spanish: '¿Puedo probarme esta camisa azul?', english: 'Can I try on this blue shirt?' },
      ],
    },
  },
  {
    id: 'lesson_33',
    unitId: 'unit_05',
    title: 'Unit 5 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w087', 'w088', 'w089', 'w090', 'w091', 'w093', 'w095', 'w097', 'w100', 'w101', 'w103', 'w105'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 5 Review! Covering shopping vocabulary, prices, paying, and clothes. Practice phrases for asking prices, trying things on, and making payments.",
      examples: [
        { spanish: '¿Cuánto cuestan estos zapatos? Son muy bonitos.', english: 'How much do these shoes cost? They are very nice.' },
        { spanish: 'Quisiera pagar con tarjeta, por favor.', english: 'I would like to pay by card, please.' },
      ],
    },
  },

  // ── Unit 6 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_17',
    unitId: 'unit_06',
    title: 'Weather Conditions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w107', 'w108', 'w109', 'w110', 'w111', 'w112', 'w113'],
    grammarNote: {
      tip: "Spanish weather uses different verb structures. 'Hace' (it makes/does) is used for temperature and general conditions: 'hace frío/calor/viento'. 'Hay' (there is) is used for phenomena: 'hay niebla/nubes'. 'Está' is used for states: 'está nublado'.",
      examples: [
        { spanish: 'Hace mucho calor hoy, ¿verdad?', english: 'It is very hot today, isn\'t it?' },
        { spanish: '¿Va a llover esta tarde?', english: 'Is it going to rain this afternoon?' },
      ],
    },
  },
  {
    id: 'lesson_18',
    unitId: 'unit_06',
    title: 'Seasons',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w114', 'w115', 'w116', 'w117', 'w118', 'w119', 'w120'],
    grammarNote: {
      tip: "Seasons in Spanish: el verano (summer), el otoño (autumn/fall), el invierno (winter), la primavera (spring). Use 'en' to say 'in' a season: 'en verano hace calor'. Note: 'la primavera' is the only feminine season.",
      examples: [
        { spanish: 'En invierno nieva mucho en las montañas.', english: 'In winter it snows a lot in the mountains.' },
        { spanish: 'La primavera es mi estación favorita.', english: 'Spring is my favourite season.' },
      ],
    },
  },
  {
    id: 'lesson_19',
    unitId: 'unit_06',
    title: 'Nature & Places',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w121', 'w122', 'w123', 'w124', 'w125', 'w126'],
    grammarNote: {
      tip: "Use 'estar' for location: 'el lago está en las montañas'. To say you're going somewhere, use 'ir a': 'voy a la playa' (I'm going to the beach). Remember: 'a + el = al', so 'voy al mar' (not 'voy a el mar').",
      examples: [
        { spanish: 'El río está cerca del bosque.', english: 'The river is near the forest.' },
        { spanish: 'Este verano vamos al mar.', english: 'This summer we are going to the sea.' },
      ],
    },
  },
  {
    id: 'lesson_34',
    unitId: 'unit_06',
    title: 'Unit 6 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w107', 'w108', 'w109', 'w110', 'w111', 'w114', 'w115', 'w116', 'w117', 'w121', 'w122', 'w124'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 6 Review! Covering weather (hot, cold, rain, sun, wind), seasons (spring, summer, autumn, winter), and nature/places (beach, forest, mountain, river). Remember the different weather verb structures: hace, hay, está.",
      examples: [
        { spanish: 'En primavera hace buen tiempo y hay muchas flores.', english: 'In spring the weather is nice and there are many flowers.' },
        { spanish: 'Me gusta ir al bosque cuando hace fresco.', english: 'I like going to the forest when it is cool.' },
      ],
    },
  },

  // ── Unit 7 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_20',
    unitId: 'unit_07',
    title: 'Body Parts',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w127', 'w128', 'w129', 'w130', 'w131', 'w132', 'w133'],
    grammarNote: {
      tip: "In Spanish, body parts are usually used with a definite article (el/la) rather than a possessive. Instead of 'my hand', say 'la mano'. The context (and often a reflexive verb) makes it clear it refers to your own body: 'me duele la cabeza' (my head hurts).",
      examples: [
        { spanish: 'Me duele la cabeza.', english: 'My head hurts. (lit. The head hurts me)' },
        { spanish: 'Lávate las manos antes de comer.', english: 'Wash your hands before eating.' },
      ],
    },
  },
  {
    id: 'lesson_21',
    unitId: 'unit_07',
    title: 'Feeling Ill',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w134', 'w135', 'w136', 'w137', 'w138', 'w139', 'w140'],
    grammarNote: {
      tip: "To describe pain, use 'me duele' (singular) or 'me duelen' (plural) + body part: 'me duele el estómago', 'me duelen los pies'. To describe illness, use 'tener': 'tengo fiebre / tos / gripe'. To describe general wellbeing, use 'sentirse': 'me siento mal'.",
      examples: [
        { spanish: 'Me duele la garganta y tengo fiebre.', english: 'My throat hurts and I have a fever.' },
        { spanish: 'No me siento bien hoy.', english: 'I do not feel well today.' },
      ],
    },
  },
  {
    id: 'lesson_22',
    unitId: 'unit_07',
    title: 'At the Doctor',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w141', 'w142', 'w143', 'w144', 'w145', 'w146'],
    grammarNote: {
      tip: "To describe how long you've had symptoms, use 'desde hace + time period': 'me duele desde hace tres días' (it has been hurting for three days). Use 'necesitar' for what you need: 'necesito una receta' (I need a prescription), 'necesito un médico'.",
      examples: [
        { spanish: 'Tengo dolor de estómago desde hace dos días.', english: 'I have had a stomachache for two days.' },
        { spanish: '¿Me puede dar algo para el dolor de cabeza?', english: 'Can you give me something for the headache?' },
      ],
    },
  },
  {
    id: 'lesson_35',
    unitId: 'unit_07',
    title: 'Unit 7 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w127', 'w128', 'w129', 'w130', 'w131', 'w134', 'w135', 'w136', 'w141', 'w142', 'w143'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 7 Review! Covering body parts, describing illness (duele, tengo fiebre), and visiting the doctor. Practice using 'me duele/duelen' for pain and 'tener' for illness.",
      examples: [
        { spanish: 'Me duelen los pies y tengo fiebre desde ayer.', english: 'My feet hurt and I have had a fever since yesterday.' },
        { spanish: 'El médico me recetó antibióticos.', english: 'The doctor prescribed me antibiotics.' },
      ],
    },
  },

  // ── Unit 8 ────────────────────────────────────────────────────────────────
  {
    id: 'lesson_23',
    unitId: 'unit_08',
    title: 'Sports',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w147', 'w148', 'w149', 'w150', 'w151', 'w152'],
    grammarNote: {
      tip: "To say you play a sport, use 'jugar a' + sport for competitive/team sports: 'juego al fútbol'. For activities, use 'hacer': 'hago natación' (I swim), 'hago ejercicio' (I exercise). 'Practicar' works for both: 'practico tenis / natación'.",
      examples: [
        { spanish: 'Juego al fútbol los sábados.', english: 'I play football on Saturdays.' },
        { spanish: '¿Practicas algún deporte?', english: 'Do you do any sports?' },
      ],
    },
  },
  {
    id: 'lesson_24',
    unitId: 'unit_08',
    title: 'Music & Arts',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w153', 'w154', 'w155', 'w156', 'w157', 'w158'],
    grammarNote: {
      tip: "To say you play an instrument, use 'tocar' (not 'jugar'): 'toco la guitarra'. For listening to music, use 'escuchar': 'escucho música clásica'. 'Dibujar' is to draw, 'pintar' is to paint. The word for 'concert' is 'el concierto'.",
      examples: [
        { spanish: 'Toco el piano desde los siete años.', english: 'I have been playing piano since I was seven.' },
        { spanish: '¿Qué tipo de música te gusta?', english: 'What type of music do you like?' },
      ],
    },
  },
  {
    id: 'lesson_25',
    unitId: 'unit_08',
    title: 'Reading & Learning',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w159', 'w160', 'w161', 'w162', 'w163', 'w164'],
    grammarNote: {
      tip: "To talk about learning in Spanish, use 'aprender a + infinitive': 'estoy aprendiendo a hablar español'. 'Estudiar' is for formal study at school/university. 'Leer' (to read) takes direct articles: 'leo un libro' but 'leo en español' (without article when language is used).",
      examples: [
        { spanish: 'Estoy aprendiendo a leer en español.', english: 'I am learning to read in Spanish.' },
        { spanish: 'Leo un libro al mes como mínimo.', english: 'I read at least one book a month.' },
      ],
    },
  },
  {
    id: 'lesson_26',
    unitId: 'unit_08',
    title: 'Weekend Activities',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w165', 'w166', 'w167', 'w168', 'w169', 'w170', 'w171'],
    grammarNote: {
      tip: "For habitual weekend activities use the present tense: 'los fines de semana voy al cine'. To talk about last weekend (past), use the preterite: 'el sábado fui al parque' (on Saturday I went to the park). 'Fui' is the irregular preterite of 'ir' (to go).",
      examples: [
        { spanish: 'Los domingos salgo a caminar con mis amigos.', english: 'On Sundays I go for a walk with my friends.' },
        { spanish: '¿Qué hiciste este fin de semana?', english: 'What did you do this weekend?' },
      ],
    },
  },
  {
    id: 'lesson_36',
    unitId: 'unit_08',
    title: 'Unit 8 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w147', 'w148', 'w149', 'w153', 'w154', 'w155', 'w159', 'w160', 'w165', 'w166', 'w167'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 8 Review! Covering sports (jugar al fútbol, hacer natación), music and arts (tocar la guitarra, escuchar música), reading and learning (leer, estudiar), and weekend activities (salir, cocinar, viajar). ¡Buen trabajo!",
      examples: [
        { spanish: 'Los fines de semana juego al tenis y luego voy al cine.', english: 'At weekends I play tennis and then go to the cinema.' },
        { spanish: 'Toco la guitarra y me gusta mucho leer.', english: 'I play guitar and I really like reading.' },
      ],
    },
  },

  // ── Unit 9 — Work & Professions ───────────────────────────────────────────
  {
    id: 'lesson_37',
    unitId: 'unit_09',
    title: 'Jobs & Titles',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w185', 'w189', 'w190', 'w203', 'w204'],
    grammarNote: {
      tip: "Most Spanish job titles change with gender: 'el abogado / la abogada', 'el ingeniero / la ingeniera'. Some remain the same for both: 'el/la estudiante', 'el/la periodista'. When giving your job, use 'soy + profession' without an article: 'Soy ingeniero' (not 'Soy un ingeniero').",
      examples: [
        { spanish: 'Soy abogada y trabajo en Madrid.', english: 'I am a lawyer and I work in Madrid.' },
        { spanish: '¿A qué te dedicas? — Soy ingeniero de software.', english: 'What do you do? — I am a software engineer.' },
      ],
    },
  },
  {
    id: 'lesson_38',
    unitId: 'unit_09',
    title: 'The Workplace',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w186', 'w187', 'w188', 'w194', 'w200'],
    grammarNote: {
      tip: "Use 'ser' for permanent descriptions: 'Es una empresa grande' (It is a big company). Use 'estar' for locations and temporary states: 'Estoy en la oficina' (I am at the office). Remember: 'Soy empleado' (I am an employee — identity) vs. 'Estoy cansado' (I am tired — state).",
      examples: [
        { spanish: 'La empresa está en el centro de la ciudad.', english: 'The company is in the city centre.' },
        { spanish: 'Mi jefe es muy exigente pero nos trata bien.', english: 'My boss is very demanding but treats us well.' },
      ],
    },
  },
  {
    id: 'lesson_39',
    unitId: 'unit_09',
    title: 'Work Vocabulary',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w191', 'w192', 'w193', 'w195', 'w202'],
    grammarNote: {
      tip: "Use 'tener' (to have) with many work-related nouns: 'tener una reunión' (to have a meeting), 'tener un proyecto' (to have a project), 'tener buen sueldo' (to have a good salary). 'Tener' is irregular: tengo, tienes, tiene, tenemos, tenéis, tienen.",
      examples: [
        { spanish: 'Tengo una reunión importante esta tarde.', english: 'I have an important meeting this afternoon.' },
        { spanish: 'El proyecto tiene un horario muy ajustado.', english: 'The project has a very tight schedule.' },
      ],
    },
  },
  {
    id: 'lesson_40',
    unitId: 'unit_09',
    title: 'Communication & Tech',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w196', 'w197', 'w198', 'w201', 'w199'],
    grammarNote: {
      tip: "Indirect object pronouns (le, les) show who receives the action: 'Le mando el correo al cliente' (I send the email to the client). In everyday speech, Spaniards often use 'mandar' or 'enviar' for sending emails. 'Contratar a alguien' takes the personal 'a': 'Contratan a ingenieros.'",
      examples: [
        { spanish: 'Le envío el informe por correo electrónico.', english: 'I send the report to them by email.' },
        { spanish: 'Mañana tengo una entrevista con el cliente.', english: 'Tomorrow I have a meeting with the client.' },
      ],
    },
  },
  {
    id: 'lesson_41',
    unitId: 'unit_09',
    title: 'Career & Business',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w185', 'w191', 'w194', 'w199', 'w203'],
    grammarNote: {
      tip: "'Hay que + infinitive' expresses general obligation (what one must do): 'Hay que trabajar mucho para tener éxito' (One has to work hard to succeed). 'Tener que + infinitive' is personal: 'Tengo que terminar el informe' (I have to finish the report). Both are very common in a work context.",
      examples: [
        { spanish: 'Hay que contratar a más empleados este año.', english: 'We need to hire more employees this year.' },
        { spanish: 'Para tener éxito en los negocios, hay que trabajar en equipo.', english: 'To succeed in business, you have to work as a team.' },
      ],
    },
  },
  {
    id: 'lesson_42',
    unitId: 'unit_09',
    title: 'Unit 9 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w185', 'w186', 'w187', 'w189', 'w191', 'w192', 'w194', 'w197', 'w200', 'w203'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 9 Review! Key patterns: 'Soy + profession' (no article), 'ser' for identity vs. 'estar' for location/state, 'tener una reunión / proyecto', 'hay que + infinitive' for obligation, and 'le + verb' for indirect objects. ¡Buen trabajo en el trabajo!",
      examples: [
        { spanish: 'Soy ingeniero y trabajo en una empresa tecnológica.', english: 'I am an engineer and I work at a tech company.' },
        { spanish: 'Hay que mandar el informe al cliente antes del viernes.', english: 'The report must be sent to the client before Friday.' },
      ],
    },
  },

  // ── Unit 10 — Home & Daily Routine ────────────────────────────────────────
  {
    id: 'lesson_43',
    unitId: 'unit_10',
    title: 'Rooms of the House',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w205', 'w206', 'w207', 'w208', 'w222'],
    grammarNote: {
      tip: "To say where something is in the home, use 'en + definite article': 'en la cocina' (in the kitchen), 'en el salón' (in the living room). For movement into a room, use 'ir a': 'voy al dormitorio' (I go to the bedroom). 'Al' is the contraction of 'a + el'.",
      examples: [
        { spanish: 'El televisor está en el salón.', english: 'The television is in the living room.' },
        { spanish: 'Voy al dormitorio a descansar un poco.', english: 'I am going to the bedroom to rest a little.' },
      ],
    },
  },
  {
    id: 'lesson_44',
    unitId: 'unit_10',
    title: 'Furniture & Objects',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w209', 'w210', 'w211', 'w212', 'w218'],
    grammarNote: {
      tip: "Demonstrative adjectives in Spanish agree with the noun they describe. 'Este / esta' = this (near you). 'Ese / esa' = that (near the other person). 'Aquel / aquella' = that over there (far). Plurals: 'estos, estas / esos, esas'. Example: 'Esta silla es cómoda. Ese sofá es grande.'",
      examples: [
        { spanish: 'Esta silla es incómoda; prefiero ese sofá.', english: 'This chair is uncomfortable; I prefer that sofa.' },
        { spanish: '¿De quién es esta cama? — Es mía.', english: 'Whose bed is this? — It is mine.' },
      ],
    },
  },
  {
    id: 'lesson_45',
    unitId: 'unit_10',
    title: 'Morning Routine',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w209', 'w213', 'w214', 'w215', 'w216'],
    grammarNote: {
      tip: "Reflexive verbs describe actions you do to yourself. They use reflexive pronouns: me, te, se, nos, os, se. 'Ducharse' → me ducho, te duchas, se ducha. 'Levantarse' → me levanto. These are very common for daily routines: 'Me ducho, me visto y desayuno'.",
      examples: [
        { spanish: 'Me despierto a las siete y me ducho enseguida.', english: 'I wake up at seven and shower right away.' },
        { spanish: 'Después de desayunar, salgo por la puerta.', english: 'After having breakfast, I leave through the door.' },
      ],
    },
  },
  {
    id: 'lesson_46',
    unitId: 'unit_10',
    title: 'Household Chores',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w205', 'w217', 'w219', 'w220', 'w221'],
    grammarNote: {
      tip: "'Hay que + infinitive' states what needs doing in general: 'Hay que limpiar la cocina' (The kitchen needs cleaning). 'Tener que + infinitive' is personal: 'Tengo que poner la lavadora' (I have to put the washing machine on). Both are used constantly for household tasks.",
      examples: [
        { spanish: 'Hay que limpiar la cocina antes de que lleguen.', english: 'The kitchen needs to be cleaned before they arrive.' },
        { spanish: 'Tengo que poner la lavadora esta tarde.', english: 'I have to put the washing on this afternoon.' },
      ],
    },
  },
  {
    id: 'lesson_47',
    unitId: 'unit_10',
    title: 'Home & Renting',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w206', 'w207', 'w208', 'w223', 'w224'],
    grammarNote: {
      tip: "Use 'querer + infinitive' for plans or wishes: 'Queremos alquilar un piso' (We want to rent a flat). Use 'ir a + infinitive' for near-future plans: 'Vamos a mudarnos el mes que viene' (We are going to move next month). Both are very natural alternatives to the future tense.",
      examples: [
        { spanish: 'Queremos alquilar un piso con dos dormitorios.', english: 'We want to rent a flat with two bedrooms.' },
        { spanish: 'Nos vamos a mudar a una casa más grande.', english: 'We are going to move to a bigger house.' },
      ],
    },
  },
  {
    id: 'lesson_48',
    unitId: 'unit_10',
    title: 'Unit 10 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w205', 'w206', 'w207', 'w208', 'w209', 'w215', 'w217', 'w221', 'w223', 'w224'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 10 Review! Key patterns: 'en la cocina / el salón' (location), demonstratives este/esta/ese/esa (this/that), reflexive verbs for routines (me ducho, me levanto), 'hay que / tener que + infinitive' for chores, and 'querer / ir a + infinitive' for plans. ¡Tu casa, tu idioma!",
      examples: [
        { spanish: 'Me levanto, me ducho y desayuno en la cocina.', english: 'I get up, shower, and have breakfast in the kitchen.' },
        { spanish: 'Queremos mudarnos a un piso con salón grande.', english: 'We want to move to a flat with a large living room.' },
      ],
    },
  },

  // ── Unit 11 — Emotions & Opinions ─────────────────────────────────────────
  {
    id: 'lesson_49',
    unitId: 'unit_11',
    title: 'Basic Emotions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w225', 'w226', 'w227', 'w228', 'w230'],
    grammarNote: {
      tip: "Use 'estar + adjective' for temporary emotional states: 'Estoy feliz' (I am happy right now), 'Estoy triste' (I am sad). These describe how you feel at a particular moment, not your permanent character. Adjectives must agree: 'Estoy enfadada' (fem.) vs. 'Estoy enfadado' (masc.).",
      examples: [
        { spanish: 'Estoy muy feliz porque aprobé el examen.', english: 'I am very happy because I passed the exam.' },
        { spanish: 'Ella está triste y aburrida hoy.', english: 'She is sad and bored today.' },
      ],
    },
  },
  {
    id: 'lesson_50',
    unitId: 'unit_11',
    title: 'More Emotions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w229', 'w231', 'w232', 'w233', 'w242'],
    grammarNote: {
      tip: "Spanish adjectives must agree in gender and number with the noun or subject. Most adjectives ending in '-o' change to '-a' for feminine: 'emocionado → emocionada', 'orgulloso → orgullosa', 'preocupado → preocupada'. Adjectives ending in '-e' or consonant usually stay the same: 'nervioso → nerviosa' (note: this one does change!).",
      examples: [
        { spanish: 'Estoy muy emocionada por la boda de mi hermana.', english: 'I am very excited about my sister\'s wedding.' },
        { spanish: 'Él está nervioso y preocupado por el resultado.', english: 'He is nervous and worried about the result.' },
      ],
    },
  },
  {
    id: 'lesson_51',
    unitId: 'unit_11',
    title: 'Expressing Opinions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w234', 'w235', 'w237', 'w241', 'w244'],
    grammarNote: {
      tip: "To express opinions use 'creer que' or 'opinar que' + a clause: 'Creo que es importante' (I think it is important). To express feelings about something, use 'sentir que': 'Siento que no entiendo bien' (I feel that I don't understand well). For strong feelings, use 'me parece': 'Me parece interesante' (I find it interesting).",
      examples: [
        { spanish: '¿Qué opinas de la situación? — Creo que es complicada.', english: 'What do you think of the situation? — I think it is complicated.' },
        { spanish: 'Me parece que ese sentimiento es completamente normal.', english: 'I think that feeling is completely normal.' },
      ],
    },
  },
  {
    id: 'lesson_52',
    unitId: 'unit_11',
    title: 'Agreeing & Disagreeing',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w234', 'w235', 'w236', 'w242', 'w243'],
    grammarNote: {
      tip: "Use 'también' (also/too) for positive agreement: 'Yo también estoy de acuerdo'. Use 'tampoco' (neither/not either) for negative agreement: 'Yo tampoco creo eso'. Use 'pero' (but) to soften a disagreement: 'Estoy de acuerdo, pero creo que hay que considerar...'. These are essential for conversation.",
      examples: [
        { spanish: 'Estoy de acuerdo contigo. Yo también creo que es importante.', english: 'I agree with you. I also think it is important.' },
        { spanish: 'No estoy de acuerdo — estoy un poco confundido con esa idea.', english: 'I disagree — I am a bit confused by that idea.' },
      ],
    },
  },
  {
    id: 'lesson_53',
    unitId: 'unit_11',
    title: 'Love & Fear',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w238', 'w239', 'w240', 'w241', 'w237'],
    grammarNote: {
      tip: "Use 'tener + emotion noun' for many feelings: 'tener miedo' (to be afraid), 'tener ganas de' (to feel like doing something), 'tener celos' (to be jealous). This is different from English — you 'have' the emotion rather than 'be' it. 'Odiar' and 'amar/querer' take direct objects: 'Te quiero' (I love you).",
      examples: [
        { spanish: 'Tengo miedo de hablar en público, pero lo intento.', english: 'I am afraid of speaking in public, but I try.' },
        { spanish: 'El amor y la alegría son los sentimientos más bonitos.', english: 'Love and joy are the most beautiful feelings.' },
      ],
    },
  },
  {
    id: 'lesson_54',
    unitId: 'unit_11',
    title: 'Unit 11 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w225', 'w226', 'w229', 'w232', 'w234', 'w235', 'w236', 'w239', 'w240', 'w242'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 11 Review! Key patterns: 'estar + adjective' for emotional states (feliz, triste, nervioso), adjective gender agreement (-o/-a), 'creer / opinar que' for opinions, 'también / tampoco' for agreement, and 'tener miedo / tener ganas de' for feelings. ¡Excelente trabajo!",
      examples: [
        { spanish: 'Estoy emocionado y un poco nervioso. ¿Qué opinas tú?', english: 'I am excited and a little nervous. What do you think?' },
        { spanish: 'Creo que es normal tener miedo antes de algo nuevo.', english: 'I think it is normal to be afraid before something new.' },
      ],
    },
  },

  // ── Unit 12 — Spanish Culture & Life ──────────────────────────────────────
  {
    id: 'lesson_55',
    unitId: 'unit_12',
    title: 'Festivals & Traditions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w245', 'w246', 'w248', 'w249', 'w253'],
    grammarNote: {
      tip: "The impersonal 'se' construction is used to describe customs and traditions — what 'one does' or 'people do': 'Se celebra en primavera' (It is celebrated in spring / People celebrate it in spring). This avoids naming a specific subject and is very common when describing cultural practices.",
      examples: [
        { spanish: 'En España se celebran muchas fiestas durante el verano.', english: 'In Spain, many festivals are celebrated during the summer.' },
        { spanish: 'La tradición de la siesta se mantiene en muchos pueblos.', english: 'The tradition of the siesta is maintained in many villages.' },
      ],
    },
  },
  {
    id: 'lesson_56',
    unitId: 'unit_12',
    title: 'Cities & Places',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w249', 'w250', 'w251', 'w252', 'w263'],
    grammarNote: {
      tip: "Spanish cities use 'en' for location: 'Vivo en Madrid' (I live in Madrid). For movement toward a city, use 'a': 'Voy a Sevilla' (I am going to Seville). The definite article is NOT used before city names in Spanish (unlike some other languages): 'Madrid es la capital' — not 'La Madrid'.",
      examples: [
        { spanish: 'Madrid es la capital y tiene muchos castillos y museos.', english: 'Madrid is the capital and has many castles and museums.' },
        { spanish: 'En Sevilla hay una catedral impresionante en la plaza.', english: 'In Seville there is an impressive cathedral in the square.' },
      ],
    },
  },
  {
    id: 'lesson_57',
    unitId: 'unit_12',
    title: 'Food & Drink Culture',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w255', 'w256', 'w257', 'w258', 'w259'],
    grammarNote: {
      tip: "When expressing general likes or preferences about categories of food or drink, use the definite article: 'Me gusta el vino español' (I like Spanish wine), 'Me encantan las tapas' (I love tapas). 'Gustar' agrees with the thing liked, not the person: 'Me gusta la paella' (singular) vs. 'Me gustan las tapas' (plural).",
      examples: [
        { spanish: 'Me encanta la gastronomía española, especialmente las tapas.', english: 'I love Spanish cuisine, especially tapas.' },
        { spanish: 'El jamón ibérico y la paella son platos típicos de España.', english: 'Iberian ham and paella are typical Spanish dishes.' },
      ],
    },
  },
  {
    id: 'lesson_58',
    unitId: 'unit_12',
    title: 'Arts & Architecture',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w247', 'w254', 'w260', 'w261', 'w262'],
    grammarNote: {
      tip: "The passive voice in Spanish uses 'ser + past participle', and the past participle agrees with the subject: 'El cuadro fue pintado por Goya' (The painting was painted by Goya). The past participle of regular -ar verbs ends in '-ado': pintar → pintado. This construction is common when describing works of art and heritage.",
      examples: [
        { spanish: 'La Alhambra fue declarada Patrimonio de la Humanidad.', english: 'The Alhambra was declared a World Heritage Site.' },
        { spanish: 'Muchas obras de arte fueron pintadas por artistas españoles.', english: 'Many works of art were painted by Spanish artists.' },
      ],
    },
  },
  {
    id: 'lesson_59',
    unitId: 'unit_12',
    title: 'Daily Life in Spain',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w245', 'w246', 'w248', 'w252', 'w264'],
    grammarNote: {
      tip: "'Soler + infinitive' expresses habitual or usual actions — what someone 'usually does': 'Suelo hacer la siesta después de comer' (I usually take a siesta after lunch). It is irregular: suelo, sueles, suele, solemos, soléis, suelen. It is a very elegant alternative to 'normalmente + present tense'.",
      examples: [
        { spanish: 'En España se suele comer tarde, sobre las dos o las tres.', english: 'In Spain people usually eat late, around two or three o\'clock.' },
        { spanish: 'Los pueblos españoles suelen celebrar fiestas en verano.', english: 'Spanish villages usually hold festivals in summer.' },
      ],
    },
  },
  {
    id: 'lesson_60',
    unitId: 'unit_12',
    title: 'Unit 12 Review',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'sentenceBuilder'],
    wordIds: ['w245', 'w247', 'w248', 'w251', 'w253', 'w255', 'w257', 'w259', 'w260', 'w263'],
    lessonType: 'review',
    grammarNote: {
      tip: "Unit 12 Review! Key patterns: impersonal 'se celebra / se come' for customs, 'en + city' for location vs. 'a + city' for movement, 'me gusta el vino / me gustan las tapas' (article + gustar agreement), passive 'fue pintado por', and 'soler + infinitive' for habits. ¡Enhorabuena — has completado el curso!",
      examples: [
        { spanish: 'En España se suele tomar tapas y vino en la plaza.', english: 'In Spain, people usually have tapas and wine in the square.' },
        { spanish: 'La paella y el flamenco son tradiciones conocidas en todo el mundo.', english: 'Paella and flamenco are traditions known throughout the world.' },
      ],
    },
  },

  // ── New lessons: Units 3, 5, 6, 7 expansion ──────────────────────────────
  {
    id: 'lesson_61',
    unitId: 'unit_03',
    title: 'At the Hotel',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w265', 'w266', 'w267', 'w268', 'w269', 'w270'],
    grammarNote: {
      tip: "Use 'quiero' + noun to make requests: 'Quiero una habitación doble.' For needs use 'necesito': 'Necesito una llave.' Ask politely with '¿Tiene...?' — 'Tiene una habitación libre?'",
      examples: [
        { spanish: 'Quiero una habitación doble con baño.', english: 'I would like a double room with a bathroom.' },
        { spanish: 'He perdido la llave de mi habitación.', english: 'I have lost my room key.' },
      ],
    },
  },
  {
    id: 'lesson_62',
    unitId: 'unit_03',
    title: 'Transport & Tickets',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w271', 'w272', 'w273', 'w274', 'w275', 'w276'],
    grammarNote: {
      tip: "Tickets and schedules use 'a las' + time for departures/arrivals: 'La salida es a las diez.' For delays use 'tiene un retraso de': 'El tren tiene un retraso de media hora.'",
      examples: [
        { spanish: 'El tren sale del andén tres a las nueve.', english: 'The train leaves from platform three at nine.' },
        { spanish: 'Tenemos que facturar el equipaje antes de las ocho.', english: 'We have to check in our luggage before eight.' },
      ],
    },
  },
  {
    id: 'lesson_63',
    unitId: 'unit_05',
    title: 'At the Market',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w277', 'w278', 'w279', 'w280', 'w281', 'w282'],
    grammarNote: {
      tip: "Prices and quantities: 'Póngame un kilo de...' (give me a kilo of...). Compare prices with 'más barato/caro que': 'Este es más barato que aquel.' Use 'demasiado' for too expensive/cheap.",
      examples: [
        { spanish: 'Póngame dos kilos de manzanas, por favor.', english: 'Give me two kilos of apples, please.' },
        { spanish: 'Este mercado tiene fruta muy fresca y barata.', english: 'This market has very fresh and cheap fruit.' },
      ],
    },
  },
  {
    id: 'lesson_64',
    unitId: 'unit_05',
    title: 'Clothes & Sizes',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w283', 'w284', 'w285', 'w286', 'w287', 'w288'],
    grammarNote: {
      tip: "Shopping for clothes: '¿Tiene esto en talla...?' (Do you have this in size...?). Use 'probarse' for trying on: '¿Puedo probarme...?' Compliment with 'te queda bien/mal' (it suits you / doesn't suit you).",
      examples: [
        { spanish: '¿Puedo probarme esta camisa en talla mediana?', english: 'Can I try on this shirt in medium size?' },
        { spanish: 'Ese pantalón azul te queda muy bien.', english: 'Those blue trousers suit you very well.' },
      ],
    },
  },
  {
    id: 'lesson_65',
    unitId: 'unit_06',
    title: 'Geography & Landscape',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w289', 'w290', 'w291', 'w292', 'w293', 'w294'],
    grammarNote: {
      tip: "Describe landscape with 'hay' (there is/are): 'Hay montañas en el norte.' Use 'estar rodeado de' (to be surrounded by): 'El lago está rodeado de bosques.' Articles: el río, la montaña, el bosque, la isla.",
      examples: [
        { spanish: 'En España hay playas en el sur y montañas en el norte.', english: 'In Spain there are beaches in the south and mountains in the north.' },
        { spanish: 'La isla está rodeada de un mar cristalino.', english: 'The island is surrounded by a crystal-clear sea.' },
      ],
    },
  },
  {
    id: 'lesson_66',
    unitId: 'unit_06',
    title: 'Animals',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w295', 'w296', 'w297', 'w298', 'w299', 'w300'],
    grammarNote: {
      tip: "Talk about pets with 'tener': 'Tengo un perro.' Describe animals with 'ser': 'El caballo es rápido.' Use 'hay' for animals in nature: 'Hay muchos pájaros en el jardín.'",
      examples: [
        { spanish: 'Tengo un gato y dos peces en casa.', english: 'I have a cat and two fish at home.' },
        { spanish: 'En el campo hay vacas y caballos.', english: 'In the countryside there are cows and horses.' },
      ],
    },
  },
  {
    id: 'lesson_67',
    unitId: 'unit_07',
    title: 'Healthy Habits',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w301', 'w302', 'w303', 'w304', 'w305', 'w306'],
    grammarNote: {
      tip: "Talk about health habits with 'es importante + infinitive': 'Es importante dormir bien.' Use 'demasiado' for excess: 'Tengo demasiado estrés.' Reflexive 'relajarse' — me relajo, te relajas.",
      examples: [
        { spanish: 'Es importante llevar una dieta saludable y hacer ejercicio.', english: 'It is important to follow a healthy diet and exercise.' },
        { spanish: 'Tengo mucho estrés y necesito descansar.', english: 'I have a lot of stress and I need to rest.' },
      ],
    },
  },
  {
    id: 'lesson_68',
    unitId: 'unit_07',
    title: 'At the Pharmacy',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w307', 'w308', 'w309', 'w310', 'w311', 'w312'],
    grammarNote: {
      tip: "At the pharmacy: 'Necesito algo para...' (I need something for...). Describe symptoms with 'tener': 'Tengo tos / alergia / dolor.' Dosage: 'Tómelo tres veces al día' — use 'lo' for masculine nouns.",
      examples: [
        { spanish: 'Necesito algo para la tos y la alergia al polen.', english: 'I need something for my cough and pollen allergy.' },
        { spanish: 'El médico me recetó unas pastillas y un jarabe.', english: 'The doctor prescribed me some tablets and a syrup.' },
      ],
    },
  },

  // ── New lessons: Units 1, 2, 4, 8 expansion ──────────────────────────────
  {
    id: 'lesson_69',
    unitId: 'unit_01',
    title: 'Feelings & Emotions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w313', 'w314', 'w315', 'w316', 'w317', 'w318'],
    grammarNote: {
      tip: "Use 'estar' for temporary feelings: 'Estoy contento/a' (I'm happy right now). Adjectives agree with gender: contento → contenta, nervioso → nerviosa, cansado → cansada. ¿Cómo estás? — ¡Estoy muy bien, gracias!",
      examples: [
        { spanish: 'Estoy muy cansado porque no dormí bien anoche.', english: 'I am very tired because I did not sleep well last night.' },
        { spanish: 'Ella está nerviosa porque tiene un examen mañana.', english: 'She is nervous because she has an exam tomorrow.' },
      ],
    },
  },
  {
    id: 'lesson_70',
    unitId: 'unit_01',
    title: 'Time Expressions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w319', 'w320', 'w321', 'w322', 'w323', 'w324'],
    grammarNote: {
      tip: "Frequency adverbs can go at the start or end of a sentence: 'Siempre desayuno temprano' / 'Desayuno temprano siempre.' 'Nunca' and 'a veces' follow the same pattern. Use 'ahora mismo' to mean 'right now.'",
      examples: [
        { spanish: 'Siempre llego temprano, nunca llego tarde.', english: 'I always arrive early, I never arrive late.' },
        { spanish: 'A veces salimos a cenar, pero ahora preferimos cocinar en casa.', english: 'Sometimes we go out for dinner, but right now we prefer to cook at home.' },
      ],
    },
  },
  {
    id: 'lesson_71',
    unitId: 'unit_02',
    title: 'In the Kitchen',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w325', 'w326', 'w327', 'w328', 'w329', 'w330'],
    grammarNote: {
      tip: "Cooking verbs: 'freír en aceite' (fry in oil), 'hervir en agua' (boil in water), 'meter en el horno' (put in the oven). Note that 'freír' is irregular: fríe/fríen. Temperature: 'a 180 grados' (at 180 degrees).",
      examples: [
        { spanish: 'Hierve el agua y añade la pasta con un poco de sal.', english: 'Boil the water and add the pasta with a pinch of salt.' },
        { spanish: 'Fríe los huevos en la sartén con aceite de oliva.', english: 'Fry the eggs in the frying pan with olive oil.' },
      ],
    },
  },
  {
    id: 'lesson_72',
    unitId: 'unit_02',
    title: 'At the Café',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w331', 'w332', 'w333', 'w334', 'w335', 'w336'],
    grammarNote: {
      tip: "Ordering in a café: 'Quiero / Me pone / Póngame un café.' Asking for the bill: '¿Nos trae la cuenta, por favor?' The waiter is 'el camarero' (m) or 'la camarera' (f). Tips (la propina) are optional in Spain.",
      examples: [
        { spanish: 'Camarero, ¿nos puede traer la cuenta cuando pueda?', english: 'Waiter, could you bring us the bill when you can?' },
        { spanish: 'Voy a pedir un café con leche y un zumo de naranja.', english: 'I am going to order a white coffee and an orange juice.' },
      ],
    },
  },
  {
    id: 'lesson_73',
    unitId: 'unit_04',
    title: 'Personality & Character',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w337', 'w338', 'w339', 'w340', 'w341', 'w342'],
    grammarNote: {
      tip: "Use 'ser' for permanent character traits: 'Es muy amable.' Adjective agreement: amable → amable (same), gracioso → graciosa, tímido → tímida, trabajador → trabajadora. Stack adjectives with 'y': 'Es inteligente y generoso.'",
      examples: [
        { spanish: 'Mi jefe es muy trabajador e inteligente pero también amable.', english: 'My boss is very hard-working and clever, but also kind.' },
        { spanish: 'Al principio era tímida, pero ahora es muy graciosa y generosa.', english: 'At first she was shy, but now she is very funny and generous.' },
      ],
    },
  },
  {
    id: 'lesson_74',
    unitId: 'unit_04',
    title: 'Relationships',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w343', 'w344', 'w345', 'w346', 'w347', 'w348'],
    grammarNote: {
      tip: "Reflexive verbs express mutual actions: 'conocerse' (to meet each other), 'llevarse bien' (to get on well). Conjugate: 'nos conocemos, os conocéis, se conocen.' 'Casarse con' — note the 'con': 'Se casó con María.'",
      examples: [
        { spanish: 'Mis padres se conocieron en la universidad hace treinta años.', english: 'My parents met each other at university thirty years ago.' },
        { spanish: 'Me llevo muy bien con mi novio porque somos muy similares.', english: 'I get along very well with my boyfriend because we are very similar.' },
      ],
    },
  },
  {
    id: 'lesson_75',
    unitId: 'unit_08',
    title: 'Sports & Exercise',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w349', 'w350', 'w351', 'w352', 'w353', 'w354'],
    grammarNote: {
      tip: "'Jugar a' + team sport: 'juego al fútbol.' 'Hacer' + activity: 'hago natación, hago deporte.' Or simply the verb: 'nado, corro.' Win/lose: 'ganar el partido / perder el partido.' ¡Ánimo! (Come on!)",
      examples: [
        { spanish: 'Juego al fútbol los sábados y nado en la piscina entre semana.', english: 'I play football on Saturdays and swim in the pool during the week.' },
        { spanish: 'Corremos en el parque y luego vamos al gimnasio juntos.', english: 'We run in the park and then go to the gym together.' },
      ],
    },
  },
  {
    id: 'lesson_76',
    unitId: 'unit_08',
    title: 'Music & Entertainment',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking', 'sentenceBuilder'],
    wordIds: ['w355', 'w356', 'w357', 'w358', 'w359', 'w360'],
    grammarNote: {
      tip: "'Tocar' = to play an instrument: 'toco la guitarra.' 'Jugar' = to play a game/sport. 'Escuchar música' (listen to music), 'ver una película' (watch a film), 'ir al teatro' (go to the theatre). 'Me encanta + infinitive' for things you love.",
      examples: [
        { spanish: 'Toco el piano y canto en un coro — me encanta la música.', english: 'I play the piano and sing in a choir — I love music.' },
        { spanish: 'El sábado fuimos al concierto y después vimos una película.', english: 'On Saturday we went to the concert and then watched a film.' },
      ],
    },
  },
];

export const UNITS: Unit[] = [
  {
    id: 'unit_01',
    title: 'Greetings & Introductions',
    description: 'Learn how to say hello, introduce yourself, use basic pleasantries, count to 100, and ask key questions.',
    lessonIds: ['lesson_01', 'lesson_02', 'lesson_03', 'lesson_27', 'lesson_69', 'lesson_70', 'lesson_28'],
    icon: '👋',
  },
  {
    id: 'unit_02',
    title: 'Food & Everyday Verbs',
    description: 'Order food, describe meals, and master the most common Spanish verbs including ser vs. estar.',
    lessonIds: ['lesson_04', 'lesson_05', 'lesson_06', 'lesson_07', 'lesson_71', 'lesson_72', 'lesson_30'],
    icon: '🍽️',
  },
  {
    id: 'unit_03',
    title: 'Travel & Directions',
    description: 'Navigate airports, hotels, and streets with confidence — and get around by public transport.',
    lessonIds: ['lesson_08', 'lesson_09', 'lesson_29', 'lesson_61', 'lesson_62', 'lesson_31'],
    icon: '✈️',
  },
  {
    id: 'unit_04',
    title: 'Family & Descriptions',
    description: 'Talk about your family, describe people and things using adjectives, colors, and time expressions.',
    lessonIds: ['lesson_10', 'lesson_11', 'lesson_12', 'lesson_13', 'lesson_73', 'lesson_74', 'lesson_32'],
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'unit_05',
    title: 'Shopping & Money',
    description: 'Buy clothes and goods, ask prices, and handle payments in Spanish.',
    lessonIds: ['lesson_14', 'lesson_15', 'lesson_16', 'lesson_63', 'lesson_64', 'lesson_33'],
    icon: '🛍️',
  },
  {
    id: 'unit_06',
    title: 'Weather & Nature',
    description: 'Talk about the weather, seasons, and the natural world around you.',
    lessonIds: ['lesson_17', 'lesson_18', 'lesson_19', 'lesson_65', 'lesson_66', 'lesson_34'],
    icon: '☀️',
  },
  {
    id: 'unit_07',
    title: 'Health & Body',
    description: 'Describe body parts, talk about illness, and handle a visit to the doctor or pharmacy.',
    lessonIds: ['lesson_20', 'lesson_21', 'lesson_22', 'lesson_67', 'lesson_68', 'lesson_35'],
    icon: '💊',
  },
  {
    id: 'unit_08',
    title: 'Hobbies & Free Time',
    description: 'Chat about sports, music, reading, and what you enjoy doing at the weekend.',
    lessonIds: ['lesson_23', 'lesson_24', 'lesson_25', 'lesson_26', 'lesson_75', 'lesson_76', 'lesson_36'],
    icon: '🎯',
  },
  {
    id: 'unit_09',
    title: 'Work & Professions',
    description: 'Talk about jobs, the workplace, meetings, and career — everything you need for professional life in Spanish.',
    lessonIds: ['lesson_37', 'lesson_38', 'lesson_39', 'lesson_40', 'lesson_41', 'lesson_42'],
    icon: '💼',
  },
  {
    id: 'unit_10',
    title: 'Home & Daily Routine',
    description: 'Name the rooms of your home, describe furniture, and talk through your daily routine from morning to night.',
    lessonIds: ['lesson_43', 'lesson_44', 'lesson_45', 'lesson_46', 'lesson_47', 'lesson_48'],
    icon: '🏠',
  },
  {
    id: 'unit_11',
    title: 'Emotions & Opinions',
    description: 'Express how you feel, share your opinions, agree and disagree — the language of real conversation.',
    lessonIds: ['lesson_49', 'lesson_50', 'lesson_51', 'lesson_52', 'lesson_53', 'lesson_54'],
    icon: '💬',
  },
  {
    id: 'unit_12',
    title: 'Spanish Culture & Life',
    description: 'Explore festivals, food, art, architecture, and the rhythms of everyday life in Spain.',
    lessonIds: ['lesson_55', 'lesson_56', 'lesson_57', 'lesson_58', 'lesson_59', 'lesson_60'],
    icon: '🇪🇸',
  },
];

export const UNITS_BY_ID: Record<string, Unit> = Object.fromEntries(
  UNITS.map((u) => [u.id, u])
);

export const LESSONS_BY_ID: Record<string, Lesson> = Object.fromEntries(
  LESSONS.map((l) => [l.id, l])
);

export function isUnitUnlocked(unitId: string, completedLessons: string[]): boolean {
  const unitIndex = UNITS.findIndex((u) => u.id === unitId);
  if (unitIndex === 0) return true;
  const previousUnit = UNITS[unitIndex - 1];
  return previousUnit.lessonIds.every((id) => completedLessons.includes(id));
}

export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const lesson = LESSONS_BY_ID[lessonId];
  if (!lesson) return false;
  const unit = UNITS_BY_ID[lesson.unitId];
  if (!unit) return false;
  const lessonIndex = unit.lessonIds.indexOf(lessonId);
  if (lessonIndex === 0) return isUnitUnlocked(unit.id, completedLessons);
  return completedLessons.includes(unit.lessonIds[lessonIndex - 1]);
}
