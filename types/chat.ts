import { LargeLanguageModel } from './llm';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: LargeLanguageModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
  model: LargeLanguageModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}
