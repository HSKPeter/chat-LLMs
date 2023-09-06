import { IconAlertCircle, IconExternalLink } from '@tabler/icons-react';
import { useContext } from 'react';

import { useTranslation } from 'next-i18next';

import { LargeLanguageModel, LargeLanguageModelID, LargeLanguageModels } from '@/types/llm';

import HomeContext from '@/pages/api/home/home.context';
import { isGptModelId } from '@/utils/app/gpt';

export const ModelSelect = () => {
  const { t } = useTranslation('chat');

  const {
    state: { selectedConversation, models, defaultModelId },
    handleUpdateConversation,
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: models.find(
          (model) => model.id === e.target.value,
        ) as LargeLanguageModel,
      });
  };

  const selectedModel = selectedConversation?.model?.id || defaultModelId;

  return (
    <div className="flex flex-col">
      <label className="mb-2 text-left text-neutral-700 dark:text-neutral-400">
        {t('Model')}
      </label>
      <div className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white">
        <select
          className="w-full bg-transparent p-2 outline-none"
          placeholder={t('Select a model') || ''}
          value={selectedModel}
          onChange={handleChange}
        >
          {models.map((model) => (
            <option
              key={model.id}
              value={model.id}
              className="dark:bg-[#343541] dark:text-white"
            >
              {model.name}
            </option>
          ))}
        </select>
      </div>
      {
        selectedModel &&
        selectedModel === LargeLanguageModelID.OPEN_ASSISTANT &&
        <div className="mt-5 mb-3 w-full inline-flex flex-row items-start text-left text-neutral-700 dark:text-neutral-400">
          <div className='mt-1'><IconAlertCircle size={18}/></div>
          <div className="ml-1">{LargeLanguageModels[selectedModel].remarks}</div>            
        </div>
      }
      {isGptModelId(selectedModel) && <div className="w-full mt-3 text-left text-neutral-700 dark:text-neutral-400 flex items-center">
        <a
          href="https://platform.openai.com/account/usage"
          target="_blank"
          className="flex items-center"
        >
          <IconExternalLink size={18} className={'inline mr-1'} />
          {t('View Account Usage')}
        </a>
      </div>}

      {selectedModel === LargeLanguageModelID.OPEN_ASSISTANT && <div className="w-full mt-3 text-left text-neutral-700 dark:text-neutral-400 flex items-center">
        <a
          href="https://huggingface.co/chat/"
          target="_blank"
          className="flex items-center"
        >
          <IconExternalLink size={18} className={'inline mr-1'} />
          {t('Visit HuggingChat')}
        </a>
      </div>}
    </div>
  );
};
