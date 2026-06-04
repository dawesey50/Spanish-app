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
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w041', 'w042', 'w043', 'w044'],
  },
  {
    id: 'lesson_09',
    unitId: 'unit_03',
    title: 'Directions',
    questionTypes: ['multipleChoice', 'typing', 'listening'],
    wordIds: ['w045', 'w046', 'w047', 'w048', 'w049', 'w050'],
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
