import ThemeToggleButton from '~/contexts/themeToggleButton';
import { FiLogOut } from 'react-icons/fi';
import { Link } from '@remix-run/react';
import AKlogo from '~/assets/AKlogo';
import { useTheme } from '~/contexts/themeProvider';

const Header = () => {
  const { isDarkMode } = useTheme();

  return (
    <header className="flex justify-end items-center gap-8 bg-gray-100 dark:bg-gray-700 w-full h-[60px] px-8">
      <div className="hidden sm:flex sm:items-center sm:gap-3">
        <figure className="bg-gray-200 dark:bg-gray-800 rounded-full">
          <AKlogo isDarkMode={isDarkMode} height={35} width={35} />
        </figure>
        Ahmed Koye
      </div>
      <ThemeToggleButton />
      <Link
        to="/logout"
        className="bg-transparent text-red-700 dark:text-red-300"
      >
        <FiLogOut size={24} />
      </Link>
    </header>
  );
};

export default Header;
