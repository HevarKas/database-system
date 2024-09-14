import { useTranslation } from 'react-i18next';
import AKlogo from '~/assets/AKlogo';
import { Button } from '~/components/ui/button';
import { useTheme } from '~/contexts/themeProvider';

const UserAccount = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const buttonClasses =
    'hidden sm:flex sm:items-center sm:gap-3 hover:no-underline';
  const figureClasses = 'bg-gray-200 dark:bg-gray-800 rounded-full';
  const userName = t('ahmedKoye');

  return (
    <Button className={buttonClasses} variant="link">
      <figure className={figureClasses}>
        <AKlogo isDarkMode={isDarkMode} height={35} width={35} />
      </figure>
      <span>{userName}</span>
    </Button>
  );
};

export default UserAccount;
