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
];

export const SENTENCES_BY_LESSON: Record<string, Sentence[]> = SENTENCES.reduce(
  (acc, s) => {
    if (!acc[s.lessonId]) acc[s.lessonId] = [];
    acc[s.lessonId].push(s);
    return acc;
  },
  {} as Record<string, Sentence[]>
);
