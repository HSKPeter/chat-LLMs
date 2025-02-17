import { Conversation, Message } from '@/types/chat';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { LargeLanguageModel, LargeLanguageModelID, LargeLanguageModels } from '@/types/llm';
import { PluginKey } from '@/types/plugin';
import { Prompt } from '@/types/prompt';
import { LightMode, PromptOptimizationMode } from '@/types/settings';
import { USER_ROLE } from '@/types/userRole';

export interface HomeInitialState {
  apiKey: string;
  openAiApiKey: string;
  cohereApiKey: string;
  huggingfaceApiKey: string;
  pluginKeys: PluginKey[];
  loading: boolean;
  lightMode: LightMode;
  promptOptimizationMode: PromptOptimizationMode;
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: LargeLanguageModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showChatbar: boolean;
  showPromptbar: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: LargeLanguageModelID | undefined;
  serverSideApiKeyIsSet: boolean;
  serverSidePluginKeysSet: boolean;
  role: USER_ROLE;
  userEmail: string;
}

export const initialState: HomeInitialState = {
  apiKey: '',
  openAiApiKey: '',
  cohereApiKey: '',
  huggingfaceApiKey: '',
  loading: false,
  pluginKeys: [],
  lightMode: 'dark',
  promptOptimizationMode: 'without context',
  messageIsStreaming: false,
  modelError: null,
  models: [
    LargeLanguageModels['gpt-3.5-turbo'],
    LargeLanguageModels['cohere'],
    LargeLanguageModels['OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5']
  ],
  folders: [],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [],
  temperature: 1,
  showPromptbar: true,
  showChatbar: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  serverSidePluginKeysSet: false,
  role: USER_ROLE.GUEST,
  userEmail: ''
};
