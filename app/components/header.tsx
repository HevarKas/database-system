import ThemeToggleButton from '~/contexts/themeToggleButton';
import { FiLogOut } from 'react-icons/fi';
import { Link } from '@remix-run/react';

const Header = () => {
  return (
    <header className="flex justify-end items-center gap-8 bg-gray-100 dark:bg-gray-700 w-full h-[60px] px-8">
      <div className="hidden sm:block">The name</div>
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
