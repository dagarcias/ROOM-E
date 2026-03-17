import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme/colors';
import { PollCard, PollOption } from '../components/chat/PollCard';

// Mock data similar to ChatScreen, just extracting polls conceptually
interface IsolatedPoll {
  id: string;
  senderName: string;
  time: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  isMe: boolean;
}

const MOCK_POLLS: IsolatedPoll[] = [
  {
    id: 'p1',
    senderName: 'Mateo',
    time: 'Ayer',
    question: '¿Qué cenamos hoy?',
    options: [
      { id: 'opt1', text: 'Pizza 🍕', votes: 1 },
      { id: 'opt2', text: 'Sushi 🍣', votes: 2 },
      { id: 'opt3', text: 'Ensalada 🥗', votes: 0 },
    ],
    totalVotes: 3,
    userVotedOptionId: 'opt2',
    isMe: false,
  },
  {
    id: 'p2',
    senderName: 'Yo',
    time: 'Hace 2 días',
    question: '¿Día para limpieza profunda?',
    options: [
      { id: 'opt1', text: 'Sábado en la mañana', votes: 2 },
      { id: 'opt2', text: 'Domingo tarde', votes: 1 },
    ],
    totalVotes: 3,
    isMe: true,
  }
];

export const PollsScreen = () => {
  const navigation = useNavigation<any>();
  // En producción (Agente 3) esto provendría del Global Store filtrando mensajes de tipo poll
  const [polls, setPolls] = React.useState(MOCK_POLLS);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(currentPolls => 
      currentPolls.map(p => {
        if (p.id === pollId) {
          return {
            ...p,
            userVotedOptionId: optionId,
            totalVotes: p.totalVotes + 1,
            options: p.options.map(opt => 
              opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
            )
          };
        }
        return p;
      })
    );
  };

  const renderItem = ({ item }: { item: IsolatedPoll }) => (
    <View style={styles.pollWrapper}>
      <PollCard
        question={item.question}
        options={item.options}
        totalVotes={item.totalVotes}
        userVotedOptionId={item.userVotedOptionId}
        onVote={(optId) => handleVote(item.id, optId)}
        senderName={item.senderName}
        time={item.time}
        isMe={item.isMe}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Encuestas Activas</Text>
      </View>

      <FlatList
        data={polls}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button for new Poll */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePollModal')}
      >
        <MaterialCommunityIcons name="poll" size={24} color={colors.white} />
        <View style={styles.fabBadge}>
          <MaterialCommunityIcons name="plus" size={12} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold as '700',
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 100, // Make room for FAB
  },
  pollWrapper: {
    width: '100%',
    alignItems: 'center', // Center polls in this view instead of chat-style alignment
    marginBottom: spacing.lg,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xxxl,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 2,
  }
});
