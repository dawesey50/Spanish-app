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

  // Unit 9 — Work & Professions
  {
    id: 'sn039', lessonId: 'lesson_37',
    english: 'My brother is an engineer and works a lot.',
    spanish: 'Mi hermano es ingeniero y trabaja mucho.',
    tokens: ['Mi', 'hermano', 'es', 'ingeniero', 'y', 'trabaja', 'mucho.'],
    distractors: ['médico', 'profesor', 'come', 'poco'],
  },
  {
    id: 'sn040', lessonId: 'lesson_38',
    english: 'The meeting is in the office at nine.',
    spanish: 'La reunión es en la oficina a las nueve.',
    tokens: ['La', 'reunión', 'es', 'en', 'la', 'oficina', 'a', 'las', 'nueve.'],
    distractors: ['casa', 'jefe', 'trabajo', 'diez'],
  },
  {
    id: 'sn041', lessonId: 'lesson_39',
    english: 'I have to send an email to my boss.',
    spanish: 'Tengo que enviar un correo a mi jefe.',
    tokens: ['Tengo', 'que', 'enviar', 'un', 'correo', 'a', 'mi', 'jefe.'],
    distractors: ['recibir', 'carta', 'mensaje', 'tu'],
  },
  {
    id: 'sn042', lessonId: 'lesson_40',
    english: 'I will call you on the phone this afternoon.',
    spanish: 'Te llamo por teléfono esta tarde.',
    tokens: ['Te', 'llamo', 'por', 'teléfono', 'esta', 'tarde.'],
    distractors: ['correo', 'mañana', 'noche', 'escribo'],
  },
  {
    id: 'sn043', lessonId: 'lesson_41',
    english: 'She wants to find a new job.',
    spanish: 'Ella quiere encontrar un trabajo nuevo.',
    tokens: ['Ella', 'quiere', 'encontrar', 'un', 'trabajo', 'nuevo.'],
    distractors: ['viejo', 'dejar', 'jefe', 'sueldo'],
  },
  {
    id: 'sn044', lessonId: 'lesson_42',
    english: 'On Monday I have a job interview.',
    spanish: 'El lunes tengo una entrevista de trabajo.',
    tokens: ['El', 'lunes', 'tengo', 'una', 'entrevista', 'de', 'trabajo.'],
    distractors: ['martes', 'reunión', 'oficina', 'jefe'],
  },

  // Unit 10 — Home & Daily Routine
  {
    id: 'sn045', lessonId: 'lesson_43',
    english: 'The kitchen is next to the living room.',
    spanish: 'La cocina está al lado del salón.',
    tokens: ['La', 'cocina', 'está', 'al', 'lado', 'del', 'salón.'],
    distractors: ['baño', 'dormitorio', 'cerca', 'jardín'],
  },
  {
    id: 'sn046', lessonId: 'lesson_44',
    english: 'There is a lamp on the table.',
    spanish: 'Hay una lámpara encima de la mesa.',
    tokens: ['Hay', 'una', 'lámpara', 'encima', 'de', 'la', 'mesa.'],
    distractors: ['silla', 'cama', 'debajo', 'sofá'],
  },
  {
    id: 'sn047', lessonId: 'lesson_45',
    english: 'I shower and have breakfast before leaving.',
    spanish: 'Me ducho y desayuno antes de salir.',
    tokens: ['Me', 'ducho', 'y', 'desayuno', 'antes', 'de', 'salir.'],
    distractors: ['después', 'ceno', 'levanto', 'dormir'],
  },
  {
    id: 'sn048', lessonId: 'lesson_46',
    english: 'I have to wash the dishes today.',
    spanish: 'Tengo que lavar los platos hoy.',
    tokens: ['Tengo', 'que', 'lavar', 'los', 'platos', 'hoy.'],
    distractors: ['limpiar', 'ropa', 'mañana', 'planchar'],
  },
  {
    id: 'sn049', lessonId: 'lesson_47',
    english: 'The flat has two bedrooms and a balcony.',
    spanish: 'El piso tiene dos habitaciones y un balcón.',
    tokens: ['El', 'piso', 'tiene', 'dos', 'habitaciones', 'y', 'un', 'balcón.'],
    distractors: ['casa', 'tres', 'jardín', 'garaje'],
  },
  {
    id: 'sn050', lessonId: 'lesson_48',
    english: 'I clean my room every Saturday.',
    spanish: 'Limpio mi habitación todos los sábados.',
    tokens: ['Limpio', 'mi', 'habitación', 'todos', 'los', 'sábados.'],
    distractors: ['cocina', 'lavo', 'domingos', 'nunca'],
  },

  // Unit 11 — Emotions & Opinions
  {
    id: 'sn051', lessonId: 'lesson_49',
    english: 'I am very happy to see you.',
    spanish: 'Estoy muy feliz de verte.',
    tokens: ['Estoy', 'muy', 'feliz', 'de', 'verte.'],
    distractors: ['triste', 'cansado', 'soy', 'enfadado'],
  },
  {
    id: 'sn052', lessonId: 'lesson_50',
    english: 'He is worried about the exam.',
    spanish: 'Está preocupado por el examen.',
    tokens: ['Está', 'preocupado', 'por', 'el', 'examen.'],
    distractors: ['contento', 'nervioso', 'trabajo', 'la'],
  },
  {
    id: 'sn053', lessonId: 'lesson_51',
    english: 'I think you are right.',
    spanish: 'Creo que tienes razón.',
    tokens: ['Creo', 'que', 'tienes', 'razón.'],
    distractors: ['pienso', 'miedo', 'opinión', 'no'],
  },
  {
    id: 'sn054', lessonId: 'lesson_52',
    english: 'I do not agree with you.',
    spanish: 'No estoy de acuerdo contigo.',
    tokens: ['No', 'estoy', 'de', 'acuerdo', 'contigo.'],
    distractors: ['conmigo', 'razón', 'sí', 'claro'],
  },
  {
    id: 'sn055', lessonId: 'lesson_53',
    english: 'I am afraid of the dark.',
    spanish: 'Tengo miedo de la oscuridad.',
    tokens: ['Tengo', 'miedo', 'de', 'la', 'oscuridad.'],
    distractors: ['amor', 'luz', 'el', 'ganas'],
  },
  {
    id: 'sn056', lessonId: 'lesson_54',
    english: 'I am very glad about your success.',
    spanish: 'Me alegro mucho de tu éxito.',
    tokens: ['Me', 'alegro', 'mucho', 'de', 'tu', 'éxito.'],
    distractors: ['preocupo', 'poco', 'mi', 'fracaso'],
  },

  // Unit 12 — Spanish Culture & Life
  {
    id: 'sn057', lessonId: 'lesson_55',
    english: 'The festival starts tonight in the square.',
    spanish: 'La fiesta empieza esta noche en la plaza.',
    tokens: ['La', 'fiesta', 'empieza', 'esta', 'noche', 'en', 'la', 'plaza.'],
    distractors: ['termina', 'mañana', 'calle', 'iglesia'],
  },
  {
    id: 'sn058', lessonId: 'lesson_56',
    english: 'Madrid is the capital of Spain.',
    spanish: 'Madrid es la capital de España.',
    tokens: ['Madrid', 'es', 'la', 'capital', 'de', 'España.'],
    distractors: ['Barcelona', 'ciudad', 'pueblo', 'está'],
  },
  {
    id: 'sn059', lessonId: 'lesson_57',
    english: 'We go out for tapas with friends.',
    spanish: 'Salimos a tomar tapas con los amigos.',
    tokens: ['Salimos', 'a', 'tomar', 'tapas', 'con', 'los', 'amigos.'],
    distractors: ['vino', 'paella', 'comer', 'familia'],
  },
  {
    id: 'sn060', lessonId: 'lesson_58',
    english: 'The cathedral is very old and beautiful.',
    spanish: 'La catedral es muy antigua y bonita.',
    tokens: ['La', 'catedral', 'es', 'muy', 'antigua', 'y', 'bonita.'],
    distractors: ['castillo', 'nueva', 'fea', 'museo'],
  },
  {
    id: 'sn061', lessonId: 'lesson_59',
    english: 'In Spain people have dinner very late.',
    spanish: 'En España la gente cena muy tarde.',
    tokens: ['En', 'España', 'la', 'gente', 'cena', 'muy', 'tarde.'],
    distractors: ['temprano', 'desayuna', 'come', 'siesta'],
  },
  {
    id: 'sn062', lessonId: 'lesson_60',
    english: 'Flamenco is the traditional dance of Andalusia.',
    spanish: 'El flamenco es el baile tradicional de Andalucía.',
    tokens: ['El', 'flamenco', 'es', 'el', 'baile', 'tradicional', 'de', 'Andalucía.'],
    distractors: ['moderno', 'música', 'España', 'la'],
  },

  // Lessons 61-62 — Unit 3 expansion
  {
    id: 'sn063', lessonId: 'lesson_61',
    english: 'I have a reservation for two nights.',
    spanish: 'Tengo una reserva para dos noches.',
    tokens: ['Tengo', 'una', 'reserva', 'para', 'dos', 'noches.'],
    distractors: ['habitación', 'llave', 'tres', 'días'],
  },
  {
    id: 'sn064', lessonId: 'lesson_62',
    english: 'The train leaves from platform three.',
    spanish: 'El tren sale del andén número tres.',
    tokens: ['El', 'tren', 'sale', 'del', 'andén', 'número', 'tres.'],
    distractors: ['llega', 'billete', 'autobús', 'cuatro'],
  },

  // Lessons 63-64 — Unit 5 expansion
  {
    id: 'sn065', lessonId: 'lesson_63',
    english: 'Give me a kilo of tomatoes, please.',
    spanish: 'Póngame un kilo de tomates, por favor.',
    tokens: ['Póngame', 'un', 'kilo', 'de', 'tomates,', 'por', 'favor.'],
    distractors: ['manzanas', 'bolsa', 'dos', 'mercado'],
  },
  {
    id: 'sn066', lessonId: 'lesson_64',
    english: 'Can I try on this shirt?',
    spanish: '¿Puedo probarme esta camisa?',
    tokens: ['¿Puedo', 'probarme', 'esta', 'camisa?'],
    distractors: ['talla', 'pantalón', 'comprar', 'ese'],
  },

  // Lessons 65-66 — Unit 6 expansion
  {
    id: 'sn067', lessonId: 'lesson_65',
    english: 'The river runs through the forest.',
    spanish: 'El río pasa por el bosque.',
    tokens: ['El', 'río', 'pasa', 'por', 'el', 'bosque.'],
    distractors: ['lago', 'montaña', 'playa', 'la'],
  },
  {
    id: 'sn068', lessonId: 'lesson_66',
    english: 'My dog plays with the cat.',
    spanish: 'Mi perro juega con el gato.',
    tokens: ['Mi', 'perro', 'juega', 'con', 'el', 'gato.'],
    distractors: ['pájaro', 'caballo', 'duerme', 'la'],
  },

  // Lessons 67-68 — Unit 7 expansion
  {
    id: 'sn069', lessonId: 'lesson_67',
    english: 'It is important to sleep eight hours.',
    spanish: 'Es importante dormir ocho horas.',
    tokens: ['Es', 'importante', 'dormir', 'ocho', 'horas.'],
    distractors: ['descansar', 'comer', 'nueve', 'días'],
  },
  {
    id: 'sn070', lessonId: 'lesson_68',
    english: 'I need something for my allergy.',
    spanish: 'Necesito algo para la alergia.',
    tokens: ['Necesito', 'algo', 'para', 'la', 'alergia.'],
    distractors: ['pastilla', 'jarabe', 'fiebre', 'el'],
  },

  // Lessons 69-70 — Unit 1 expansion
  {
    id: 'sn071', lessonId: 'lesson_69',
    english: 'I am tired after work.',
    spanish: 'Estoy cansado después del trabajo.',
    tokens: ['Estoy', 'cansado', 'después', 'del', 'trabajo.'],
    distractors: ['contento', 'antes', 'triste', 'soy'],
  },
  {
    id: 'sn072', lessonId: 'lesson_70',
    english: 'I always arrive early to class.',
    spanish: 'Siempre llego temprano a clase.',
    tokens: ['Siempre', 'llego', 'temprano', 'a', 'clase.'],
    distractors: ['nunca', 'tarde', 'ahora', 'salgo'],
  },

  // Lessons 71-72 — Unit 2 expansion
  {
    id: 'sn073', lessonId: 'lesson_71',
    english: 'Boil the water and add the pasta.',
    spanish: 'Hierve el agua y añade la pasta.',
    tokens: ['Hierve', 'el', 'agua', 'y', 'añade', 'la', 'pasta.'],
    distractors: ['fríe', 'horno', 'sartén', 'arroz'],
  },
  {
    id: 'sn074', lessonId: 'lesson_72',
    english: 'A white coffee and the bill, please.',
    spanish: 'Un café con leche y la cuenta, por favor.',
    tokens: ['Un', 'café', 'con', 'leche', 'y', 'la', 'cuenta,', 'por', 'favor.'],
    distractors: ['zumo', 'propina', 'camarero', 'sin'],
  },

  // Lessons 73-74 — Unit 4 expansion
  {
    id: 'sn075', lessonId: 'lesson_73',
    english: 'My friend is funny and kind.',
    spanish: 'Mi amigo es gracioso y amable.',
    tokens: ['Mi', 'amigo', 'es', 'gracioso', 'y', 'amable.'],
    distractors: ['tímido', 'serio', 'está', 'generosa'],
  },
  {
    id: 'sn076', lessonId: 'lesson_74',
    english: 'We met at university.',
    spanish: 'Nos conocimos en la universidad.',
    tokens: ['Nos', 'conocimos', 'en', 'la', 'universidad.'],
    distractors: ['casamos', 'fiesta', 'el', 'trabajo'],
  },

  // Lessons 75-76 — Unit 8 expansion
  {
    id: 'sn077', lessonId: 'lesson_75',
    english: 'I play football on Saturdays.',
    spanish: 'Juego al fútbol los sábados.',
    tokens: ['Juego', 'al', 'fútbol', 'los', 'sábados.'],
    distractors: ['tenis', 'nado', 'domingos', 'corro'],
  },
  {
    id: 'sn078', lessonId: 'lesson_76',
    english: 'I have played the guitar since I was a child.',
    spanish: 'Toco la guitarra desde niño.',
    tokens: ['Toco', 'la', 'guitarra', 'desde', 'niño.'],
    distractors: ['piano', 'canto', 'hasta', 'el'],
  },

  // Lesson 77 — Unit 1 expansion
  {
    id: 'sn079', lessonId: 'lesson_77',
    english: 'There are more than a hundred people here.',
    spanish: 'Hay más de cien personas aquí.',
    tokens: ['Hay', 'más', 'de', 'cien', 'personas', 'aquí.'],
    distractors: ['menos', 'mil', 'allí', 'número'],
  },

  // Lesson 78 — Unit 2 expansion
  {
    id: 'sn080', lessonId: 'lesson_78',
    english: 'I buy fresh bread at the bakery.',
    spanish: 'Compro pan fresco en la panadería.',
    tokens: ['Compro', 'pan', 'fresco', 'en', 'la', 'panadería.'],
    distractors: ['carne', 'congelado', 'supermercado', 'vendo'],
  },

  // Lessons 79-80 — Unit 3 expansion
  {
    id: 'sn081', lessonId: 'lesson_79',
    english: 'Turn right at the traffic light.',
    spanish: 'Gire a la derecha en el semáforo.',
    tokens: ['Gire', 'a', 'la', 'derecha', 'en', 'el', 'semáforo.'],
    distractors: ['izquierda', 'cruce', 'recto', 'siga'],
  },
  {
    id: 'sn082', lessonId: 'lesson_80',
    english: 'Entry to the museum is free today.',
    spanish: 'La entrada al museo es gratuita hoy.',
    tokens: ['La', 'entrada', 'al', 'museo', 'es', 'gratuita', 'hoy.'],
    distractors: ['visita', 'cara', 'mañana', 'horario'],
  },

  // Lesson 81 — Unit 4 expansion
  {
    id: 'sn083', lessonId: 'lesson_81',
    english: 'She has blonde hair and green eyes.',
    spanish: 'Tiene el pelo rubio y los ojos verdes.',
    tokens: ['Tiene', 'el', 'pelo', 'rubio', 'y', 'los', 'ojos', 'verdes.'],
    distractors: ['moreno', 'azules', 'alta', 'la'],
  },

  // Lessons 82-83 — Unit 5 expansion
  {
    id: 'sn084', lessonId: 'lesson_82',
    english: 'The sales start in January.',
    spanish: 'Las rebajas empiezan en enero.',
    tokens: ['Las', 'rebajas', 'empiezan', 'en', 'enero.'],
    distractors: ['terminan', 'descuento', 'verano', 'moda'],
  },
  {
    id: 'sn085', lessonId: 'lesson_83',
    english: 'Can I pay by card?',
    spanish: '¿Puedo pagar con tarjeta?',
    tokens: ['¿Puedo', 'pagar', 'con', 'tarjeta?'],
    distractors: ['efectivo', 'recibo', 'cambio', 'cobrar'],
  },

  // Lessons 84-85 — Unit 6 expansion
  {
    id: 'sn086', lessonId: 'lesson_84',
    english: 'There is a lot of fog this morning.',
    spanish: 'Hay mucha niebla esta mañana.',
    tokens: ['Hay', 'mucha', 'niebla', 'esta', 'mañana.'],
    distractors: ['tormenta', 'granizo', 'tarde', 'poca'],
  },
  {
    id: 'sn087', lessonId: 'lesson_85',
    english: 'We must recycle the rubbish.',
    spanish: 'Hay que reciclar la basura.',
    tokens: ['Hay', 'que', 'reciclar', 'la', 'basura.'],
    distractors: ['contaminar', 'tirar', 'el', 'medioambiente'],
  },

  // Lessons 86-87 — Unit 7 expansion
  {
    id: 'sn088', lessonId: 'lesson_86',
    english: 'I have a fever and my throat hurts.',
    spanish: 'Tengo fiebre y me duele la garganta.',
    tokens: ['Tengo', 'fiebre', 'y', 'me', 'duele', 'la', 'garganta.'],
    distractors: ['catarro', 'cabeza', 'duelen', 'gripe'],
  },
  {
    id: 'sn089', lessonId: 'lesson_87',
    english: 'I meditate every morning to relax.',
    spanish: 'Medito cada mañana para relajarme.',
    tokens: ['Medito', 'cada', 'mañana', 'para', 'relajarme.'],
    distractors: ['noche', 'descanso', 'estrés', 'dormir'],
  },

  // Lesson 88 — Unit 8 expansion
  {
    id: 'sn090', lessonId: 'lesson_88',
    english: 'I am reading a very interesting book.',
    spanish: 'Estoy leyendo un libro muy interesante.',
    tokens: ['Estoy', 'leyendo', 'un', 'libro', 'muy', 'interesante.'],
    distractors: ['periódico', 'revista', 'aburrido', 'escribiendo'],
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
