import { FC } from 'react';

interface Props {
  text: string;
  supplementaryText?: string;
  icon: JSX.Element;
  onClick: () => void;
}

export const SidebarButton: FC<Props> = ({ text, supplementaryText, icon, onClick }) => {
  return (
    <button
      className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={onClick}
    >
      <div>{icon}</div>
      <div className='flex flex-col items-start'>
        <span>{text}</span>
        {supplementaryText && <span className="mt-2 text-[10px]">{supplementaryText}</span>}
      </div>
    </button>
  );
};
