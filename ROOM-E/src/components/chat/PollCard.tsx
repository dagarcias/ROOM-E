import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme/colors';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Props {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  onVote: (optionId: string) => void;
  senderName?: string;
  time: string;
  isMe: boolean;
}

export const PollCard = ({ question, options, totalVotes, userVotedOptionId, onVote, senderName, time, isMe }: Props) => {
  return (
    <View style={[styles.wrapper, isMe ? styles.myWrapper : styles.theirWrapper]}>
      {!isMe && senderName && <Text style={styles.senderName}>{senderName}</Text>}
      
      <View style={styles.card}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="poll" size={20} color={colors.primary} />
          <Text style={styles.headerText}>Encuesta</Text>
        </View>
        
        <Text style={styles.question}>{question}</Text>
        
        <View style={styles.optionsContainer}>
          {options.map((option) => {
            const isVoted = userVotedOptionId === option.id;
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            
            return (
              <TouchableOpacity 
                key={option.id}
                style={[
                  styles.optionButton,
                  isVoted && styles.optionButtonVoted
                ]}
                onPress={() => onVote(option.id)}
                activeOpacity={0.7}
              >
                {/* Progress Bar Background */}
                {!!userVotedOptionId && (
                  <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                )}
                
                <View style={styles.optionContent}>
                  <Text style={[styles.optionText, isVoted && styles.optionTextVoted]}>
                    {option.text}
                  </Text>
                  {!!userVotedOptionId && (
                    <Text style={[styles.percentageText, isVoted && styles.optionTextVoted]}>
                      {Math.round(percentage)}%
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.votesCount}>{totalVotes} votos</Text>
          {!!userVotedOptionId && (
            <Text style={styles.changeVoteHint}>Toca una opción para cambiar tu voto</Text>
          )}
        </View>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: spacing.xs,
    maxWidth: '85%',
    width: 300,
  },
  myWrapper: {
    alignSelf: 'flex-end',
  },
  theirWrapper: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginBottom: 2,
    marginLeft: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerText: {
    fontSize: typography.sizes.caption,
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  question: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold as '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  optionButtonVoted: {
    borderColor: colors.primary,
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary + '20', // 20% opacity
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    position: 'relative',
    zIndex: 1,
  },
  optionText: {
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
    flex: 1,
  },
  optionTextVoted: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  percentageText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  votesCount: {
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  changeVoteHint: {
    fontSize: 10,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  time: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
    marginHorizontal: spacing.sm,
  },
});
