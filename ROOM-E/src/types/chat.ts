// Discriminated union for polymorphic messages

export interface BaseMessage {
  id: string;
  houseId: string;
  senderId: string;
  createdAt: string;
}

export interface TextMessage extends BaseMessage {
  type: 'text';
  content: string;
}

export interface PollOption {
  id: string;
  text: string;
}

export interface PollMessage extends BaseMessage {
  type: 'poll';
  question: string;
  options: PollOption[];
  votes: Record<string, string>; // Maps userId to optionId
}

export type ChatMessage = TextMessage | PollMessage;
