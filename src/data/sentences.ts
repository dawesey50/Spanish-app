import type { Sentence } from '../types';

export const SENTENCES: Sentence[] = [
  // Unit 1 — Greetings & Introductions
  {
    id: 'sn001', lessonId: 'lesson_01',
    english: 'Good morning, how are you?',
    spanish: 'Buenos días, ¿cómo estás?',
    tokens: ['Buenos', 'días,', '¿cómo', 'estás?'],
    distractors: ['adiós', 'gracias', 'hola'],
  },
  {
    id: 'sn002', lessonId: 'lesson_02',
    english: 'My name is Carlos.',
    spanish: 'Me llamo Carlos.',
    tokens: ['Me', 'llamo', 'Carlos.'],
    distractors: ['soy', 'mucho', 'gusto', 'te'],
  },
  {
    id: 'sn003', lessonId: 'lesson_03',
    english: 'I have two brothers.',
    spanish: 'Tengo dos hermanos.',
    tokens: ['Tengo', 'dos', 'hermanos.'],
    distractors: ['tres', 'uno', 'veinte', 'hijos'],
  },

  // Unit 2 — Food & Everyday Verbs
  {
    id: 'sn004', lessonId: 'lesson_04',
    english: 'I would like a coffee, please.',
    spanish: 'Quisiera un café, por favor.',
    tokens: ['Quisiera', 'un', 'café,', 'por', 'favor.'],
    distractors: ['agua', 'leche', 'quiero', 'pan'],
  },
  {
    id: 'sn005', lessonId: 'lesson_05',
    english: 'The food is on the table.',
    spanish: 'La comida está en la mesa.',
    tokens: ['La', 'comida', 'está', 'en', 'la', 'mesa.'],
    distractors: ['pan', 'arroz', 'el', 'es'],
  },
  {
    id: 'sn006', lessonId: 'lesson_06',
    english: 'Can you help me?',
    spanish: '¿Puedes ayudarme?',
    tokens: ['¿Puedes', 'ayudarme?'],
    distractors: ['quiero', 'tengo', 'puedo', 'saber'],
  },
  {
    id: 'sn007', lessonId: 'lesson_07',
    english: 'I speak a little Spanish.',
    spanish: 'Hablo un poco de español.',
    tokens: ['Hablo', 'un', 'poco', 'de', 'español.'],
    distractors: ['como', 'bebo', 'entiendo', 'mucho'],
  },

  // Unit 3 — Travel & Directions
  {
    id: 'sn008', lessonId: 'lesson_08',
    english: 'I need a ticket.',
    spanish: 'Necesito un billete.',
    tokens: ['Necesito', 'un', 'billete.'],
    distractors: ['hotel', 'vuelo', 'la', 'quiero'],
  },
  {
    id: 'sn009', lessonId: 'lesson_09',
    english: 'Turn right and go straight ahead.',
    spanish: 'Gira a la derecha y sigue recto.',
    tokens: ['Gira', 'a', 'la', 'derecha', 'y', 'sigue', 'recto.'],
    distractors: ['izquierda', 'cerca', 'lejos', 'el'],
  },

  // Unit 4 — Family & Descriptions
  {
    id: 'sn010', lessonId: 'lesson_10',
    english: 'My mother cooks very well.',
    spanish: 'Mi madre cocina muy bien.',
    tokens: ['Mi', 'madre', 'cocina', 'muy', 'bien.'],
    distractors: ['padre', 'hermano', 'come', 'malo'],
  },
  {
    id: 'sn011', lessonId: 'lesson_11',
    english: 'The elephant is very big.',
    spanish: 'El elefante es muy grande.',
    tokens: ['El', 'elefante', 'es', 'muy', 'grande.'],
    distractors: ['pequeño', 'bueno', 'nuevo', 'malo'],
  },
  {
    id: 'sn012', lessonId: 'lesson_12',
    english: 'The sky is blue.',
    spanish: 'El cielo es azul.',
    tokens: ['El', 'cielo', 'es', 'azul.'],
    distractors: ['rojo', 'verde', 'amarillo', 'mar'],
  },
  {
    id: 'sn013', lessonId: 'lesson_13',
    english: 'Today is Monday.',
    spanish: 'Hoy es lunes.',
    tokens: ['Hoy', 'es', 'lunes.'],
    distractors: ['mañana', 'ayer', 'siempre', 'tarde'],
  },

  // Unit 5 — Shopping & Money
  {
    id: 'sn014', lessonId: 'lesson_14',
    english: 'I need new clothes.',
    spanish: 'Necesito ropa nueva.',
    tokens: ['Necesito', 'ropa', 'nueva.'],
    distractors: ['cara', 'barata', 'tienda', 'precio'],
  },
  {
    id: 'sn015', lessonId: 'lesson_15',
    english: 'How much does this coat cost?',
    spanish: '¿Cuánto cuesta este abrigo?',
    tokens: ['¿Cuánto', 'cuesta', 'este', 'abrigo?'],
    distractors: ['pagar', 'tarjeta', 'precio', 'bolsa'],
  },
  {
    id: 'sn016', lessonId: 'lesson_16',
    english: 'Do you have this in size medium?',
    spanish: '¿Tienes esto en talla mediana?',
    tokens: ['¿Tienes', 'esto', 'en', 'talla', 'mediana?'],
    distractors: ['camisa', 'zapatos', 'pequeña', 'grande'],
  },

  // Unit 6 — Weather & Nature
  {
    id: 'sn017', lessonId: 'lesson_17',
    english: "It's very hot today.",
    spanish: 'Hace mucho calor hoy.',
    tokens: ['Hace', 'mucho', 'calor', 'hoy.'],
    distractors: ['frío', 'lluvia', 'viento', 'nieve'],
  },
  {
    id: 'sn018', lessonId: 'lesson_18',
    english: 'In summer we go to the beach.',
    spanish: 'En verano vamos a la playa.',
    tokens: ['En', 'verano', 'vamos', 'a', 'la', 'playa.'],
    distractors: ['invierno', 'otoño', 'montaña', 'el'],
  },
  {
    id: 'sn019', lessonId: 'lesson_19',
    english: 'The children play in the park.',
    spanish: 'Los niños juegan en el parque.',
    tokens: ['Los', 'niños', 'juegan', 'en', 'el', 'parque.'],
    distractors: ['bosque', 'mar', 'río', 'la'],
  },

  // Unit 7 — Health & Body
  {
    id: 'sn020', lessonId: 'lesson_20',
    english: 'My head hurts.',
    spanish: 'Me duele la cabeza.',
    tokens: ['Me', 'duele', 'la', 'cabeza.'],
    distractors: ['brazo', 'pierna', 'mano', 'el'],
  },
  {
    id: 'sn021', lessonId: 'lesson_21',
    english: 'I need to see a doctor.',
    spanish: 'Necesito ver a un médico.',
    tokens: ['Necesito', 'ver', 'a', 'un', 'médico.'],
    distractors: ['farmacia', 'hospital', 'dolor', 'quiero'],
  },
  {
    id: 'sn022', lessonId: 'lesson_22',
    english: 'I have an appointment tomorrow.',
    spanish: 'Tengo una cita mañana.',
    tokens: ['Tengo', 'una', 'cita', 'mañana.'],
    distractors: ['receta', 'alergia', 'hoy', 'ayer'],
  },

  // Unit 8 — Hobbies & Free Time
  {
    id: 'sn023', lessonId: 'lesson_23',
    english: 'I like to swim in the sea.',
    spanish: 'Me gusta nadar en el mar.',
    tokens: ['Me', 'gusta', 'nadar', 'en', 'el', 'mar.'],
    distractors: ['correr', 'fútbol', 'tenis', 'la'],
  },
  {
    id: 'sn024', lessonId: 'lesson_24',
    english: 'I like to listen to music.',
    spanish: 'Me gusta escuchar música.',
    tokens: ['Me', 'gusta', 'escuchar', 'música.'],
    distractors: ['bailar', 'tocar', 'canción', 'ver'],
  },
  {
    id: 'sn025', lessonId: 'lesson_25',
    english: 'I like to read novels in Spanish.',
    spanish: 'Me gusta leer novelas en español.',
    tokens: ['Me', 'gusta', 'leer', 'novelas', 'en', 'español.'],
    distractors: ['estudiar', 'libro', 'biblioteca', 'ver'],
  },
  {
    id: 'sn026', lessonId: 'lesson_26',
    english: 'We go out with friends on Fridays.',
    spanish: 'Salimos con amigos los viernes.',
    tokens: ['Salimos', 'con', 'amigos', 'los', 'viernes.'],
    distractors: ['cine', 'teatro', 'película', 'el'],
  },

  // Lesson 27 — Asking Questions (Unit 1)
  {
    id: 'sn027', lessonId: 'lesson_27',
    english: 'Where is the train station?',
    spanish: '¿Dónde está la estación de tren?',
    tokens: ['¿Dónde', 'está', 'la', 'estación', 'de', 'tren?'],
    distractors: ['qué', 'cuándo', 'quién', 'hay'],
  },
  {
    id: 'sn028', lessonId: 'lesson_27',
    english: 'Why do you study Spanish?',
    spanish: '¿Por qué estudias español?',
    tokens: ['¿Por', 'qué', 'estudias', 'español?'],
    distractors: ['cómo', 'cuánto', 'hablas', 'dónde'],
  },

  // Lesson 28 — Unit 1 Review
  {
    id: 'sn029', lessonId: 'lesson_28',
    english: 'Good afternoon, what is your name?',
    spanish: 'Buenas tardes, ¿cómo te llamas?',
    tokens: ['Buenas', 'tardes,', '¿cómo', 'te', 'llamas?'],
    distractors: ['días', 'noches', 'mucho', 'gracias'],
  },

  // Lesson 29 — Transport (Unit 3)
  {
    id: 'sn030', lessonId: 'lesson_29',
    english: 'I go to work by metro every day.',
    spanish: 'Voy al trabajo en metro cada día.',
    tokens: ['Voy', 'al', 'trabajo', 'en', 'metro', 'cada', 'día.'],
    distractors: ['tren', 'autobús', 'coche', 'taxi'],
  },
  {
    id: 'sn031', lessonId: 'lesson_29',
    english: 'Shall we take a taxi?',
    spanish: '¿Tomamos un taxi?',
    tokens: ['¿Tomamos', 'un', 'taxi?'],
    distractors: ['metro', 'coche', 'bicicleta', 'autobús'],
  },

  // Lesson 30 — Unit 2 Review
  {
    id: 'sn032', lessonId: 'lesson_30',
    english: 'I eat rice and drink water every day.',
    spanish: 'Como arroz y bebo agua todos los días.',
    tokens: ['Como', 'arroz', 'y', 'bebo', 'agua', 'todos', 'los', 'días.'],
    distractors: ['café', 'leche', 'como', 'pan'],
  },

  // Lesson 31 — Unit 3 Review
  {
    id: 'sn033', lessonId: 'lesson_31',
    english: 'Take the train and get off at the second stop.',
    spanish: 'Coge el tren y baja en la segunda parada.',
    tokens: ['Coge', 'el', 'tren', 'y', 'baja', 'en', 'la', 'segunda', 'parada.'],
    distractors: ['autobús', 'metro', 'sube', 'primera'],
  },

  // Lesson 32 — Unit 4 Review
  {
    id: 'sn034', lessonId: 'lesson_32',
    english: 'My older sister has blue eyes.',
    spanish: 'Mi hermana mayor tiene los ojos azules.',
    tokens: ['Mi', 'hermana', 'mayor', 'tiene', 'los', 'ojos', 'azules.'],
    distractors: ['hermano', 'verdes', 'rojos', 'pequeño'],
  },

  // Lesson 33 — Unit 5 Review
  {
    id: 'sn035', lessonId: 'lesson_33',
    english: 'I would like to pay by card, please.',
    spanish: 'Quisiera pagar con tarjeta, por favor.',
    tokens: ['Quisiera', 'pagar', 'con', 'tarjeta,', 'por', 'favor.'],
    distractors: ['efectivo', 'precio', 'cambio', 'quiero'],
  },

  // Lesson 34 — Unit 6 Review
  {
    id: 'sn036', lessonId: 'lesson_34',
    english: 'In spring the weather is nice.',
    spanish: 'En primavera hace buen tiempo.',
    tokens: ['En', 'primavera', 'hace', 'buen', 'tiempo.'],
    distractors: ['verano', 'frío', 'llueve', 'invierno'],
  },

  // Lesson 35 — Unit 7 Review
  {
    id: 'sn037', lessonId: 'lesson_35',
    english: 'My feet hurt and I have a fever.',
    spanish: 'Me duelen los pies y tengo fiebre.',
    tokens: ['Me', 'duelen', 'los', 'pies', 'y', 'tengo', 'fiebre.'],
    distractors: ['duele', 'brazos', 'tos', 'dolor'],
  },

  // Lesson 36 — Unit 8 Review
  {
    id: 'sn038', lessonId: 'lesson_36',
    english: 'I play guitar and I like reading.',
    spanish: 'Toco la guitarra y me gusta leer.',
    tokens: ['Toco', 'la', 'guitarra', 'y', 'me', 'gusta', 'leer.'],
    distractors: ['piano', 'escuchar', 'bailar', 'estudiar'],
  },
];

export const SENTENCES_BY_LESSON: Record<string, Sentence[]> = SENTENCES.reduce(
  (acc, s) => {
    if (!acc[s.lessonId]) acc[s.lessonId] = [];
    acc[s.lessonId].push(s);
    return acc;
  },
  {} as Record<string, Sentence[]>
);
