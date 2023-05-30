import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';

import { AZURE_DEPLOYMENT_ID, COHERE_API_HOST, HUGGINGFACE_API_HOST, OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION } from '../app/const';

import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from 'eventsource-parser';
import { LargeLanguageModel, LargeLanguageModelID } from '@/types/llm';

export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature : number,
  key: string,
  messages: Message[],
) => {
  let url = `${OPENAI_API_HOST}/v1/chat/completions`;
  const openAiApiKey = key ? key : process.env.OPENAI_API_KEY;
  
  if (OPENAI_API_TYPE === 'azure') {
    url = `${OPENAI_API_HOST}/openai/deployments/${AZURE_DEPLOYMENT_ID}/chat/completions?api-version=${OPENAI_API_VERSION}`;
  }
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(OPENAI_API_TYPE === 'openai' && {
        Authorization: `Bearer ${openAiApiKey}`
      }),
      ...(OPENAI_API_TYPE === 'azure' && {
        'api-key': `${openAiApiKey}`
      }),
      ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
        'OpenAI-Organization': OPENAI_ORGANIZATION,
      }),
    },
    method: 'POST',
    body: JSON.stringify({
      ...(OPENAI_API_TYPE === 'openai' && {model: model.id}),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: temperature,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const result = await res.json();
    if (result.error) {
      throw new OpenAIError(
        result.error.message,
        result.error.type,
        result.error.param,
        result.error.code,
      );
    } else {
      throw new Error(
        `OpenAI API returned an error: ${
          decoder.decode(result?.value) || result.statusText
        }`,
      );
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          try {
            const json = JSON.parse(data);
            if (json.choices[0].finish_reason != null) {
              controller.close();
              return;
            }
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export const cohereGenerate = async (
  message: Message[],
  temperature: number = 0.9,
) => {

  const prompt = message.map((m) => `${m.role === 'user' ? 'Q' : 'A'}: ${m.content}`).join('\n') + "Q: ";
  const res = await fetch(`${COHERE_API_HOST}/v1/generate`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'command-xlarge-nightly',
      prompt,
      max_tokens: 300,
      temperature: temperature,
      k: 0,
      stop_sequences: [],
      return_likelihoods: 'NONE'
    }),
  });
  const data = await res.json();
  if (data?.generations?.length > 0) {
    return data.generations[0].text;
  }

  throw new Error('Cohere API returned an error');
}

const wrapInputsWithOpenAssistantTokens = (inputs: Message[]) => {
  const conversationHistory = inputs.map((m) => `${m.role === 'user' ? `<|prompter|>${m.content}<|endoftext|>` : '<|assistant|>'}${m.content}<|endoftext|>`).join('');
  return conversationHistory + '<|assistant|>' ;
  
}

export const huggingfaceGenerate = async (
  model: LargeLanguageModel,
  inputs: Message[]
) => {
  const text = inputs[inputs.length - 1].content;
  const pastUserInputs = inputs.filter((m) => m.role === 'user').map((m) => m.content);
  const generatedResponses = inputs.filter((m) => m.role === 'assistant').map((m) => m.content);

  const data = model.id === "facebook/blenderbot-3B" 
  ? {
      "inputs": {
        "past_user_inputs": pastUserInputs,
        "generated_responses": generatedResponses,
        text
      }
  } : {
    inputs: model.id === "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5" 
      ? wrapInputsWithOpenAssistantTokens(inputs) 
      : inputs[inputs.length - 1].content
  }

  const headers = {
    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
    'Content-Type': 'application/json'
  }

  const response = await fetch(
    `${HUGGINGFACE_API_HOST}/models/${model.id}`,
    {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (model.id === "facebook/blenderbot-3B") {
    if (result?.generated_text) {
      return result.generated_text;
    } else {
      throw new Error("Huggingface API did not return a response");
    }
  }  
  
  if (model.id === "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5") {
    const { inputs } = data;
    if (result?.length > 0 && result[0]?.generated_text) {
      const { generated_text } = result[0];
      return generated_text.replace(inputs, "");
    }  
  }

  // if (model.id === "bigscience/bloom") {
  if (result?.length > 0 && result[0]?.generated_text) {
    return result[0].generated_text
  }    
  // }

  if (model.id === "google/pegasus-cnn_dailymail" 
      && result?.length > 0 
      && result[0]?.summary_text) {
    return result[0].summary_text
  }



  if (result?.error && result?.error?.endsWith("is currently loading")) {
    throw new Error(result?.error)
  }

  throw new Error("Huggingface API returned an error");
}
