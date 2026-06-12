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
];

export const UNITS: Unit[] = [
  {
    id: 'unit_01',
    title: 'Greetings & Introductions',
    description: 'Learn how to say hello, introduce yourself, use basic pleasantries, count to 100, and ask key questions.',
    lessonIds: ['lesson_01', 'lesson_02', 'lesson_03', 'lesson_27', 'lesson_28'],
    icon: '👋',
  },
  {
    id: 'unit_02',
    title: 'Food & Everyday Verbs',
    description: 'Order food, describe meals, and master the most common Spanish verbs including ser vs. estar.',
    lessonIds: ['lesson_04', 'lesson_05', 'lesson_06', 'lesson_07', 'lesson_30'],
    icon: '🍽️',
  },
  {
    id: 'unit_03',
    title: 'Travel & Directions',
    description: 'Navigate airports, hotels, and streets with confidence — and get around by public transport.',
    lessonIds: ['lesson_08', 'lesson_09', 'lesson_29', 'lesson_31'],
    icon: '✈️',
  },
  {
    id: 'unit_04',
    title: 'Family & Descriptions',
    description: 'Talk about your family, describe people and things using adjectives, colors, and time expressions.',
    lessonIds: ['lesson_10', 'lesson_11', 'lesson_12', 'lesson_13', 'lesson_32'],
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'unit_05',
    title: 'Shopping & Money',
    description: 'Buy clothes and goods, ask prices, and handle payments in Spanish.',
    lessonIds: ['lesson_14', 'lesson_15', 'lesson_16', 'lesson_33'],
    icon: '🛍️',
  },
  {
    id: 'unit_06',
    title: 'Weather & Nature',
    description: 'Talk about the weather, seasons, and the natural world around you.',
    lessonIds: ['lesson_17', 'lesson_18', 'lesson_19', 'lesson_34'],
    icon: '☀️',
  },
  {
    id: 'unit_07',
    title: 'Health & Body',
    description: 'Describe body parts, talk about illness, and handle a visit to the doctor or pharmacy.',
    lessonIds: ['lesson_20', 'lesson_21', 'lesson_22', 'lesson_35'],
    icon: '💊',
  },
  {
    id: 'unit_08',
    title: 'Hobbies & Free Time',
    description: 'Chat about sports, music, reading, and what you enjoy doing at the weekend.',
    lessonIds: ['lesson_23', 'lesson_24', 'lesson_25', 'lesson_26', 'lesson_36'],
    icon: '🎯',
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
