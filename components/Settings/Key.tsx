import { IconEyeOff, IconEye } from '@tabler/icons-react';
import { FC, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  name: string;
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export const Key: FC<Props> = ({ name, apiKey, onApiKeyChange }) => {
  const { t } = useTranslation('sidebar');
  const [isVisible, setIsVisible] = useState(false);

  return (
  <div className="duration:200 flex w-full cursor-pointer items-center rounded-md py-3 px-3 transition-colors">
    <div className="mr-2 text-black dark:text-neutral-200">{name}</div>

    <input
      className="ml-2 h-[20px] flex-1 overflow-hidden overflow-ellipsis border-b border-neutral-400 bg-transparent pr-1 text-[12.5px] leading-3 text-left text-black dark:text-neutral-200 outline-none focus:border-neutral-600 dark:focus:border-neutral-100"
      type={isVisible ? 'text' : 'password'}
      value={apiKey}
      onChange={(e) => onApiKeyChange(e.target.value)}
      placeholder={t(`${name} API Key`) || `${name} API Key`}
    />

    <div className="flex w-[40px]">
      {
        isVisible 
        ? <IconEye
            className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100"
            size={18}
            onClick={(e) => setIsVisible(!isVisible)}
          />
        : <IconEyeOff
            className="ml-auto min-w-[20px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-100"
            size={18}
            onClick={(e) => setIsVisible(!isVisible)}
          />
      }
    </div>
  </div>)
};
