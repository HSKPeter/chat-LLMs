import { LargeLanguageModel, LargeLanguageModelID } from '@/types/llm';
import { FC } from 'react';

interface Props {
  model: LargeLanguageModel;
}


// https://tailwindcss.com/docs/content-configuration#class-detection-in-depth
const getColor = (model: LargeLanguageModel) => {
    const colors: { [key: string]: string } = {
        [LargeLanguageModelID.GPT_3_5]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
        [LargeLanguageModelID.COHERE]: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
        [LargeLanguageModelID.BLENDERBOT]: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        [LargeLanguageModelID.BLOOM]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
        [LargeLanguageModelID.OPEN_ASSISTANT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        [LargeLanguageModelID.PEGASUS_TLDR]: 'bg-zinc-300 text-zinc-800 dark:bg-zinc-500 dark:text-zinc-300',
    };
    return colors[model.id];
}

const getShortName = (model: LargeLanguageModel) => {
  const shortNames: { [key: string]: string } = {
    [LargeLanguageModelID.GPT_3_5]: 'GPT-3.5',
    [LargeLanguageModelID.COHERE]: 'Cohere',
    [LargeLanguageModelID.BLENDERBOT]: 'Blenderbot',
    [LargeLanguageModelID.BLOOM]: 'BLOOM',
    [LargeLanguageModelID.OPEN_ASSISTANT]: 'OpenAssistant',
    [LargeLanguageModelID.PEGASUS_TLDR]: 'TLDR',
  };
  return shortNames[model.id];
};

export const ModelLabel: FC<Props> = ({ model }) => {
  const name = getShortName(model);
  const color = getColor(model);

  return (
    <span
      className={`rounded px-1 py-0.5 ${color}`}
      style={{ fontSize: '10px' }}
    >
      {name}
    </span>
  );
};
