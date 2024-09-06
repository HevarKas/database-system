import { FiLogOut } from 'react-icons/fi';
import { Button } from '~/components/ui/button';

type LogoutButtonProps = {
  onOpenModal: () => void;
};

const LogoutButton = ({ onOpenModal }: LogoutButtonProps) => {
  const buttonClasses =
    'text-red-700 dark:text-red-300 hover:text-red-500 dark:hover:text-red-500';

  return (
    <Button onClick={onOpenModal} variant="link" className={buttonClasses}>
      <FiLogOut size={24} />
    </Button>
  );
};

export default LogoutButton;
