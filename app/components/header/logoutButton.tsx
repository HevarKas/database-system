import classNames from 'classnames';
import { FiLogOut } from 'react-icons/fi';
import { Button } from '~/components/ui/button';
import { useLanguage } from '~/contexts/LanguageContext';

type LogoutButtonProps = {
  onOpenModal: () => void;
};

const LogoutButton = ({ onOpenModal }: LogoutButtonProps) => {
  const { rtl } = useLanguage();
  const buttonClasses = classNames(
    'text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500',
    {
      'transform rotate-180': rtl,
    },
  );

  return (
    <Button onClick={onOpenModal} variant="link" className={buttonClasses}>
      <FiLogOut size={24} />
    </Button>
  );
};

export default LogoutButton;
