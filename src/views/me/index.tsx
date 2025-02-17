import { Modal } from 'antd-mobile';
import { ReactComponent as CacheIcon } from 'assets/icons/cache.svg';
import { ReactComponent as LogoutIcon } from 'assets/icons/logout.svg';
import { ReactComponent as ShareIcon } from 'assets/icons/share.svg';
import { ReactComponent as ThemeIcon } from 'assets/icons/theme.svg';
import { ReactComponent as TranslateIcon } from 'assets/icons/translate.svg';
import copy from 'copy-to-clipboard';
import { FC, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { dispatch, useSelector } from 'store';
import { setLang } from 'store/slice/langReducer';
import { setTheme } from 'store/slice/themeReducer';
import { logoutUser } from 'store/slice/userReducer';
import { clearLocalStorageExcept } from 'utils/index';

interface Iindex {}

import { Bounce, toast } from 'react-toastify';
import styles from './index.module.scss';

const index: FC<Iindex> = () => {
  const intl = useIntl();
  const language = useSelector((state) => state.lang.language);
  const themeType = useSelector((state) => state.theme.themeType);
  const { nickName, avatar } = useSelector((state) => state.user.userInfo) as any;
  const operations = [
    {
      icon: ThemeIcon,
      text: <FormattedMessage id="switchTheme" />,
      action: 'theme'
    },
    {
      icon: TranslateIcon,
      text: <FormattedMessage id="switchLanguage" />,
      action: 'lang'
    },
    {
      icon: ShareIcon,
      text: <FormattedMessage id="shareWebpage" />,
      action: 'share'
    },
    {
      icon: CacheIcon,
      text: <FormattedMessage id="clearCache" />,
      action: 'cache'
    },
    {
      icon: LogoutIcon,
      text: <FormattedMessage id="logOut" />,
      action: 'logout'
    }
  ];

  useEffect(() => {
    return () => {};
  }, []);

  const handleName = (action: string) => {
    console.log('action ->', action);

    switch (action) {
      case 'theme':
        handleTheme();
        break;

      case 'lang':
        handleLang();
        break;

      case 'share':
        handleShare();
        break;

      case 'cache':
        handleCache();
        break;

      case 'logout':
        handleLogout();
        break;

      default:
        break;
    }
  };

  const handleTheme = () => {
    const theme = themeType === 'light' ? 'dark' : 'light';
    dispatch(setTheme(theme));
  };

  const handleLang = () => {
    const languageType = language === 'en' ? 'zh' : 'en';
    dispatch(setLang(languageType));
  };

  const handleShare = () => {
    const currentUrl = window.location.origin;
    try {
      copy(currentUrl);
      toast.success('🦄 Copy Success!', {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
      });
    } catch (error) {
      toast.error('Copy Failed!');
    }
  };

  const handleCache = () => {
    clearLocalStorageExcept(['token']);
    toast.success('🦄 Clear cache success!', {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored'
    });
  };
  const handleLogout = async () => {
    const onConfirm = async () => {
      try {
        await logoutUser();
        toast.success('🦄 Logout Success!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce
        });
      } catch (error) {
        toast.error('Logout Failed!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce
        });
        console.error('Logout Failed:', error);
      }
    };

    Modal.confirm({
      content: intl.formatMessage({ id: 'profile_confirm', defaultMessage: 'Confirm log out?' }),
      onConfirm,
      onCancel: () => {},
      confirmText: intl.formatMessage({ id: 'modal_confirm', defaultMessage: 'Confirm' }),
      cancelText: intl.formatMessage({ id: 'modal_cancel', defaultMessage: 'Cancel' })
    });
  };

  return (
    <div className={`${styles.me}`}>
      <div className={`box-shadow ${styles.me_top}`}>
        <div className={`${styles.me_top_name}`}>
          <FormattedMessage id="profile_hello" /> ，{nickName}！
        </div>

        <div className={`flex-space-around ${styles.me_top_bottom}`}>
          <div className={`flex-column text-warning ${styles.mtb_item}`}>
            <div>35.6k+</div>
            <div className="mt5">
              <FormattedMessage id="visitorCount" />
            </div>
          </div>

          <div className={`flex-column text-navy ${styles.mtb_item}`}>
            <div>16k+</div>
            <div className="mt5">
              <FormattedMessage id="share" />
            </div>
          </div>

          <div className={`flex-column text-danger ${styles.mtb_item}`}>
            <div>23k+</div>
            <div className="mt5">
              <FormattedMessage id="weeklyActive" />
            </div>
          </div>
        </div>
      </div>

      <div className={`rc ${styles.me_middle}`}>
        {operations.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <div
              key={index}
              className={`flex-space-between ${styles.me_middle_item}`}
              onClick={() => {
                handleName(item.action);
              }}
            >
              <div className={`flex-space-around`}>
                <IconComponent className="icon-mini" />
                <span className="ml8 pointer">{item.text}</span>
              </div>
              <div className={styles.mmi_right}>{'>'}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default index;
