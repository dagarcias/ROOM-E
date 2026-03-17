import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { colors, spacing, typography } from '../theme/colors';
import { MessageBubble } from '../components/chat/MessageBubble';
import { PollCard } from '../components/chat/PollCard';
import { ChatInput } from '../components/chat/ChatInput';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { ChatMessage, PollMessage } from '../types';

export const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const flatListRef = useRef<FlatList>(null);

  // --- Zustand Store (Agente 1 Domain Layer) ---
  const messages = useAppStore(state => state.messages);
  const currentHouseId = useAppStore(state => state.currentHouseId);
  const user = useAppStore(state => state.user);
  const houseMembers = useAppStore(state => state.houseMembers);
  const sendMessage = useAppStore(state => state.sendMessage);
  const votePoll = useAppStore(state => state.votePoll);

  /** Derive display name from houseMembers; fall back to "Roommate". */
  const getDisplayName = (senderId: string): string => {
    if (user && senderId === user.id) return 'Yo';
    return houseMembers.find(m => m.id === senderId)?.name ?? 'Roommate';
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- Handlers ---
  const handleSendMessage = (text: string) => {
    if (!currentHouseId || !user) return;
    sendMessage(currentHouseId, user.id, text);
  };

  const handleCreatePollPress = () => {
    navigation.navigate('CreatePollModal');
  };

  const handleVote = (messageId: string, optionId: string) => {
    if (!user) return;
    votePoll(messageId, optionId, user.id);
  };

  // --- Render helpers ---
  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isMe = !!user && item.senderId === user.id;
    const senderName = getDisplayName(item.senderId);
    const time = formatTime(item.createdAt);

    if (item.type === 'text') {
      return (
        <MessageBubble
          text={item.content}
          isMe={isMe}
          senderName={senderName}
          time={time}
        />
      );
    }

    if (item.type === 'poll') {
      const poll = item as PollMessage;
      // Build PollCard options from the domain model
      const totalVotes = Object.keys(poll.votes).length;
      const optionVoteCounts = poll.options.map(opt => ({
        ...opt,
        votes: Object.values(poll.votes).filter(v => v === opt.id).length,
      }));
      const userVotedOptionId = user ? poll.votes[user.id] : undefined;

      return (
        <PollCard
          question={poll.question}
          options={optionVoteCounts}
          totalVotes={totalVotes}
          userVotedOptionId={userVotedOptionId}
          onVote={(optionId) => handleVote(poll.id, optionId)}
          senderName={senderName}
          time={time}
          isMe={isMe}
        />
      );
    }

    return null;
  };

  // FlatList is inverted — newest message is at index 0
  const reversedMessages = [...messages].reverse();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Casa Chat</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={reversedMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Todavía no hay mensajes.</Text>
            <Text style={styles.emptySubText}>¡Sé el primero en escribir algo! 👋</Text>
          </View>
        }
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        onPressAttach={handleCreatePollPress}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  headerTitle: {
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold as '700',
    color: colors.primary,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    transform: [{ scaleY: -1 }], // FlatList inverted: compensate text flip
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: typography.sizes.h3,
    fontWeight: '600',
  },
  emptySubText: {
    color: colors.textSecondary,
    fontSize: typography.sizes.caption,
    marginTop: spacing.xs,
  },
});
