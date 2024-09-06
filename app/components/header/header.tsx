import UserAccount from '~/components/header/userAccount';
import LogoutButton from '~/components/header/logoutButton';
import ThemeToggleButton from '~/components/header/themeToggleButton';

type HeaderProps = {
  onOpenModal: () => void;
};

const Header = ({ onOpenModal }: HeaderProps) => {
  return (
    <header className="flex justify-end items-center w-full h-[60px] px-8 bg-gray-100 dark:bg-gray-700">
      <UserAccount />
      <ThemeToggleButton />
      <LogoutButton onOpenModal={onOpenModal} />
    </header>
  );
};

export default Header;
