enum LargeLanguageModelType {
  OPEN_AI,
  COHERE,
  HUGGING_FACE
}

export interface LargeLanguageModel {
  id: LargeLanguageModelID;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
  type: LargeLanguageModelType;
  description: string;
  remarks: string;
}

export enum LargeLanguageModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  // GPT_3_5_AZ = 'gpt-35-turbo',
  // GPT_4 = 'gpt-4',
  // GPT_4_32K = 'gpt-4-32k',
  COHERE = 'cohere',
  BLOOM = 'bigscience/bloom',
  BLENDERBOT = 'facebook/blenderbot-3B',
  OPEN_ASSISTANT = 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
  PEGASUS_TLDR = 'google/pegasus-cnn_dailymail'
}

export const isGptModel = (model: LargeLanguageModel) => {
  return model.type === LargeLanguageModelType.OPEN_AI;
}

export const isHuggingFaceModel = (model: LargeLanguageModel) => {
  return model.type === LargeLanguageModelType.HUGGING_FACE;
}

export const isCohereModel = (model: LargeLanguageModel) => {
  return model.type === LargeLanguageModelType.COHERE;
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = LargeLanguageModelID.GPT_3_5;

const DEFAULT_MAX_LENGTH = 1000;
const DEFAULT_TOKEN_LIMIT = 100;

export const LargeLanguageModels: Record<LargeLanguageModelID, LargeLanguageModel> = {
  [LargeLanguageModelID.GPT_3_5]: {
    id: LargeLanguageModelID.GPT_3_5,
    name: 'OpenAI GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
    type: LargeLanguageModelType.OPEN_AI,
    description: 'An autoregressive language model built by OpenAI.',
    remarks: 'Each submission would induce cost in your OpenAI account.  Please be aware of the cost before submitting.  It is strongly recommended to closely monitor your OpenAI account balance, to avoid cost overruns.'
  },
  [LargeLanguageModelID.COHERE]: {
    id: LargeLanguageModelID.COHERE,
    name: 'Cohere Co.Generate',
    maxLength: DEFAULT_MAX_LENGTH,
    tokenLimit: 300,
    type: LargeLanguageModelType.COHERE,
    description: "A language model built by Cohere that contains 52.4B parameters.",
    remarks: "Some advanced prompting techniques of GPT-3.5 may not be supported in this model."
  },
  [LargeLanguageModelID.BLOOM]: {
    id: LargeLanguageModelID.BLOOM,
    name: 'BigScience BLOOM',
    maxLength: DEFAULT_MAX_LENGTH,
    tokenLimit: DEFAULT_TOKEN_LIMIT,
    type: LargeLanguageModelType.HUGGING_FACE,
    description: 'An open-access language model containing 176B parameters.',
    remarks: 'BLOOM is a text generation model.  Usually, its output would be a continuation of the given text, instead of a natural response to the previous conversation.'
  },
  [LargeLanguageModelID.BLENDERBOT]: {
    id: LargeLanguageModelID.BLENDERBOT,
    name: 'Facebook Blenderbot',
    maxLength: DEFAULT_MAX_LENGTH,
    tokenLimit: DEFAULT_TOKEN_LIMIT,
    type: LargeLanguageModelType.HUGGING_FACE,
    description: 'An open-domain chatbot trained by Facebook with a large dataset.',
    remarks: "Some advanced prompting techniques of GPT-3.5 may not be supported in this model."
  },   
  [LargeLanguageModelID.OPEN_ASSISTANT]: {
    id: LargeLanguageModelID.OPEN_ASSISTANT,
    name: 'Open Assistant (Pythia)',
    maxLength: DEFAULT_MAX_LENGTH,
    tokenLimit: DEFAULT_TOKEN_LIMIT,
    type: LargeLanguageModelType.HUGGING_FACE,
    description: 'An amazing conversational AI.',
    remarks: "This is a relatively lightweight model that returns short response messages.  You may checkout HuggingChat for a more powerful OpenAssistant model."
  },  
  [LargeLanguageModelID.PEGASUS_TLDR]: {
    id: LargeLanguageModelID.PEGASUS_TLDR,
    name: 'Google Pegasus TLDR',
    maxLength: DEFAULT_MAX_LENGTH,
    tokenLimit: DEFAULT_TOKEN_LIMIT,
    type: LargeLanguageModelType.HUGGING_FACE,
    description: 'An model for text summarization.',
    remarks: "This model only supports text summarization, and thus the response would always be a summary of the most recent prompt."
  },     
};
