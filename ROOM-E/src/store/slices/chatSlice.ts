import { StateCreator } from 'zustand';
import { ChatMessage, TextMessage, PollMessage } from '../../types';
import { StoreState } from '../useAppStore';

export interface ChatSlice {
  messages: ChatMessage[];
  sendMessage: (houseId: string, senderId: string, content: string) => void;
  createPoll: (houseId: string, senderId: string, question: string, optionsText: string[]) => void;
  votePoll: (messageId: string, optionId: string, userId: string) => void;
}

export const createChatSlice: StateCreator<
  StoreState,
  [],
  [],
  ChatSlice
> = (set, get) => ({
  messages: [],

  sendMessage: (houseId, senderId, content) => set((state) => {
    const newMessage: TextMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      houseId,
      senderId,
      content,
      createdAt: new Date().toISOString()
    };
    return { messages: [...state.messages, newMessage] };
  }),

  createPoll: (houseId, senderId, question, optionsText) => set((state) => {
    const options = optionsText.map(text => ({
      id: Math.random().toString(36).substr(2, 9),
      text
    }));

    const newPoll: PollMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'poll',
      houseId,
      senderId,
      question,
      options,
      votes: {}, // empty initially
      createdAt: new Date().toISOString()
    };

    return { messages: [...state.messages, newPoll] };
  }),

  votePoll: (messageId, optionId, userId) => set((state) => {
    const newMessages = [...state.messages];
    const messageIndex = newMessages.findIndex(m => m.id === messageId);

    if (messageIndex > -1) {
      const message = newMessages[messageIndex];
      // Type guard: Ensure it's a poll
      if (message.type === 'poll') {
        // Business Rule: A user can vote, or change their vote, but cannot vote multiple times for different options.
        // We just overwrite the userId key in the votes record to enforce 1 vote per user.
        const updatedVotes = { ...message.votes, [userId]: optionId };
        
        newMessages[messageIndex] = {
          ...message,
          votes: updatedVotes
        };
      }
    }

    return { messages: newMessages };
  })
});
