import type { Word } from '../types';

export const WORDS: Word[] = [
  // Unit 1 — Greetings & Introductions
  { id: 'w001', spanish: 'hola', english: 'hello', example: '¡Hola! ¿Cómo estás?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w002', spanish: 'adiós', english: 'goodbye', example: 'Adiós, hasta mañana.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w003', spanish: 'buenos días', english: 'good morning', example: 'Buenos días, señora García.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w004', spanish: 'buenas tardes', english: 'good afternoon', example: 'Buenas tardes, ¿en qué puedo ayudarle?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w005', spanish: 'buenas noches', english: 'good evening / good night', example: 'Buenas noches, que duermas bien.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w006', spanish: 'por favor', english: 'please', example: 'Un café, por favor.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w007', spanish: 'gracias', english: 'thank you', example: 'Muchas gracias por tu ayuda.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w008', spanish: 'de nada', english: "you're welcome", example: 'De nada, fue un placer.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w009', spanish: 'me llamo', english: 'my name is', example: 'Me llamo Carlos.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w010', spanish: '¿cómo te llamas?', english: "what's your name?", example: '¿Cómo te llamas tú?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w011', spanish: 'mucho gusto', english: 'nice to meet you', example: 'Mucho gusto, soy Ana.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w012', spanish: '¿cómo estás?', english: 'how are you?', example: '¡Hola! ¿Cómo estás hoy?', topic: 'greetings', difficulty: 1, gender: null },

  // Unit 1 — Numbers
  { id: 'w013', spanish: 'uno', english: 'one', example: 'Tengo un hermano.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w014', spanish: 'dos', english: 'two', example: 'Son las dos de la tarde.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w015', spanish: 'tres', english: 'three', example: 'Necesito tres manzanas.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w016', spanish: 'cuatro', english: 'four', example: 'Hay cuatro sillas en la mesa.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w017', spanish: 'cinco', english: 'five', example: 'Tengo cinco dedos en la mano.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w018', spanish: 'diez', english: 'ten', example: 'Son las diez de la mañana.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w019', spanish: 'veinte', english: 'twenty', example: 'El libro cuesta veinte euros.', topic: 'numbers', difficulty: 1, gender: null },
  { id: 'w020', spanish: 'cien', english: 'one hundred', example: 'Hay cien personas en la sala.', topic: 'numbers', difficulty: 1, gender: null },

  // Unit 2 — Food & Drink
  { id: 'w021', spanish: 'el agua', english: 'water', example: 'Quiero un vaso de agua, por favor.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w022', spanish: 'el café', english: 'coffee', example: 'Me gusta el café con leche.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w023', spanish: 'el pan', english: 'bread', example: 'Compré pan en la panadería.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w024', spanish: 'la leche', english: 'milk', example: 'Los niños beben leche.', topic: 'food', difficulty: 1, gender: 'f' },
  { id: 'w025', spanish: 'la manzana', english: 'apple', example: 'Una manzana al día mantiene al médico lejos.', topic: 'food', difficulty: 1, gender: 'f' },
  { id: 'w026', spanish: 'el pollo', english: 'chicken', example: 'El pollo asado está delicioso.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w027', spanish: 'el arroz', english: 'rice', example: 'El arroz con frijoles es típico.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w028', spanish: 'la cerveza', english: 'beer', example: '¿Quieres una cerveza fría?', topic: 'food', difficulty: 1, gender: 'f' },
  { id: 'w029', spanish: 'la mesa', english: 'table', example: 'La comida está en la mesa.', topic: 'food', difficulty: 1, gender: 'f' },
  { id: 'w030', spanish: 'la cuenta', english: 'the bill', example: 'La cuenta, por favor.', topic: 'food', difficulty: 1, gender: 'f' },

  // Unit 2 — Common Verbs
  { id: 'w031', spanish: 'ser', english: 'to be (permanent)', example: 'Yo soy estudiante.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w032', spanish: 'estar', english: 'to be (temporary)', example: 'Estoy cansado hoy.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w033', spanish: 'tener', english: 'to have', example: 'Tengo dos gatos.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w034', spanish: 'querer', english: 'to want', example: 'Quiero aprender español.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w035', spanish: 'poder', english: 'to be able to / can', example: '¿Puedes ayudarme?', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w036', spanish: 'ir', english: 'to go', example: 'Voy al mercado.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w037', spanish: 'comer', english: 'to eat', example: 'Como pizza los viernes.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w038', spanish: 'beber', english: 'to drink', example: 'Bebo agua cada día.', topic: 'verbs', difficulty: 1, gender: null },
  { id: 'w039', spanish: 'hablar', english: 'to speak', example: 'Hablo un poco de español.', topic: 'verbs', difficulty: 2, gender: null },
  { id: 'w040', spanish: 'entender', english: 'to understand', example: 'No entiendo esta pregunta.', topic: 'verbs', difficulty: 2, gender: null },

  // Unit 3 — Travel & Directions
  { id: 'w041', spanish: 'el aeropuerto', english: 'airport', example: 'El vuelo sale desde el aeropuerto.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w042', spanish: 'el hotel', english: 'hotel', example: 'Reservé una habitación en el hotel.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w043', spanish: 'la estación', english: 'station', example: 'La estación de tren está cerca.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w044', spanish: 'el billete', english: 'ticket', example: 'Necesito un billete de ida y vuelta.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w045', spanish: 'a la derecha', english: 'to the right', example: 'Gira a la derecha en el semáforo.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w046', spanish: 'a la izquierda', english: 'to the left', example: 'El banco está a la izquierda.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w047', spanish: 'recto', english: 'straight ahead', example: 'Sigue recto por esta calle.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w048', spanish: 'cerca', english: 'near / close', example: 'El supermercado está cerca de aquí.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w049', spanish: 'lejos', english: 'far', example: 'La playa no está muy lejos.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w050', spanish: '¿dónde está?', english: 'where is?', example: '¿Dónde está la farmacia?', topic: 'travel', difficulty: 2, gender: null },

  // Unit 4 — Family
  { id: 'w051', spanish: 'la madre', english: 'mother', example: 'Mi madre cocina muy bien.', topic: 'family', difficulty: 1, gender: 'f' },
  { id: 'w052', spanish: 'el padre', english: 'father', example: 'Mi padre trabaja en la ciudad.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w053', spanish: 'el hermano', english: 'brother', example: 'Tengo dos hermanos mayores.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w054', spanish: 'la hermana', english: 'sister', example: 'Mi hermana estudia medicina.', topic: 'family', difficulty: 1, gender: 'f' },
  { id: 'w055', spanish: 'el hijo', english: 'son', example: 'Mi hijo tiene cinco años.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w056', spanish: 'la hija', english: 'daughter', example: 'Su hija toca el piano.', topic: 'family', difficulty: 1, gender: 'f' },
  { id: 'w057', spanish: 'el abuelo', english: 'grandfather', example: 'Mi abuelo cuenta muchas historias.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w058', spanish: 'la abuela', english: 'grandmother', example: 'La abuela prepara tamales.', topic: 'family', difficulty: 1, gender: 'f' },
  { id: 'w059', spanish: 'el amigo', english: 'friend (male)', example: 'Pedro es mi mejor amigo.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w060', spanish: 'la amiga', english: 'friend (female)', example: 'Ana es mi amiga de la escuela.', topic: 'family', difficulty: 1, gender: 'f' },

  // Unit 4 — Adjectives
  { id: 'w061', spanish: 'grande', english: 'big / large', example: 'El elefante es muy grande.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w062', spanish: 'pequeño', english: 'small', example: 'El gato es pequeño y bonito.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w063', spanish: 'bueno', english: 'good', example: 'Este restaurante es muy bueno.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w064', spanish: 'malo', english: 'bad', example: 'El tiempo está muy malo hoy.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w065', spanish: 'nuevo', english: 'new', example: 'Tengo un teléfono nuevo.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w066', spanish: 'viejo', english: 'old', example: 'Este edificio es muy viejo.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w067', spanish: 'bonito', english: 'beautiful / pretty', example: '¡Qué vestido tan bonito!', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w068', spanish: 'fácil', english: 'easy', example: 'Este ejercicio es fácil.', topic: 'adjectives', difficulty: 1, gender: null },
  { id: 'w069', spanish: 'difícil', english: 'difficult', example: 'El examen fue muy difícil.', topic: 'adjectives', difficulty: 2, gender: null },
  { id: 'w070', spanish: 'interesante', english: 'interesting', example: 'Este libro es muy interesante.', topic: 'adjectives', difficulty: 2, gender: null },

  // Unit 4 — Colors
  { id: 'w071', spanish: 'rojo', english: 'red', example: 'La rosa es roja.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w072', spanish: 'azul', english: 'blue', example: 'El cielo es azul.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w073', spanish: 'verde', english: 'green', example: 'El árbol tiene hojas verdes.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w074', spanish: 'amarillo', english: 'yellow', example: 'El sol es amarillo.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w075', spanish: 'blanco', english: 'white', example: 'La nieve es blanca.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w076', spanish: 'negro', english: 'black', example: 'El gato negro trae suerte.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w077', spanish: 'naranja', english: 'orange', example: 'La naranja tiene color naranja.', topic: 'colors', difficulty: 1, gender: null },
  { id: 'w078', spanish: 'morado', english: 'purple', example: 'Me gustan las flores moradas.', topic: 'colors', difficulty: 1, gender: null },

  // Unit 4 — Time & Frequency
  { id: 'w079', spanish: 'hoy', english: 'today', example: 'Hoy es lunes.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w080', spanish: 'mañana', english: 'tomorrow', example: 'Mañana tengo una reunión.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w081', spanish: 'ayer', english: 'yesterday', example: 'Ayer fui al cine.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w082', spanish: 'ahora', english: 'now', example: 'Ahora mismo estoy ocupado.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w083', spanish: 'siempre', english: 'always', example: 'Siempre llego a tiempo.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w084', spanish: 'nunca', english: 'never', example: 'Nunca llego tarde.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w085', spanish: 'a veces', english: 'sometimes', example: 'A veces como pizza.', topic: 'time', difficulty: 1, gender: null },
  { id: 'w086', spanish: 'tarde', english: 'late / afternoon', example: 'Llegué tarde a la clase.', topic: 'time', difficulty: 1, gender: null },

  // Unit 5 — Shopping & Money
  // Lesson 14 — At the Shop
  { id: 'w087', spanish: 'la tienda', english: 'shop / store', example: 'Hay una tienda en la esquina.', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w088', spanish: 'el precio', english: 'price', example: '¿Cuál es el precio de esta camisa?', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w089', spanish: 'barato', english: 'cheap', example: 'Este mercado es muy barato.', topic: 'shopping', difficulty: 2, gender: null },
  { id: 'w090', spanish: 'caro', english: 'expensive', example: 'El centro comercial es bastante caro.', topic: 'shopping', difficulty: 2, gender: null },
  { id: 'w091', spanish: 'la ropa', english: 'clothes', example: 'Necesito comprar ropa nueva.', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w092', spanish: 'la talla', english: 'size (clothing)', example: '¿Tienes esta camisa en talla mediana?', topic: 'shopping', difficulty: 2, gender: 'f' },
  // Lesson 15 — Paying & Money
  { id: 'w093', spanish: 'pagar', english: 'to pay', example: '¿Puedo pagar con tarjeta?', topic: 'shopping', difficulty: 2, gender: null },
  { id: 'w094', spanish: 'la tarjeta', english: 'card', example: 'Prefiero pagar con tarjeta de crédito.', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w095', spanish: 'el efectivo', english: 'cash', example: 'Solo aceptamos efectivo.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w096', spanish: 'el descuento', english: 'discount', example: 'Hay un descuento del veinte por ciento.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w097', spanish: 'el cambio', english: 'change (money)', example: 'Aquí tiene su cambio, señor.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w098', spanish: '¿cuánto cuesta?', english: 'how much does it cost?', example: '¿Cuánto cuesta este abrigo?', topic: 'shopping', difficulty: 2, gender: null },
  { id: 'w099', spanish: 'la bolsa', english: 'bag', example: '¿Le pongo una bolsa?', topic: 'shopping', difficulty: 2, gender: 'f' },
  // Lesson 16 — Clothes
  { id: 'w100', spanish: 'la camisa', english: 'shirt', example: 'Lleva una camisa blanca.', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w101', spanish: 'los pantalones', english: 'trousers', example: 'Los pantalones azules son de Jean.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w102', spanish: 'los zapatos', english: 'shoes', example: 'Los zapatos le duelen los pies.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w103', spanish: 'el abrigo', english: 'coat', example: 'Necesito un abrigo para el invierno.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w104', spanish: 'el vestido', english: 'dress', example: 'Lleva un vestido muy elegante.', topic: 'shopping', difficulty: 2, gender: 'm' },
  { id: 'w105', spanish: 'la chaqueta', english: 'jacket', example: 'Me puse la chaqueta porque hacía frío.', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w106', spanish: 'los calcetines', english: 'socks', example: 'Perdí un calcetín en la lavadora.', topic: 'shopping', difficulty: 2, gender: 'm' },

  // Unit 6 — Weather & Nature
  // Lesson 17 — Weather Conditions
  { id: 'w107', spanish: 'el sol', english: 'sun', example: 'Hoy brilla mucho el sol.', topic: 'weather', difficulty: 1, gender: 'm' },
  { id: 'w108', spanish: 'la lluvia', english: 'rain', example: 'La lluvia cae con fuerza.', topic: 'weather', difficulty: 1, gender: 'f' },
  { id: 'w109', spanish: 'el viento', english: 'wind', example: 'Hay mucho viento hoy.', topic: 'weather', difficulty: 1, gender: 'm' },
  { id: 'w110', spanish: 'la nieve', english: 'snow', example: 'La nieve cubre las montañas.', topic: 'weather', difficulty: 1, gender: 'f' },
  { id: 'w111', spanish: 'hace calor', english: "it's hot", example: 'En agosto siempre hace calor.', topic: 'weather', difficulty: 1, gender: null },
  { id: 'w112', spanish: 'hace frío', english: "it's cold", example: 'En diciembre hace mucho frío.', topic: 'weather', difficulty: 1, gender: null },
  { id: 'w113', spanish: 'nublado', english: 'cloudy', example: 'El cielo está nublado hoy.', topic: 'weather', difficulty: 2, gender: null },
  // Lesson 18 — Seasons
  { id: 'w114', spanish: 'la primavera', english: 'spring', example: 'En primavera florecen las rosas.', topic: 'weather', difficulty: 2, gender: 'f' },
  { id: 'w115', spanish: 'el verano', english: 'summer', example: 'En verano vamos a la playa.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w116', spanish: 'el otoño', english: 'autumn', example: 'En otoño caen las hojas.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w117', spanish: 'el invierno', english: 'winter', example: 'El invierno en Madrid es frío.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w118', spanish: 'el tiempo', english: 'weather / time', example: '¿Qué tiempo hace hoy?', topic: 'weather', difficulty: 1, gender: 'm' },
  { id: 'w119', spanish: 'el paraguas', english: 'umbrella', example: 'Lleva el paraguas porque va a llover.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w120', spanish: 'llover', english: 'to rain', example: 'Está lloviendo mucho esta tarde.', topic: 'weather', difficulty: 2, gender: null },
  // Lesson 19 — Nature & Places
  { id: 'w121', spanish: 'la playa', english: 'beach', example: 'La playa de Barcelona es preciosa.', topic: 'weather', difficulty: 1, gender: 'f' },
  { id: 'w122', spanish: 'la montaña', english: 'mountain', example: 'Hacemos senderismo en la montaña.', topic: 'weather', difficulty: 2, gender: 'f' },
  { id: 'w123', spanish: 'el río', english: 'river', example: 'El río Tajo pasa por Toledo.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w124', spanish: 'el bosque', english: 'forest', example: 'El bosque está lleno de pinos.', topic: 'weather', difficulty: 2, gender: 'm' },
  { id: 'w125', spanish: 'el parque', english: 'park', example: 'Los niños juegan en el parque.', topic: 'weather', difficulty: 1, gender: 'm' },
  { id: 'w126', spanish: 'el mar', english: 'sea', example: 'El mar Mediterráneo es cálido.', topic: 'weather', difficulty: 1, gender: 'm' },

  // Unit 7 — Health & Body
  // Lesson 20 — Body Parts
  { id: 'w127', spanish: 'la cabeza', english: 'head', example: 'Me duele la cabeza.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w128', spanish: 'el brazo', english: 'arm', example: 'Se rompió el brazo esquiando.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w129', spanish: 'la mano', english: 'hand', example: 'Lávate las manos antes de comer.', topic: 'health', difficulty: 1, gender: 'f' },
  { id: 'w130', spanish: 'la pierna', english: 'leg', example: 'Le duele la pierna después de correr.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w131', spanish: 'el pie', english: 'foot', example: 'Los zapatos me aprietan el pie.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w132', spanish: 'el ojo', english: 'eye', example: 'Tiene los ojos azules.', topic: 'health', difficulty: 1, gender: 'm' },
  { id: 'w133', spanish: 'la espalda', english: 'back', example: 'Me duele la espalda de trabajar.', topic: 'health', difficulty: 2, gender: 'f' },
  // Lesson 21 — Feeling Ill
  { id: 'w134', spanish: 'el médico', english: 'doctor', example: 'Necesito ver a un médico.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w135', spanish: 'la farmacia', english: 'pharmacy', example: 'La farmacia está al lado del banco.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w136', spanish: 'el dolor', english: 'pain', example: 'Tengo un dolor en el estómago.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w137', spanish: 'la fiebre', english: 'fever', example: 'El niño tiene fiebre alta.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w138', spanish: 'la medicina', english: 'medicine', example: 'Toma la medicina dos veces al día.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w139', spanish: 'el hospital', english: 'hospital', example: 'Le llevaron al hospital de urgencias.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w140', spanish: 'enfermo', english: 'ill / sick', example: 'Estoy enfermo y no puedo ir al trabajo.', topic: 'health', difficulty: 2, gender: null },
  // Lesson 22 — At the Doctor
  { id: 'w141', spanish: 'me duele', english: 'it hurts me', example: 'Me duele mucho la garganta.', topic: 'health', difficulty: 2, gender: null },
  { id: 'w142', spanish: 'la receta', english: 'prescription', example: 'El médico me dio una receta.', topic: 'health', difficulty: 3, gender: 'f' },
  { id: 'w143', spanish: 'la alergia', english: 'allergy', example: 'Tengo alergia al polen.', topic: 'health', difficulty: 3, gender: 'f' },
  { id: 'w144', spanish: 'la cita', english: 'appointment', example: 'Tengo una cita con el médico mañana.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w145', spanish: 'el seguro', english: 'insurance', example: 'Necesito el número de mi seguro médico.', topic: 'health', difficulty: 3, gender: 'm' },
  { id: 'w146', spanish: 'las urgencias', english: 'emergency room', example: 'Le llevaron a urgencias enseguida.', topic: 'health', difficulty: 3, gender: 'f' },

  // Unit 8 — Hobbies & Free Time
  // Lesson 23 — Sports
  { id: 'w147', spanish: 'el fútbol', english: 'football / soccer', example: 'En España el fútbol es muy popular.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  { id: 'w148', spanish: 'nadar', english: 'to swim', example: 'Me gusta nadar en el mar.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w149', spanish: 'correr', english: 'to run', example: 'Corro cinco kilómetros cada mañana.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w150', spanish: 'el tenis', english: 'tennis', example: 'Rafael Nadal juega al tenis.', topic: 'hobbies', difficulty: 2, gender: 'm' },
  { id: 'w151', spanish: 'el gimnasio', english: 'gym', example: 'Voy al gimnasio tres veces por semana.', topic: 'hobbies', difficulty: 2, gender: 'm' },
  { id: 'w152', spanish: 'el deporte', english: 'sport', example: 'El deporte es bueno para la salud.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  // Lesson 24 — Music & Arts
  { id: 'w153', spanish: 'la música', english: 'music', example: 'Me encanta la música española.', topic: 'hobbies', difficulty: 1, gender: 'f' },
  { id: 'w154', spanish: 'escuchar', english: 'to listen', example: 'Me gusta escuchar música mientras cocino.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w155', spanish: 'tocar', english: 'to play (instrument)', example: 'Toco la guitarra desde los diez años.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w156', spanish: 'la canción', english: 'song', example: 'Esta canción me pone de buen humor.', topic: 'hobbies', difficulty: 2, gender: 'f' },
  { id: 'w157', spanish: 'el concierto', english: 'concert', example: 'Fui a un concierto de flamenco.', topic: 'hobbies', difficulty: 2, gender: 'm' },
  { id: 'w158', spanish: 'bailar', english: 'to dance', example: 'En España bailan flamenco con pasión.', topic: 'hobbies', difficulty: 2, gender: null },
  // Lesson 25 — Reading & Learning
  { id: 'w159', spanish: 'el libro', english: 'book', example: 'Leo un libro antes de dormir.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  { id: 'w160', spanish: 'leer', english: 'to read', example: 'Me gusta leer novelas en español.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w161', spanish: 'estudiar', english: 'to study', example: 'Estudio español dos horas al día.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w162', spanish: 'la biblioteca', english: 'library', example: 'Voy a la biblioteca para estudiar.', topic: 'hobbies', difficulty: 2, gender: 'f' },
  { id: 'w163', spanish: 'el periódico', english: 'newspaper', example: 'Leo el periódico cada mañana.', topic: 'hobbies', difficulty: 2, gender: 'm' },
  { id: 'w164', spanish: 'la revista', english: 'magazine', example: 'Compré una revista de moda.', topic: 'hobbies', difficulty: 2, gender: 'f' },
  // Lesson 26 — Weekend Activities
  { id: 'w165', spanish: 'el cine', english: 'cinema', example: 'Vamos al cine el sábado por la noche.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  { id: 'w166', spanish: 'cocinar', english: 'to cook', example: 'Me gusta cocinar recetas españolas.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w167', spanish: 'viajar', english: 'to travel', example: 'Quiero viajar por toda España.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w168', spanish: 'descansar', english: 'to rest', example: 'Los domingos me gusta descansar en casa.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w169', spanish: 'salir', english: 'to go out', example: 'Salimos con amigos los viernes.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w170', spanish: 'la película', english: 'film / movie', example: 'La película duró dos horas.', topic: 'hobbies', difficulty: 2, gender: 'f' },
  { id: 'w171', spanish: 'el teatro', english: 'theatre', example: 'Fuimos al teatro a ver una obra.', topic: 'hobbies', difficulty: 2, gender: 'm' },

  // Lesson 27 — Question Words (Unit 1)
  { id: 'w172', spanish: '¿qué?', english: 'what?', example: '¿Qué quieres comer hoy?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w173', spanish: '¿dónde?', english: 'where?', example: '¿Dónde está la estación?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w174', spanish: '¿cuándo?', english: 'when?', example: '¿Cuándo llega el tren?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w175', spanish: '¿quién?', english: 'who?', example: '¿Quién es esa persona?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w176', spanish: '¿por qué?', english: 'why?', example: '¿Por qué estudias español?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w177', spanish: '¿cuánto?', english: 'how much? / how many?', example: '¿Cuánto cuesta esto?', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w178', spanish: '¿cómo?', english: 'how?', example: '¿Cómo se dice "hello" en español?', topic: 'greetings', difficulty: 1, gender: null },

  // Lesson 29 — Transport (Unit 3)
  { id: 'w179', spanish: 'el metro', english: 'metro / subway', example: 'Cojo el metro para ir al trabajo.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w180', spanish: 'el autobús', english: 'bus', example: 'El autobús número cinco va al centro.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w181', spanish: 'el coche', english: 'car', example: 'Vamos en coche, es más rápido.', topic: 'travel', difficulty: 1, gender: 'm' },
  { id: 'w182', spanish: 'el taxi', english: 'taxi', example: 'Pedimos un taxi al aeropuerto.', topic: 'travel', difficulty: 1, gender: 'm' },
  { id: 'w183', spanish: 'la bicicleta', english: 'bicycle', example: 'Voy al parque en bicicleta.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w184', spanish: 'el tren', english: 'train', example: 'El tren sale a las ocho en punto.', topic: 'travel', difficulty: 1, gender: 'm' },

  // ── Unit 9 — Work & Professions ───────────────────────────────────────────
  { id: 'w185', spanish: 'el trabajo', english: 'work / job', example: 'Mi trabajo es muy interesante.', topic: 'work', difficulty: 1, gender: 'm' },
  { id: 'w186', spanish: 'la oficina', english: 'office', example: 'Trabajo en una oficina en el centro.', topic: 'work', difficulty: 2, gender: 'f' },
  { id: 'w187', spanish: 'el jefe', english: 'boss / manager', example: 'Mi jefe es muy estricto pero justo.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w188', spanish: 'el empleado', english: 'employee / worker', example: 'Hay cien empleados en esta empresa.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w189', spanish: 'el abogado', english: 'lawyer', example: 'Necesito hablar con un abogado.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w190', spanish: 'el ingeniero', english: 'engineer', example: 'Mi hermano es ingeniero de software.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w191', spanish: 'el sueldo', english: 'salary / wage', example: 'El sueldo es bueno en esta empresa.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w192', spanish: 'la reunión', english: 'meeting', example: 'Tenemos una reunión importante a las diez.', topic: 'work', difficulty: 2, gender: 'f' },
  { id: 'w193', spanish: 'el proyecto', english: 'project', example: 'Estamos trabajando en un proyecto nuevo.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w194', spanish: 'la empresa', english: 'company / firm', example: 'La empresa tiene oficinas en Madrid y Barcelona.', topic: 'work', difficulty: 2, gender: 'f' },
  { id: 'w195', spanish: 'el horario', english: 'schedule / timetable', example: 'Mi horario de trabajo es de nueve a cinco.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w196', spanish: 'el ordenador', english: 'computer', example: 'Uso el ordenador para hacer mi trabajo.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w197', spanish: 'el correo', english: 'email / mail', example: 'Te mando el correo ahora mismo.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w198', spanish: 'la entrevista', english: 'interview', example: 'Tengo una entrevista de trabajo mañana.', topic: 'work', difficulty: 2, gender: 'f' },
  { id: 'w199', spanish: 'contratar', english: 'to hire', example: 'La empresa quiere contratar a veinte personas.', topic: 'work', difficulty: 3, gender: null },
  { id: 'w200', spanish: 'el negocio', english: 'business', example: 'Tiene un negocio de ropa en el centro.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w201', spanish: 'el cliente', english: 'client / customer', example: 'El cliente siempre tiene razón.', topic: 'work', difficulty: 2, gender: 'm' },
  { id: 'w202', spanish: 'el informe', english: 'report', example: 'Necesito terminar el informe para el viernes.', topic: 'work', difficulty: 3, gender: 'm' },
  { id: 'w203', spanish: 'la carrera', english: 'career / degree', example: 'Quiero hacer una carrera en medicina.', topic: 'work', difficulty: 2, gender: 'f' },
  { id: 'w204', spanish: 'el contrato', english: 'contract', example: 'Firmé el contrato esta mañana.', topic: 'work', difficulty: 2, gender: 'm' },

  // ── Unit 10 — Home & Daily Routine ────────────────────────────────────────
  { id: 'w205', spanish: 'la cocina', english: 'kitchen', example: 'La cocina es mi habitación favorita.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w206', spanish: 'el salón', english: 'living room', example: 'Vemos la televisión en el salón.', topic: 'home', difficulty: 2, gender: 'm' },
  { id: 'w207', spanish: 'el dormitorio', english: 'bedroom', example: 'Mi dormitorio tiene una cama grande.', topic: 'home', difficulty: 2, gender: 'm' },
  { id: 'w208', spanish: 'el baño', english: 'bathroom', example: 'El baño está al final del pasillo.', topic: 'home', difficulty: 1, gender: 'm' },
  { id: 'w209', spanish: 'la cama', english: 'bed', example: 'Me gusta dormir en una cama cómoda.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w210', spanish: 'la mesa', english: 'table', example: 'Cenamos todos juntos en la mesa.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w211', spanish: 'la silla', english: 'chair', example: 'Hay seis sillas alrededor de la mesa.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w212', spanish: 'el sofá', english: 'sofa / couch', example: 'Me relajo en el sofá después del trabajo.', topic: 'home', difficulty: 2, gender: 'm' },
  { id: 'w213', spanish: 'la ventana', english: 'window', example: 'Abre la ventana, hace mucho calor aquí.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w214', spanish: 'la puerta', english: 'door', example: 'Cierra la puerta con llave, por favor.', topic: 'home', difficulty: 1, gender: 'f' },
  { id: 'w215', spanish: 'ducharse', english: 'to have a shower', example: 'Me ducho cada mañana antes del desayuno.', topic: 'home', difficulty: 2, gender: null },
  { id: 'w216', spanish: 'desayunar', english: 'to have breakfast', example: 'Desayuno con café y tostadas todos los días.', topic: 'home', difficulty: 2, gender: null },
  { id: 'w217', spanish: 'limpiar', english: 'to clean', example: 'Limpio la casa los sábados por la mañana.', topic: 'home', difficulty: 2, gender: null },
  { id: 'w218', spanish: 'el armario', english: 'wardrobe / closet', example: 'Mi ropa está ordenada en el armario.', topic: 'home', difficulty: 2, gender: 'm' },
  { id: 'w219', spanish: 'la nevera', english: 'fridge', example: 'Pon la leche en la nevera, por favor.', topic: 'home', difficulty: 2, gender: 'f' },
  { id: 'w220', spanish: 'el horno', english: 'oven', example: 'Precalienta el horno a doscientos grados.', topic: 'home', difficulty: 2, gender: 'm' },
  { id: 'w221', spanish: 'la lavadora', english: 'washing machine', example: 'Pongo la lavadora los domingos por la tarde.', topic: 'home', difficulty: 3, gender: 'f' },
  { id: 'w222', spanish: 'el pasillo', english: 'hallway / corridor', example: 'Deja el paraguas en el pasillo.', topic: 'home', difficulty: 3, gender: 'm' },
  { id: 'w223', spanish: 'mudarse', english: 'to move house', example: 'Nos mudamos a un piso nuevo el mes que viene.', topic: 'home', difficulty: 3, gender: null },
  { id: 'w224', spanish: 'alquilar', english: 'to rent', example: 'Queremos alquilar un apartamento en el centro.', topic: 'home', difficulty: 3, gender: null },

  // ── Unit 11 — Emotions & Opinions ─────────────────────────────────────────
  { id: 'w225', spanish: 'feliz', english: 'happy', example: 'Estoy muy feliz con el resultado.', topic: 'emotions', difficulty: 1, gender: null },
  { id: 'w226', spanish: 'triste', english: 'sad', example: 'Estoy triste porque se fue mi amigo.', topic: 'emotions', difficulty: 1, gender: null },
  { id: 'w227', spanish: 'enfadado', english: 'angry', example: 'Estoy enfadado con mi hermano.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w228', spanish: 'asustado', english: 'scared / frightened', example: 'El niño está asustado de la oscuridad.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w229', spanish: 'emocionado', english: 'excited', example: 'Estoy muy emocionado por el viaje a España.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w230', spanish: 'aburrido', english: 'bored', example: 'Estoy aburrido, no hay nada que hacer hoy.', topic: 'emotions', difficulty: 1, gender: null },
  { id: 'w231', spanish: 'orgulloso', english: 'proud', example: 'Estoy orgulloso de mi trabajo.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w232', spanish: 'nervioso', english: 'nervous', example: 'Estoy nervioso antes del examen.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w233', spanish: 'sorprendido', english: 'surprised', example: 'Estoy sorprendido por la noticia.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w234', spanish: 'opinar', english: 'to have an opinion / to think', example: '¿Qué opinas sobre esta película?', topic: 'emotions', difficulty: 3, gender: null },
  { id: 'w235', spanish: 'creer', english: 'to believe / to think', example: 'Creo que tienes razón en esto.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w236', spanish: 'estar de acuerdo', english: 'to agree', example: 'Estoy de acuerdo contigo en ese punto.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w237', spanish: 'el sentimiento', english: 'feeling / emotion', example: 'Ese sentimiento es difícil de explicar.', topic: 'emotions', difficulty: 3, gender: 'm' },
  { id: 'w238', spanish: 'la alegría', english: 'joy / happiness', example: 'La alegría de los niños es contagiosa.', topic: 'emotions', difficulty: 3, gender: 'f' },
  { id: 'w239', spanish: 'el miedo', english: 'fear', example: 'Tengo miedo de hablar en público.', topic: 'emotions', difficulty: 2, gender: 'm' },
  { id: 'w240', spanish: 'el amor', english: 'love', example: 'El amor es lo más importante en la vida.', topic: 'emotions', difficulty: 2, gender: 'm' },
  { id: 'w241', spanish: 'odiar', english: 'to hate', example: 'Odio levantarme temprano los lunes.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w242', spanish: 'preocupado', english: 'worried', example: 'Estoy preocupado por los resultados.', topic: 'emotions', difficulty: 2, gender: null },
  { id: 'w243', spanish: 'confundido', english: 'confused', example: 'Estoy confundido con las instrucciones.', topic: 'emotions', difficulty: 3, gender: null },
  { id: 'w244', spanish: 'el ánimo', english: 'mood / spirit', example: 'Hoy tengo buen ánimo para estudiar.', topic: 'emotions', difficulty: 3, gender: 'm' },

  // ── Unit 12 — Spanish Culture & Life ──────────────────────────────────────
  { id: 'w245', spanish: 'la fiesta', english: 'festival / party', example: 'La Feria de Abril es una fiesta muy famosa.', topic: 'culture', difficulty: 1, gender: 'f' },
  { id: 'w246', spanish: 'la tradición', english: 'tradition', example: 'Es una tradición española muy antigua.', topic: 'culture', difficulty: 2, gender: 'f' },
  { id: 'w247', spanish: 'el flamenco', english: 'flamenco', example: 'El flamenco es el baile tradicional de Andalucía.', topic: 'culture', difficulty: 2, gender: 'm' },
  { id: 'w248', spanish: 'la siesta', english: 'siesta / afternoon nap', example: 'En España muchos negocios cierran durante la siesta.', topic: 'culture', difficulty: 1, gender: 'f' },
  { id: 'w249', spanish: 'la plaza', english: 'square / plaza', example: 'Quedamos en la plaza mayor a las ocho.', topic: 'culture', difficulty: 2, gender: 'f' },
  { id: 'w250', spanish: 'la catedral', english: 'cathedral', example: 'La catedral de Sevilla es impresionante.', topic: 'culture', difficulty: 2, gender: 'f' },
  { id: 'w251', spanish: 'el castillo', english: 'castle', example: 'El castillo de Segovia domina toda la ciudad.', topic: 'culture', difficulty: 2, gender: 'm' },
  { id: 'w252', spanish: 'el pueblo', english: 'village / small town', example: 'Paso los veranos en un pueblo pequeño.', topic: 'culture', difficulty: 2, gender: 'm' },
  { id: 'w253', spanish: 'celebrar', english: 'to celebrate', example: 'Celebramos el Año Nuevo con toda la familia.', topic: 'culture', difficulty: 2, gender: null },
  { id: 'w254', spanish: 'el patrimonio', english: 'heritage', example: 'La Alhambra es Patrimonio de la Humanidad.', topic: 'culture', difficulty: 3, gender: 'm' },
  { id: 'w255', spanish: 'la gastronomía', english: 'gastronomy / cuisine', example: 'La gastronomía española es muy variada y deliciosa.', topic: 'culture', difficulty: 3, gender: 'f' },
  { id: 'w256', spanish: 'el vino', english: 'wine', example: 'España produce vino en muchas regiones diferentes.', topic: 'culture', difficulty: 1, gender: 'm' },
  { id: 'w257', spanish: 'las tapas', english: 'tapas (small dishes)', example: 'Salimos a tomar unas tapas con los amigos.', topic: 'culture', difficulty: 1, gender: 'f' },
  { id: 'w258', spanish: 'el jamón', english: 'cured ham', example: 'El jamón ibérico es un producto muy famoso en España.', topic: 'culture', difficulty: 2, gender: 'm' },
  { id: 'w259', spanish: 'la paella', english: 'paella', example: 'La paella valenciana es uno de los platos más famosos.', topic: 'culture', difficulty: 2, gender: 'f' },
  { id: 'w260', spanish: 'el arte', english: 'art', example: 'El Museo del Prado tiene obras de arte increíbles.', topic: 'culture', difficulty: 2, gender: 'm' },
  { id: 'w261', spanish: 'pintar', english: 'to paint', example: 'Goya pintó cuadros famosos en el siglo XVIII.', topic: 'culture', difficulty: 2, gender: null },
  { id: 'w262', spanish: 'la arquitectura', english: 'architecture', example: 'La arquitectura de Gaudí es única en el mundo.', topic: 'culture', difficulty: 3, gender: 'f' },
  { id: 'w263', spanish: 'la capital', english: 'capital city', example: 'Madrid es la capital de España.', topic: 'culture', difficulty: 2, gender: 'f' },
  { id: 'w264', spanish: 'el turismo', english: 'tourism', example: 'El turismo es muy importante para la economía española.', topic: 'culture', difficulty: 2, gender: 'm' },

  // Unit 3 – Hotel (w265–w270)
  { id: 'w265', spanish: 'la habitación', english: 'room (hotel)', example: 'Quiero una habitación doble, por favor.', topic: 'travel', difficulty: 1, gender: 'f' },
  { id: 'w266', spanish: 'la reserva', english: 'reservation / booking', example: 'Tengo una reserva a nombre de García.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w267', spanish: 'la recepción', english: 'reception desk', example: 'Por favor, deje la llave en la recepción.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w268', spanish: 'el equipaje', english: 'luggage / baggage', example: 'Tengo mucho equipaje y necesito ayuda.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w269', spanish: 'la llave', english: 'key', example: 'He perdido la llave de mi habitación.', topic: 'travel', difficulty: 1, gender: 'f' },
  { id: 'w270', spanish: 'el ascensor', english: 'elevator / lift', example: 'El ascensor está al final del pasillo.', topic: 'travel', difficulty: 2, gender: 'm' },

  // Unit 3 – Transport & Tickets (w271–w276)
  { id: 'w271', spanish: 'el billete', english: 'ticket (transport)', example: 'Compré un billete de tren para Madrid.', topic: 'travel', difficulty: 1, gender: 'm' },
  { id: 'w272', spanish: 'el andén', english: 'platform (train)', example: 'El tren sale del andén número tres.', topic: 'travel', difficulty: 2, gender: 'm' },
  { id: 'w273', spanish: 'la salida', english: 'departure / exit', example: 'La salida de nuestro vuelo es a las diez.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w274', spanish: 'la llegada', english: 'arrival', example: 'La llegada está prevista para las dos de la tarde.', topic: 'travel', difficulty: 2, gender: 'f' },
  { id: 'w275', spanish: 'facturar', english: 'to check in (luggage)', example: 'Hay que facturar el equipaje antes de embarcar.', topic: 'travel', difficulty: 2, gender: null },
  { id: 'w276', spanish: 'el retraso', english: 'delay', example: 'El tren tiene un retraso de veinte minutos.', topic: 'travel', difficulty: 2, gender: 'm' },

  // Unit 5 – At the Market (w277–w282)
  { id: 'w277', spanish: 'el mercado', english: 'market', example: 'Los domingos vamos al mercado a comprar fruta.', topic: 'shopping', difficulty: 1, gender: 'm' },
  { id: 'w278', spanish: 'fresco', english: 'fresh', example: 'El pescado del mercado siempre es muy fresco.', topic: 'shopping', difficulty: 1, gender: null },
  { id: 'w279', spanish: 'barato', english: 'cheap / inexpensive', example: 'Esta camisa es muy barata, solo cuesta diez euros.', topic: 'shopping', difficulty: 1, gender: null },
  { id: 'w280', spanish: 'caro', english: 'expensive', example: 'El abrigo me parece demasiado caro.', topic: 'shopping', difficulty: 1, gender: null },
  { id: 'w281', spanish: 'el kilo', english: 'kilogram / kilo', example: 'Póngame un kilo de tomates, por favor.', topic: 'shopping', difficulty: 1, gender: 'm' },
  { id: 'w282', spanish: 'la bolsa', english: 'bag', example: 'Necesito una bolsa para llevar la compra.', topic: 'shopping', difficulty: 1, gender: 'f' },

  // Unit 5 – Clothes & Sizes (w283–w288)
  { id: 'w283', spanish: 'la ropa', english: 'clothing / clothes', example: 'Necesito comprar ropa nueva para el verano.', topic: 'shopping', difficulty: 1, gender: 'f' },
  { id: 'w284', spanish: 'la talla', english: 'size (clothing)', example: '¿Tienes esta camiseta en mi talla?', topic: 'shopping', difficulty: 2, gender: 'f' },
  { id: 'w285', spanish: 'la camisa', english: 'shirt', example: 'Esa camisa azul te queda muy bien.', topic: 'shopping', difficulty: 1, gender: 'f' },
  { id: 'w286', spanish: 'el pantalón', english: 'trousers / pants', example: 'Busco un pantalón negro de talla mediana.', topic: 'shopping', difficulty: 1, gender: 'm' },
  { id: 'w287', spanish: 'probarse', english: 'to try on (clothes)', example: '¿Puedo probarme estos pantalones?', topic: 'shopping', difficulty: 2, gender: null },
  { id: 'w288', spanish: 'el zapato', english: 'shoe', example: 'Estos zapatos son muy cómodos para caminar.', topic: 'shopping', difficulty: 1, gender: 'm' },

  // Unit 6 – Geography & Landscape (w289–w294)
  { id: 'w289', spanish: 'la montaña', english: 'mountain', example: 'En invierno vamos a esquiar a la montaña.', topic: 'nature', difficulty: 1, gender: 'f' },
  { id: 'w290', spanish: 'el río', english: 'river', example: 'El río Ebro es el más largo de España.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w291', spanish: 'la playa', english: 'beach', example: 'En verano nos gusta ir a la playa.', topic: 'nature', difficulty: 1, gender: 'f' },
  { id: 'w292', spanish: 'el bosque', english: 'forest / wood', example: 'Dimos un paseo por el bosque esta mañana.', topic: 'nature', difficulty: 2, gender: 'm' },
  { id: 'w293', spanish: 'la isla', english: 'island', example: 'Las Canarias son un archipiélago de ocho islas.', topic: 'nature', difficulty: 2, gender: 'f' },
  { id: 'w294', spanish: 'el lago', english: 'lake', example: 'El lago está rodeado de bosques y montañas.', topic: 'nature', difficulty: 2, gender: 'm' },

  // Unit 6 – Animals (w295–w300)
  { id: 'w295', spanish: 'el perro', english: 'dog', example: 'Mi perro se llama Bruno y es muy juguetón.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w296', spanish: 'el gato', english: 'cat', example: 'El gato duerme todo el día en el sofá.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w297', spanish: 'el pájaro', english: 'bird', example: 'Hay un pájaro cantando en el árbol del jardín.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w298', spanish: 'el caballo', english: 'horse', example: 'El caballo es un animal muy inteligente y noble.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w299', spanish: 'el pez', english: 'fish', example: 'Tenemos varios peces tropicales en casa.', topic: 'nature', difficulty: 1, gender: 'm' },
  { id: 'w300', spanish: 'la vaca', english: 'cow', example: 'Las vacas pastan en el campo junto al río.', topic: 'nature', difficulty: 1, gender: 'f' },

  // Unit 7 – Healthy Habits (w301–w306)
  { id: 'w301', spanish: 'dormir', english: 'to sleep', example: 'Es importante dormir al menos ocho horas cada noche.', topic: 'health', difficulty: 1, gender: null },
  { id: 'w302', spanish: 'descansar', english: 'to rest', example: 'Necesito descansar después de tanto trabajo.', topic: 'health', difficulty: 1, gender: null },
  { id: 'w303', spanish: 'el estrés', english: 'stress', example: 'El estrés puede afectar a la salud de forma negativa.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w304', spanish: 'la dieta', english: 'diet', example: 'Sigo una dieta equilibrada con mucha fruta y verdura.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w305', spanish: 'saludable', english: 'healthy', example: 'Caminar todos los días es un hábito muy saludable.', topic: 'health', difficulty: 2, gender: null },
  { id: 'w306', spanish: 'el bienestar', english: 'wellbeing / wellness', example: 'El deporte contribuye al bienestar físico y mental.', topic: 'health', difficulty: 3, gender: 'm' },

  // Unit 7 – Pharmacy (w307–w312)
  { id: 'w307', spanish: 'la farmacia', english: 'pharmacy / chemist', example: 'Necesito ir a la farmacia a comprar aspirinas.', topic: 'health', difficulty: 1, gender: 'f' },
  { id: 'w308', spanish: 'la pastilla', english: 'tablet / pill', example: 'El médico me recetó unas pastillas para el dolor.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w309', spanish: 'el jarabe', english: 'syrup (medicine)', example: 'Toma este jarabe para la tos tres veces al día.', topic: 'health', difficulty: 2, gender: 'm' },
  { id: 'w310', spanish: 'la alergia', english: 'allergy', example: 'Tengo alergia al polen en primavera.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w311', spanish: 'la receta', english: 'prescription / recipe', example: 'El médico me dio una receta para el antibiótico.', topic: 'health', difficulty: 2, gender: 'f' },
  { id: 'w312', spanish: 'el antibiótico', english: 'antibiotic', example: 'Solo toma antibióticos cuando el médico lo indique.', topic: 'health', difficulty: 3, gender: 'm' },

  // Unit 1 – Feelings & Emotions (w313–w318)
  { id: 'w313', spanish: 'contento', english: 'happy / pleased', example: 'Estoy muy contento con mis notas del examen.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w314', spanish: 'triste', english: 'sad', example: 'Está triste porque su equipo perdió el partido.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w315', spanish: 'enfadado', english: 'angry / annoyed', example: 'Estaba enfadado porque llegaste tarde.', topic: 'greetings', difficulty: 2, gender: null },
  { id: 'w316', spanish: 'nervioso', english: 'nervous / anxious', example: 'Estoy nervioso antes de la presentación.', topic: 'greetings', difficulty: 2, gender: null },
  { id: 'w317', spanish: 'cansado', english: 'tired', example: 'Estoy muy cansado después de trabajar todo el día.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w318', spanish: 'aburrido', english: 'bored / boring', example: 'Los niños están aburridos cuando llueve mucho.', topic: 'greetings', difficulty: 2, gender: null },

  // Unit 1 – Time Expressions (w319–w324)
  { id: 'w319', spanish: 'ahora', english: 'now', example: 'Ahora mismo no puedo hablar, llámame más tarde.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w320', spanish: 'siempre', english: 'always', example: 'Siempre desayuno un café con leche y tostadas.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w321', spanish: 'nunca', english: 'never', example: 'Nunca llego tarde al trabajo.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w322', spanish: 'a veces', english: 'sometimes', example: 'A veces salimos a cenar los viernes por la noche.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w323', spanish: 'tarde', english: 'late', example: 'El tren llegó muy tarde y perdimos la reunión.', topic: 'greetings', difficulty: 1, gender: null },
  { id: 'w324', spanish: 'temprano', english: 'early', example: 'Me levanto temprano para ir al gimnasio antes del trabajo.', topic: 'greetings', difficulty: 1, gender: null },

  // Unit 2 – In the Kitchen (w325–w330)
  { id: 'w325', spanish: 'cocinar', english: 'to cook', example: 'Me encanta cocinar platos tradicionales españoles.', topic: 'food', difficulty: 1, gender: null },
  { id: 'w326', spanish: 'el horno', english: 'oven', example: 'Mete el pollo en el horno a 180 grados.', topic: 'food', difficulty: 2, gender: 'm' },
  { id: 'w327', spanish: 'freír', english: 'to fry', example: 'Freír los huevos con aceite de oliva es muy sencillo.', topic: 'food', difficulty: 2, gender: null },
  { id: 'w328', spanish: 'hervir', english: 'to boil', example: 'Hierve el agua antes de añadir la pasta.', topic: 'food', difficulty: 2, gender: null },
  { id: 'w329', spanish: 'la sartén', english: 'frying pan', example: 'Calienta la sartén con un poco de aceite.', topic: 'food', difficulty: 2, gender: 'f' },
  { id: 'w330', spanish: 'los ingredientes', english: 'ingredients', example: 'Compra todos los ingredientes antes de empezar a cocinar.', topic: 'food', difficulty: 2, gender: 'm' },

  // Unit 2 – At the Café (w331–w336)
  { id: 'w331', spanish: 'el café', english: 'coffee', example: 'Tomo un café con leche todas las mañanas.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w332', spanish: 'el zumo', english: 'juice', example: 'Un zumo de naranja natural, por favor.', topic: 'food', difficulty: 1, gender: 'm' },
  { id: 'w333', spanish: 'pedir', english: 'to order / to ask for', example: 'Voy a pedir el menú del día, ¿y tú?', topic: 'food', difficulty: 2, gender: null },
  { id: 'w334', spanish: 'la cuenta', english: 'the bill / check', example: 'Cuando quieras, tráenos la cuenta, por favor.', topic: 'food', difficulty: 2, gender: 'f' },
  { id: 'w335', spanish: 'la propina', english: 'tip (gratuity)', example: 'Dejamos una propina al camarero por el buen servicio.', topic: 'food', difficulty: 2, gender: 'f' },
  { id: 'w336', spanish: 'el camarero', english: 'waiter', example: 'El camarero nos recomendó el plato del día.', topic: 'food', difficulty: 1, gender: 'm' },

  // Unit 4 – Personality & Character (w337–w342)
  { id: 'w337', spanish: 'amable', english: 'kind / friendly', example: 'Los vecinos son muy amables y siempre ayudan.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w338', spanish: 'inteligente', english: 'intelligent / clever', example: 'Es un estudiante muy inteligente y saca buenas notas.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w339', spanish: 'gracioso', english: 'funny / amusing', example: 'Mi amigo es muy gracioso y siempre nos hace reír.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w340', spanish: 'tímido', english: 'shy / timid', example: 'Al principio era tímido pero luego se abrió más.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w341', spanish: 'generoso', english: 'generous', example: 'Es muy generoso y siempre invita a sus amigos.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w342', spanish: 'trabajador', english: 'hard-working', example: 'Es una persona muy trabajadora y nunca llega tarde.', topic: 'family', difficulty: 2, gender: null },

  // Unit 4 – Relationships (w343–w348)
  { id: 'w343', spanish: 'el amigo', english: 'friend', example: 'Mi mejor amigo vive en Barcelona desde hace años.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w344', spanish: 'el novio', english: 'boyfriend / fiancé', example: 'Mi novio y yo llevamos tres años saliendo juntos.', topic: 'family', difficulty: 1, gender: 'm' },
  { id: 'w345', spanish: 'la pareja', english: 'partner / couple', example: 'Mi pareja y yo nos conocimos en la universidad.', topic: 'family', difficulty: 2, gender: 'f' },
  { id: 'w346', spanish: 'casarse', english: 'to get married', example: 'Mi hermana se casó en junio con una boda preciosa.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w347', spanish: 'llevarse bien', english: 'to get along well', example: 'Me llevo muy bien con mis compañeros de trabajo.', topic: 'family', difficulty: 2, gender: null },
  { id: 'w348', spanish: 'conocerse', english: 'to meet / get to know each other', example: 'Nos conocimos en una fiesta el año pasado.', topic: 'family', difficulty: 2, gender: null },

  // Unit 8 – Sports & Exercise (w349–w354)
  { id: 'w349', spanish: 'el fútbol', english: 'football / soccer', example: 'El fútbol es el deporte más popular en España.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  { id: 'w350', spanish: 'nadar', english: 'to swim', example: 'Nado en la piscina municipal tres veces a la semana.', topic: 'hobbies', difficulty: 1, gender: null },
  { id: 'w351', spanish: 'correr', english: 'to run', example: 'Corro media hora cada mañana para mantenerme en forma.', topic: 'hobbies', difficulty: 1, gender: null },
  { id: 'w352', spanish: 'el gimnasio', english: 'gym', example: 'Voy al gimnasio los lunes, miércoles y viernes.', topic: 'hobbies', difficulty: 1, gender: 'm' },
  { id: 'w353', spanish: 'ganar', english: 'to win / to earn', example: 'Nuestro equipo ganó el partido por dos goles a uno.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w354', spanish: 'perder', english: 'to lose', example: 'No importa perder, lo importante es participar.', topic: 'hobbies', difficulty: 2, gender: null },

  // Unit 8 – Music & Entertainment (w355–w360)
  { id: 'w355', spanish: 'la música', english: 'music', example: 'Escucho música clásica cuando estudio o trabajo.', topic: 'hobbies', difficulty: 1, gender: 'f' },
  { id: 'w356', spanish: 'tocar', english: 'to play (an instrument)', example: 'Toco la guitarra desde que tenía diez años.', topic: 'hobbies', difficulty: 2, gender: null },
  { id: 'w357', spanish: 'cantar', english: 'to sing', example: 'Le encanta cantar en el coro del colegio.', topic: 'hobbies', difficulty: 1, gender: null },
  { id: 'w358', spanish: 'el concierto', english: 'concert', example: 'Fui al concierto de mi grupo favorito el sábado.', topic: 'hobbies', difficulty: 2, gender: 'm' },
  { id: 'w359', spanish: 'la película', english: 'film / movie', example: 'Vimos una película de terror que me dio mucho miedo.', topic: 'hobbies', difficulty: 1, gender: 'f' },
  { id: 'w360', spanish: 'el teatro', english: 'theatre / theater', example: 'Fui al teatro a ver una obra de Lope de Vega.', topic: 'hobbies', difficulty: 2, gender: 'm' },
];

export const WORDS_BY_ID: Record<string, Word> = Object.fromEntries(
  WORDS.map((w) => [w.id, w])
);
