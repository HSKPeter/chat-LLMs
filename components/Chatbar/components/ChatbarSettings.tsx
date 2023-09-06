import { IconDatabase, IconLogin, IconLogout, IconSettings } from '@tabler/icons-react';
import { useContext, useState } from 'react';

import { useTranslation } from 'next-i18next';

import HomeContext from '@/pages/api/home/home.context';

import { SettingDialog } from '@/components/Settings/SettingDialog';

import { SidebarButton } from '../../Sidebar/SidebarButton';
import ChatbarContext from '../Chatbar.context';
import { ClearConversations } from './ClearConversations';
import { ManageDataDialog } from '@/components/Settings/ManageDataDialog';
import { LoginDialog } from '@/components/Settings/LoginDialog';
import { USER_ROLE } from '@/types/userRole';
import { signOut } from 'next-auth/react';

export const ChatbarSettings = () => {
  const { t } = useTranslation('sidebar');
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState<boolean>(false);
  const [isManageDataDialogOpen, setIsManageDataDialogOpen] = useState<boolean>(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState<boolean>(false);

  const {
    state: {
      conversations,
      role,
      userEmail
    },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    handleClearConversations,
  } = useContext(ChatbarContext);

  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">
      {conversations.length > 0 ? (
        <ClearConversations onClearConversations={handleClearConversations} />
      ) : null}

      <SidebarButton
        text={t('Manage Data')}
        icon={<IconDatabase size={18} />}
        onClick={() => setIsManageDataDialogOpen(true)}
      />

      <ManageDataDialog
        open={isManageDataDialogOpen}
        onClose={() => {
          setIsManageDataDialogOpen(false);
        }}
      />

      <SidebarButton
        text={t('Settings')}
        icon={<IconSettings size={18} />}
        onClick={() => setIsSettingDialogOpen(true)}
      />

      <SettingDialog
        open={isSettingDialogOpen}
        onClose={() => {
          setIsSettingDialogOpen(false);
        }}
      />

      {
        role === USER_ROLE.GUEST 
          ? (
            <>
              <SidebarButton
                text={t('Login')}
                icon={<IconLogin size={18} />}
                onClick={() => setIsLoginDialogOpen(true)}
              />

              <LoginDialog 
                open={isLoginDialogOpen} 
                onClose={() => setIsLoginDialogOpen(false)} 
              />            
            </>
          )
          : (
            <SidebarButton
              text={t('Logout')}
              supplementaryText={`(${userEmail})`}
              icon={<IconLogout size={18} />}
              onClick={() => {
                const hasConfirmedSignout = confirm("Confirm to logout?");
                if (hasConfirmedSignout) {
                  homeDispatch({ field: 'role', value: USER_ROLE.GUEST });
                  signOut({ callbackUrl: '/' });
                }
              }}
            />            
          )
      }
    </div>
  );
};
