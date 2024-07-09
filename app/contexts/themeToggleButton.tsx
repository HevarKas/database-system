import { useTheme } from '~/contexts/themeProvider';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-transparent text-gray-700 dark:text-gray-300"
    >
      {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
    </button>
  );
};

export default ThemeToggleButton;
