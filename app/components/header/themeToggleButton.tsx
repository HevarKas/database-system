import { FiSun, FiMoon } from 'react-icons/fi';
import { Button } from '~/components/ui/button';
import { useTheme } from '~/contexts/themeProvider';

const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const buttonClasses = 'bg-transparent text-gray-700 dark:text-gray-300';

  return (
    <Button variant="link" onClick={toggleTheme} className={buttonClasses}>
      {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
    </Button>
  );
};

export default ThemeToggleButton;
