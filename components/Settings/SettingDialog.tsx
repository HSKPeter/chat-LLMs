import { FC, useContext, useEffect, useReducer, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import { getSettings, saveSettings } from '@/utils/app/settings';

import { LightMode, PromptOptimizationMode, Settings } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  const settings: Settings = getSettings();
  const [theme, setTheme] = useState<LightMode>(settings.theme);
  const [promptOptimizationMode, setPromptOptimizationMode] = useState<PromptOptimizationMode>(settings.promptOptimizationMode);

  const { dispatch: homeDispatch } = useContext(HomeContext);
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        window.addEventListener('mouseup', handleMouseUp);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mouseup', handleMouseUp);
      setTheme(settings.theme);
      setPromptOptimizationMode(settings.promptOptimizationMode);
      onClose();
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose]);

  const handleSave = () => {
    homeDispatch({ field: 'lightMode', value: theme });
    homeDispatch({ field: 'promptOptimizationMode', value: promptOptimizationMode });
    saveSettings({ theme, promptOptimizationMode });
  };

  // Render nothing if the dialog is not open.
  if (!open) {
    return <></>;
  }

  // Render the dialog.
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="fixed inset-0 z-10 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />

          <div
            ref={modalRef}
            className="dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border border-gray-300 bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all dark:bg-[#202123] sm:my-8 sm:max-h-[600px] sm:w-full sm:max-w-lg sm:p-6 sm:align-middle"
            role="dialog"
          >
            <div className="text-lg pb-4 font-bold text-black dark:text-neutral-200">
              {t('Settings')}
            </div>

            <div className="text-sm font-bold mb-2 text-black dark:text-neutral-200">
              {t('Theme')}
            </div>

            <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring focus:border-blue-500 rounded-md"
              value={theme}
              onChange={(event) => setTheme(event.target.value as LightMode)}
            >
              <option value="dark">{t('Dark mode')}</option>
              <option value="light">{t('Light mode')}</option>
            </select>

            <div className="text-sm font-bold my-2 text-black dark:text-neutral-200">
              {t('GPT Prompt Optimization')}
            </div>

            <select
              className="w-full cursor-pointer bg-transparent p-2 text-neutral-700 dark:text-neutral-200 focus:outline-none focus:ring focus:border-blue-500 rounded-md"
              value={promptOptimizationMode}
              onChange={(event) => setPromptOptimizationMode(event.target.value as PromptOptimizationMode)}
            >
              <option value="none">{t('None')}</option>
              <option value="without context">{t('Without context')}</option>
              <option value="with full context">{t('With full context')}</option>
            </select>

            <button
              type="button"
              className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
              onClick={() => {
                handleSave();
                onClose();
              }}
            >
              {t('Save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
