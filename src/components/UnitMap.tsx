import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts, gradients, type ThemeColors } from '../theme';
import { useTheme, useThemedStyles } from '../ThemeContext';
import { UNITS_BY_ID, LESSONS_BY_ID, isUnitUnlocked, isLessonUnlocked } from '../data/units';

const UNIT_IMAGES: Record<string, ReturnType<typeof require>> = {
  unit_01: require('../../assets/units/Greetings.png'),
  unit_02: require('../../assets/units/Food.png'),
  unit_03: require('../../assets/units/travel.png'),
  unit_04: require('../../assets/units/People.png'),
};
const LOCK_ICON  = require('../../assets/icons/grey_lock.png');
const CHECK_ICON = require('../../assets/icons/green_tick.png');

interface Props {
  completedLessons: string[];
  onLessonPress: (lessonId: string) => void;
  unlockAll?: boolean;
  lessonScores?: Record<string, number>;
}

// Curriculum sections — groups 12 units by CEFR level
const SECTIONS = [
  {
    id: 's1',
    label: 'Beginner',
    cefr: 'A1',
    color: '#10B981',
    grad: ['#34D399', '#10B981', '#059669'] as const,
    unitIds: ['unit_01', 'unit_02', 'unit_03'],
    desc: 'Core vocabulary and essential phrases',
  },
  {
    id: 's2',
    label: 'Elementary',
    cefr: 'A2',
    color: '#3B82F6',
    grad: ['#60A5FA', '#3B82F6', '#1D4ED8'] as const,
    unitIds: ['unit_04', 'unit_05', 'unit_06'],
    desc: 'Family, shopping, and daily life',
  },
  {
    id: 's3',
    label: 'Intermediate',
    cefr: 'B1',
    color: '#8B5CF6',
    grad: ['#A78BFA', '#8B5CF6', '#6D28D9'] as const,
    unitIds: ['unit_07', 'unit_08', 'unit_09'],
    desc: 'Health, hobbies, and professional life',
  },
  {
    id: 's4',
    label: 'Upper Intermediate',
    cefr: 'B2',
    color: '#F59E0B',
    grad: ['#FCD34D', '#F59E0B', '#D97706'] as const,
    unitIds: ['unit_10', 'unit_11', 'unit_12'],
    desc: 'Home, emotions, and Spanish culture',
  },
];

const DONE_GRAD  = ['#34D399', '#10B981', '#059669'] as const;
const NODE_SIZE   = 68;
const NODE_RADIUS = NODE_SIZE / 2;
const VERT_GAP    = 136;
const SIDE_MARGIN = 32;
const DOT_SIZE    = 7;
const DOT_GAP     = 18;

const NODE_GRADS = {
  done:      ['#10B981', '#059669'] as const,
  available: ['#6366F1', '#4338CA'] as const,
  review:    ['#F59E0B', '#D97706'] as const,
  locked:    ['#CBD5E1', '#94A3B8'] as const,
};

// ── Dotted connector between two node centres ─────────────────────────────
function DottedConnector({
  ax, ay, bx, by, done,
}: { ax: number; ay: number; bx: number; by: number; done: boolean }) {
  const dx    = bx - ax;
  const dy    = by - ay;
  const len   = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX  = (ax + bx) / 2;
  const midY  = (ay + by) / 2;

  const numDots = Math.max(2, Math.floor(len / DOT_GAP));
  const color   = done ? '#10B981' : '#CBD5E1';

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: len,
        height: DOT_SIZE,
        left: midX - len / 2,
        top: midY - DOT_SIZE / 2,
        transform: [{ rotate: `${angle}deg` }],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
      }}
    >
      {Array.from({ length: numDots }, (_, i) => (
        <View
          key={i}
          style={{
            width: DOT_SIZE,
            height: DOT_SIZE,
            borderRadius: DOT_SIZE / 2,
            backgroundColor: color,
            opacity: done ? 1 : 0.55,
          }}
        />
      ))}
    </View>
  );
}

export default function UnitMap({
  completedLessons,
  onLessonPress,
  unlockAll = false,
  lessonScores = {},
}: Props) {
  const { c } = useTheme();
  const styles    = useThemedStyles(createStyles);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.22, duration: 850, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 850, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const leftX  = containerWidth > 0 ? SIDE_MARGIN + NODE_RADIUS : 0;
  const rightX = containerWidth > 0 ? containerWidth - SIDE_MARGIN - NODE_RADIUS : 0;
  const xPos   = (i: number) => (i % 2 === 0 ? rightX : leftX);

  return (
    <View onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
      {SECTIONS.map((section) => {
        const sectionUnits = section.unitIds.map((id) => UNITS_BY_ID[id]).filter(Boolean);
        const doneUnits    = section.unitIds.reduce((n, uId) => {
          const u = UNITS_BY_ID[uId];
          return u && u.lessonIds.every((lId) => completedLessons.includes(lId)) ? n + 1 : n;
        }, 0);
        const sectionDone  = doneUnits === section.unitIds.length;

        return (
          <View key={section.id}>

            {/* ── Section header ──────────────────────────────────────── */}
            <View style={styles.sectionHeader}>
              <LinearGradient
                colors={section.grad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cefrBadge}
              >
                <Text style={styles.cefrText}>{section.cefr}</Text>
              </LinearGradient>
              <View style={styles.sectionTextArea}>
                <Text style={styles.sectionName}>{section.label}</Text>
                <Text style={styles.sectionDesc} numberOfLines={1}>{section.desc}</Text>
              </View>
              <View style={[
                styles.sectionCounter,
                sectionDone && { backgroundColor: section.color },
              ]}>
                {sectionDone
                  ? <Image source={CHECK_ICON} style={styles.sectionCheckIcon} resizeMode="contain" />
                  : <Text style={styles.sectionCounterText}>{doneUnits}/{section.unitIds.length}</Text>
                }
              </View>
            </View>

            {/* ── Units in section ────────────────────────────────────── */}
            {sectionUnits.map((unit) => {
              const unitUnlocked = unlockAll || isUnitUnlocked(unit.id, completedLessons);
              const doneCount    = unit.lessonIds.filter((id) => completedLessons.includes(id)).length;
              const allDone      = doneCount === unit.lessonIds.length && unit.lessonIds.length > 0;
              const pct          = unit.lessonIds.length > 0 ? doneCount / unit.lessonIds.length : 0;

              const pathHeight =
                unit.lessonIds.length > 0
                  ? (unit.lessonIds.length - 1) * VERT_GAP + NODE_SIZE + 72
                  : NODE_SIZE + 72;

              const bannerGrad = allDone
                ? DONE_GRAD
                : unitUnlocked
                ? gradients.hero
                : gradients.locked;

              return (
                <View key={unit.id} style={styles.unitSection}>

                  {/* ── Unit banner ─────────────────────────────────── */}
                  <LinearGradient
                    colors={bannerGrad as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.unitBanner}
                  >
                    <View style={styles.bannerRow}>
                      {!unitUnlocked ? (
                        <Image source={LOCK_ICON} style={styles.bannerIcon} resizeMode="contain" />
                      ) : UNIT_IMAGES[unit.id] ? (
                        <Image source={UNIT_IMAGES[unit.id]} style={styles.bannerIcon} resizeMode="contain" />
                      ) : (
                        <Text style={styles.bannerEmoji}>{unit.icon}</Text>
                      )}
                      <View style={styles.bannerText}>
                        <Text style={[styles.bannerTitle, !unitUnlocked && styles.lockedText]}>
                          {unit.title}
                        </Text>
                        <Text
                          style={[styles.bannerDesc, !unitUnlocked && styles.lockedDesc]}
                          numberOfLines={1}
                        >
                          {unitUnlocked ? unit.description : 'Complete previous unit to unlock'}
                        </Text>
                      </View>
                      {allDone && (
                        <View style={styles.allDoneWrap}>
                          <Image source={CHECK_ICON} style={styles.allDoneBadge} resizeMode="contain" />
                        </View>
                      )}
                      {!unitUnlocked && (
                        <View style={styles.lockedPill}>
                          <Image source={LOCK_ICON} style={styles.lockedPillIcon} resizeMode="contain" />
                          <Text style={styles.lockedPillText}>LOCKED</Text>
                        </View>
                      )}
                    </View>
                    {unitUnlocked && (
                      <View style={styles.bannerProgressRow}>
                        <View style={styles.bannerProgressTrack}>
                          <View
                            style={[
                              styles.bannerProgressFill,
                              { width: `${Math.round(pct * 100)}%` as any },
                            ]}
                          />
                        </View>
                        <Text style={styles.bannerProgressLabel}>
                          {doneCount}/{unit.lessonIds.length}
                        </Text>
                      </View>
                    )}
                  </LinearGradient>

                  {/* ── Winding path ────────────────────────────────── */}
                  {containerWidth > 0 && (
                    <View style={[styles.pathContainer, { height: pathHeight }]}>
                      {unit.lessonIds.map((lessonId, i) => {
                        const lesson         = LESSONS_BY_ID[lessonId];
                        const lessonDone     = completedLessons.includes(lessonId);
                        const lessonUnlocked = unlockAll || isLessonUnlocked(lessonId, completedLessons);
                        const isNext         = lessonUnlocked && !lessonDone;
                        const score          = lessonScores[lessonId];
                        const isReview       = lesson?.lessonType === 'review';

                        const cx = xPos(i);
                        const cy = i * VERT_GAP + NODE_RADIUS;

                        const prevCx = i > 0 ? xPos(i - 1) : cx;
                        const prevCy = i > 0 ? (i - 1) * VERT_GAP + NODE_RADIUS : cy;
                        const connectorDone =
                          lessonDone &&
                          i > 0 &&
                          completedLessons.includes(unit.lessonIds[i - 1]);

                        const nodeGrads = lessonDone
                          ? NODE_GRADS.done
                          : !lessonUnlocked
                          ? NODE_GRADS.locked
                          : isReview
                          ? NODE_GRADS.review
                          : NODE_GRADS.available;

                        const shadowColor = lessonDone
                          ? '#10B981'
                          : !lessonUnlocked
                          ? '#000'
                          : isReview
                          ? '#F59E0B'
                          : '#4F46E5';

                        const labelWidth = 108;
                        const labelLeft  = cx - labelWidth / 2;

                        const scoreBg    = score >= 80 ? c.greenSoft : score >= 60 ? c.amberSoft : c.redSoft;
                        const scoreColor = score >= 80 ? c.green     : score >= 60 ? c.amber     : c.red;

                        return (
                          <React.Fragment key={lessonId}>
                            {i > 0 && (
                              <DottedConnector
                                ax={prevCx} ay={prevCy}
                                bx={cx}     by={cy}
                                done={connectorDone}
                              />
                            )}

                            {isNext && (
                              <>
                                <Animated.View
                                  style={[
                                    styles.pulseRingOuter,
                                    {
                                      left: cx - NODE_RADIUS - 13,
                                      top:  cy - NODE_RADIUS - 13,
                                      transform: [{ scale: pulseAnim }],
                                    },
                                  ]}
                                />
                                <Animated.View
                                  style={[
                                    styles.pulseRingInner,
                                    {
                                      left: cx - NODE_RADIUS - 7,
                                      top:  cy - NODE_RADIUS - 7,
                                      transform: [{ scale: pulseAnim }],
                                    },
                                  ]}
                                />
                              </>
                            )}

                            <TouchableOpacity
                              style={[
                                styles.node,
                                {
                                  left: cx - NODE_RADIUS,
                                  top:  cy - NODE_RADIUS,
                                  shadowColor,
                                  shadowOpacity: lessonUnlocked ? 0.45 : 0.08,
                                  elevation: lessonUnlocked ? 6 : 1,
                                  opacity: !unitUnlocked ? 0.28 : 1,
                                },
                              ]}
                              onPress={() => lessonUnlocked && onLessonPress(lessonId)}
                              disabled={!lessonUnlocked}
                              activeOpacity={lessonUnlocked ? 0.78 : 1}
                            >
                              <LinearGradient
                                colors={nodeGrads}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.nodeGradient}
                              >
                                {!lessonUnlocked ? (
                                  <Image source={LOCK_ICON} style={styles.nodeIcon} resizeMode="contain" />
                                ) : lessonDone ? (
                                  <Image source={CHECK_ICON} style={styles.nodeIcon} resizeMode="contain" />
                                ) : isReview ? (
                                  <Text style={styles.nodeReviewIcon}>★</Text>
                                ) : (
                                  <Text style={styles.nodeNum}>{i + 1}</Text>
                                )}
                              </LinearGradient>
                            </TouchableOpacity>

                            <View
                              style={[
                                styles.nodeLabel,
                                { left: labelLeft, top: cy + NODE_RADIUS + 8, width: labelWidth },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.nodeLabelTitle,
                                  !lessonUnlocked && styles.lockedLabelText,
                                ]}
                                numberOfLines={2}
                              >
                                {lesson?.title ?? lessonId}
                              </Text>
                              {lessonDone && score !== undefined && (
                                <View style={[styles.scorePill, { backgroundColor: scoreBg }]}>
                                  <Text style={[styles.scorePillText, { color: scoreColor }]}>
                                    {score}%
                                  </Text>
                                </View>
                              )}
                            </View>
                          </React.Fragment>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({

  // ── Section headers ───────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: c.border,
  },
  cefrBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cefrText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sectionTextArea: { flex: 1 },
  sectionName: {
    fontSize: 15,
    fontFamily: fonts.display,
    color: c.text,
    marginBottom: 1,
  },
  sectionDesc: { fontSize: 11, color: c.textMuted, lineHeight: 15 },
  sectionCounter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: c.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCheckIcon: { width: 20, height: 20 },
  sectionCounterText: { fontSize: 11, fontWeight: '800', color: c.textMuted },

  // ── Unit section ──────────────────────────────────────────────────────────
  unitSection: { marginBottom: 28 },

  // ── Banner ────────────────────────────────────────────────────────────────
  unitBanner: {
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    gap: 10,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon:  { width: 38, height: 38 },
  bannerEmoji: { fontSize: 30 },
  bannerText:  { flex: 1 },
  bannerTitle: { fontSize: 15, fontFamily: fonts.display, color: '#FFFFFF', marginBottom: 3 },
  bannerDesc:  { fontSize: 11, color: 'rgba(255,255,255,0.82)', lineHeight: 15 },
  lockedText:  { color: 'rgba(255,255,255,0.55)' },
  lockedDesc:  { color: 'rgba(255,255,255,0.42)' },
  allDoneWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  allDoneBadge: { width: 22, height: 22 },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },
  lockedPillIcon: { width: 11, height: 11, opacity: 0.8 },
  lockedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.6,
  },
  bannerProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bannerProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  bannerProgressFill: {
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 2,
  },
  bannerProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    minWidth: 28,
    textAlign: 'right',
  },

  // ── Path ─────────────────────────────────────────────────────────────────
  pathContainer: { position: 'relative', width: '100%' },

  // ── Node ─────────────────────────────────────────────────────────────────
  node: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  nodeGradient: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIcon:       { width: 28, height: 28 },
  nodeNum:        { fontSize: 22, fontFamily: fonts.display, color: '#FFFFFF' },
  nodeReviewIcon: { fontSize: 26, color: '#FFFFFF' },

  // ── Pulse rings ───────────────────────────────────────────────────────────
  pulseRingOuter: {
    position: 'absolute',
    width:  NODE_SIZE + 26,
    height: NODE_SIZE + 26,
    borderRadius: (NODE_SIZE + 26) / 2,
    backgroundColor: 'rgba(99,102,241,0.10)',
  },
  pulseRingInner: {
    position: 'absolute',
    width:  NODE_SIZE + 14,
    height: NODE_SIZE + 14,
    borderRadius: (NODE_SIZE + 14) / 2,
    backgroundColor: 'rgba(99,102,241,0.20)',
  },

  // ── Labels ────────────────────────────────────────────────────────────────
  nodeLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  nodeLabelTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: c.text,
    textAlign: 'center',
    lineHeight: 15,
  },
  lockedLabelText: { color: c.textMuted },
  scorePill: {
    marginTop: 4,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  scorePillText: { fontSize: 10, fontWeight: '800' },
});
