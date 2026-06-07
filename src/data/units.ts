import type { Unit, Lesson } from '../types';

export const LESSONS: Lesson[] = [
  // Unit 1
  {
    id: 'lesson_01',
    unitId: 'unit_01',
    title: 'Hello & Goodbye',
    questionTypes: ['multipleChoice', 'typing'],
    wordIds: ['w001', 'w002', 'w003', 'w004', 'w005'],
  },
  {
    id: 'lesson_02',
    unitId: 'unit_01',
    title: 'Introductions',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w006', 'w007', 'w008', 'w009', 'w010', 'w011', 'w012'],
  },
  {
    id: 'lesson_03',
    unitId: 'unit_01',
    title: 'Numbers 1–20',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w013', 'w014', 'w015', 'w016', 'w017', 'w018', 'w019', 'w020'],
  },

  // Unit 2
  {
    id: 'lesson_04',
    unitId: 'unit_02',
    title: 'At the Café',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w021', 'w022', 'w023', 'w024', 'w025'],
  },
  {
    id: 'lesson_05',
    unitId: 'unit_02',
    title: 'Food & Meals',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w026', 'w027', 'w028', 'w029', 'w030'],
  },
  {
    id: 'lesson_06',
    unitId: 'unit_02',
    title: 'Essential Verbs',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w031', 'w032', 'w033', 'w034', 'w035'],
  },
  {
    id: 'lesson_07',
    unitId: 'unit_02',
    title: 'Action Verbs',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w036', 'w037', 'w038', 'w039', 'w040'],
  },

  // Unit 3
  {
    id: 'lesson_08',
    unitId: 'unit_03',
    title: 'Getting Around',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w041', 'w042', 'w043', 'w044'],
  },
  {
    id: 'lesson_09',
    unitId: 'unit_03',
    title: 'Directions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w045', 'w046', 'w047', 'w048', 'w049', 'w050'],
  },

  // Unit 4
  {
    id: 'lesson_10',
    unitId: 'unit_04',
    title: 'Family Members',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w051', 'w052', 'w053', 'w054', 'w055', 'w056', 'w057', 'w058', 'w059', 'w060'],
  },
  {
    id: 'lesson_11',
    unitId: 'unit_04',
    title: 'Describing Things',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w061', 'w062', 'w063', 'w064', 'w065', 'w066', 'w067', 'w068', 'w069', 'w070'],
  },
  {
    id: 'lesson_12',
    unitId: 'unit_04',
    title: 'Colors',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w071', 'w072', 'w073', 'w074', 'w075', 'w076', 'w077', 'w078'],
  },
  {
    id: 'lesson_13',
    unitId: 'unit_04',
    title: 'Time & Frequency',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w079', 'w080', 'w081', 'w082', 'w083', 'w084', 'w085', 'w086'],
  },

  // Unit 5
  {
    id: 'lesson_14',
    unitId: 'unit_05',
    title: 'At the Shop',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w087', 'w088', 'w089', 'w090', 'w091', 'w092'],
  },
  {
    id: 'lesson_15',
    unitId: 'unit_05',
    title: 'Paying & Money',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w093', 'w094', 'w095', 'w096', 'w097', 'w098', 'w099'],
  },
  {
    id: 'lesson_16',
    unitId: 'unit_05',
    title: 'Clothes',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w100', 'w101', 'w102', 'w103', 'w104', 'w105', 'w106'],
  },

  // Unit 6
  {
    id: 'lesson_17',
    unitId: 'unit_06',
    title: 'Weather Conditions',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w107', 'w108', 'w109', 'w110', 'w111', 'w112', 'w113'],
  },
  {
    id: 'lesson_18',
    unitId: 'unit_06',
    title: 'Seasons',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w114', 'w115', 'w116', 'w117', 'w118', 'w119', 'w120'],
  },
  {
    id: 'lesson_19',
    unitId: 'unit_06',
    title: 'Nature & Places',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w121', 'w122', 'w123', 'w124', 'w125', 'w126'],
  },

  // Unit 7
  {
    id: 'lesson_20',
    unitId: 'unit_07',
    title: 'Body Parts',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w127', 'w128', 'w129', 'w130', 'w131', 'w132', 'w133'],
  },
  {
    id: 'lesson_21',
    unitId: 'unit_07',
    title: 'Feeling Ill',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w134', 'w135', 'w136', 'w137', 'w138', 'w139', 'w140'],
  },
  {
    id: 'lesson_22',
    unitId: 'unit_07',
    title: 'At the Doctor',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w141', 'w142', 'w143', 'w144', 'w145', 'w146'],
  },

  // Unit 8
  {
    id: 'lesson_23',
    unitId: 'unit_08',
    title: 'Sports',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w147', 'w148', 'w149', 'w150', 'w151', 'w152'],
  },
  {
    id: 'lesson_24',
    unitId: 'unit_08',
    title: 'Music & Arts',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w153', 'w154', 'w155', 'w156', 'w157', 'w158'],
  },
  {
    id: 'lesson_25',
    unitId: 'unit_08',
    title: 'Reading & Learning',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w159', 'w160', 'w161', 'w162', 'w163', 'w164'],
  },
  {
    id: 'lesson_26',
    unitId: 'unit_08',
    title: 'Weekend Activities',
    questionTypes: ['multipleChoice', 'typing', 'listening', 'speaking'],
    wordIds: ['w165', 'w166', 'w167', 'w168', 'w169', 'w170', 'w171'],
  },
];

export const UNITS: Unit[] = [
  {
    id: 'unit_01',
    title: 'Greetings & Introductions',
    description: 'Learn how to say hello, introduce yourself, and use basic pleasantries.',
    lessonIds: ['lesson_01', 'lesson_02', 'lesson_03'],
    icon: '👋',
  },
  {
    id: 'unit_02',
    title: 'Food & Everyday Verbs',
    description: 'Order food, describe meals, and master the most common Spanish verbs.',
    lessonIds: ['lesson_04', 'lesson_05', 'lesson_06', 'lesson_07'],
    icon: '🍽️',
  },
  {
    id: 'unit_03',
    title: 'Travel & Directions',
    description: 'Navigate airports, hotels, and streets with confidence.',
    lessonIds: ['lesson_08', 'lesson_09'],
    icon: '✈️',
  },
  {
    id: 'unit_04',
    title: 'Family & Descriptions',
    description: 'Talk about your family, describe people and things using adjectives and colors.',
    lessonIds: ['lesson_10', 'lesson_11', 'lesson_12', 'lesson_13'],
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'unit_05',
    title: 'Shopping & Money',
    description: 'Buy clothes and goods, ask prices, and handle payments in Spanish.',
    lessonIds: ['lesson_14', 'lesson_15', 'lesson_16'],
    icon: '🛍️',
  },
  {
    id: 'unit_06',
    title: 'Weather & Nature',
    description: 'Talk about the weather, seasons, and the natural world around you.',
    lessonIds: ['lesson_17', 'lesson_18', 'lesson_19'],
    icon: '☀️',
  },
  {
    id: 'unit_07',
    title: 'Health & Body',
    description: 'Describe body parts, talk about illness, and visit a doctor or pharmacy.',
    lessonIds: ['lesson_20', 'lesson_21', 'lesson_22'],
    icon: '💊',
  },
  {
    id: 'unit_08',
    title: 'Hobbies & Free Time',
    description: 'Chat about sports, music, reading, and what you do at the weekend.',
    lessonIds: ['lesson_23', 'lesson_24', 'lesson_25', 'lesson_26'],
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
