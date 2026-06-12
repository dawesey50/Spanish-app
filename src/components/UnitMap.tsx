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
import { UNITS, LESSONS_BY_ID, isUnitUnlocked, isLessonUnlocked } from '../data/units';

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

const NODE_SIZE    = 58;
const NODE_RADIUS  = NODE_SIZE / 2;
const VERT_GAP     = 116; // center-to-center vertical distance
const SIDE_MARGIN  = 28;  // horizontal padding inside path container

function Connector({
  ax, ay, bx, by, done,
}: { ax: number; ay: number; bx: number; by: number; done: boolean }) {
  const { c } = useTheme();
  const dx     = bx - ax;
  const dy     = by - ay;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle  = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX   = (ax + bx) / 2;
  const midY   = (ay + by) / 2;
  return (
    <View
      style={{
        position: 'absolute',
        width: length,
        height: 3,
        borderRadius: 2,
        backgroundColor: done ? c.greenBorder : c.border,
        left: midX - length / 2,
        top: midY - 1.5,
        transform: [{ rotate: `${angle}deg` }],
      }}
    />
  );
}

export default function UnitMap({
  completedLessons,
  onLessonPress,
  unlockAll = false,
  lessonScores = {},
}: Props) {
  const styles = useThemedStyles(createStyles);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 750, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 750, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const leftX  = containerWidth > 0 ? SIDE_MARGIN + NODE_RADIUS : 0;
  const rightX = containerWidth > 0 ? containerWidth - SIDE_MARGIN - NODE_RADIUS : 0;

  // Zigzag: right, left, right, left …
  const xPos = (i: number) => (i % 2 === 0 ? rightX : leftX);

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {UNITS.map((unit) => {
        const unitUnlocked = unlockAll || isUnitUnlocked(unit.id, completedLessons);
        const allDone      = unit.lessonIds.every((id) => completedLessons.includes(id));

        const pathHeight =
          unit.lessonIds.length > 0
            ? (unit.lessonIds.length - 1) * VERT_GAP + NODE_SIZE + 56
            : NODE_SIZE + 56;

        return (
          <View key={unit.id} style={styles.unitSection}>
            {/* ── Unit banner ─────────────────────────────────────────── */}
            <LinearGradient
              colors={unitUnlocked ? gradients.hero : gradients.locked}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.unitBanner}
            >
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
                <Text style={[styles.bannerDesc, !unitUnlocked && styles.lockedText]} numberOfLines={1}>
                  {unitUnlocked ? unit.description : 'Complete previous unit to unlock'}
                </Text>
              </View>
              {allDone && (
                <Image source={CHECK_ICON} style={styles.allDoneBadge} resizeMode="contain" />
              )}
            </LinearGradient>

            {/* ── Winding path ────────────────────────────────────────── */}
            {containerWidth > 0 && (
              <View style={[styles.pathContainer, { height: pathHeight }]}>
                {unit.lessonIds.map((lessonId, i) => {
                  const lesson        = LESSONS_BY_ID[lessonId];
                  const lessonDone    = completedLessons.includes(lessonId);
                  const lessonUnlocked = unlockAll || isLessonUnlocked(lessonId, completedLessons);
                  const isNext        = lessonUnlocked && !lessonDone;
                  const score         = lessonScores[lessonId];

                  const cx = xPos(i);
                  const cy = i * VERT_GAP + NODE_RADIUS;

                  // Connector to previous node
                  const showConnector = i > 0;
                  const prevCx = xPos(i - 1);
                  const prevCy = (i - 1) * VERT_GAP + NODE_RADIUS;
                  const connectorDone = lessonDone && completedLessons.includes(unit.lessonIds[i - 1]);

                  const isReview = lesson?.lessonType === 'review';
                  const nodeStyle = lessonDone
                    ? styles.nodeDone
                    : lessonUnlocked
                    ? (isReview ? styles.nodeReview : styles.nodeAvailable)
                    : styles.nodeLocked;

                  const labelLeft = cx - 54;
                  const labelTop  = cy + NODE_RADIUS + 6;

                  return (
                    <React.Fragment key={lessonId}>
                      {showConnector && (
                        <Connector
                          ax={prevCx} ay={prevCy}
                          bx={cx}     by={cy}
                          done={connectorDone}
                        />
                      )}

                      {/* Pulse ring for current lesson */}
                      {isNext && (
                        <Animated.View
                          style={[
                            styles.pulseRing,
                            {
                              left: cx - NODE_RADIUS - 8,
                              top:  cy - NODE_RADIUS - 8,
                              transform: [{ scale: pulseAnim }],
                            },
                          ]}
                        />
                      )}

                      <TouchableOpacity
                        style={[
                          styles.node,
                          nodeStyle,
                          {
                            left: cx - NODE_RADIUS,
                            top:  cy - NODE_RADIUS,
                          },
                        ]}
                        onPress={() => lessonUnlocked && onLessonPress(lessonId)}
                        disabled={!lessonUnlocked}
                        activeOpacity={lessonUnlocked ? 0.75 : 1}
                      >
                        {!unitUnlocked || (!lessonUnlocked) ? (
                          <Image source={LOCK_ICON} style={styles.nodeIcon} resizeMode="contain" />
                        ) : lessonDone ? (
                          <Image source={CHECK_ICON} style={styles.nodeIcon} resizeMode="contain" />
                        ) : isReview ? (
                          <Text style={styles.nodeReviewIcon}>★</Text>
                        ) : (
                          <Text style={styles.nodeNum}>{i + 1}</Text>
                        )}
                      </TouchableOpacity>

                      {/* Label below node */}
                      <View style={[styles.nodeLabel, { left: labelLeft, top: labelTop }]}>
                        <Text style={[styles.nodeLabelTitle, !lessonUnlocked && styles.lockedLabelText]} numberOfLines={2}>
                          {lesson?.title ?? lessonId}
                        </Text>
                        {lessonDone && score !== undefined && (
                          <Text style={styles.nodeLabelScore}>{score}%</Text>
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
}

const createStyles = (c: ThemeColors, isDark: boolean) => StyleSheet.create({
  unitSection: { marginBottom: 32 },

  // ── Unit banner ──────────────────────────────────────────────────────────
  unitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  bannerIcon: { width: 36, height: 36 },
  bannerEmoji: { fontSize: 28 },
  bannerText: { flex: 1 },
  bannerTitle: { fontSize: 15, fontFamily: fonts.display, color: '#FFFFFF', marginBottom: 2 },
  bannerDesc:  { fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  lockedText:  { color: 'rgba(255,255,255,0.55)' },
  allDoneBadge: { width: 24, height: 24 },

  // ── Path container ───────────────────────────────────────────────────────
  pathContainer: { position: 'relative', width: '100%' },

  // ── Nodes ────────────────────────────────────────────────────────────────
  node: {
    position: 'absolute',
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: c.green,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeAvailable: {
    backgroundColor: c.indigo,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeLocked: {
    backgroundColor: c.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  nodeReview: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  nodeIcon: { width: 24, height: 24 },
  nodeNum:  { fontSize: 20, fontFamily: fonts.display, color: '#FFFFFF' },
  nodeReviewIcon: { fontSize: 22, color: '#FFFFFF' },

  // ── Pulse ring ───────────────────────────────────────────────────────────
  pulseRing: {
    position: 'absolute',
    width: NODE_SIZE + 16,
    height: NODE_SIZE + 16,
    borderRadius: (NODE_SIZE + 16) / 2,
    backgroundColor: 'rgba(79,70,229,0.18)',
  },

  // ── Labels ───────────────────────────────────────────────────────────────
  nodeLabel: {
    position: 'absolute',
    width: 108,
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
  nodeLabelScore: {
    fontSize: 11,
    fontWeight: '700',
    color: c.green,
    marginTop: 2,
  },
});
