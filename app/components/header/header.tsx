import UserAccount from '~/components/header/userAccount';
import LogoutButton from '~/components/header/logoutButton';
import ThemeToggleButton from '~/components/header/themeToggleButton';
import LanguageSwitcher from '~/components/header/LanguageSelector';

type HeaderProps = {
  onOpenModal: () => void;
};

const Header = ({ onOpenModal }: HeaderProps) => {
  return (
    <header className="flex justify-end items-center w-full h-[60px] px-8 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800 border-b dark:border-gray-700">
      <UserAccount />
      <LanguageSwitcher />
      <ThemeToggleButton />
      <LogoutButton onOpenModal={onOpenModal} />
    </header>
  );
};

export default Header;
