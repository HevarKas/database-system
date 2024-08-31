import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { HiDocumentReport } from 'react-icons/hi';
import { PiBooksFill } from 'react-icons/pi';
import { MdCategory, MdOutlinePointOfSale } from 'react-icons/md';
import classNames from 'classnames';
import { Tooltip } from 'react-tooltip';
import AKlogo from '~/assets/AKlogo';
import { useTheme } from '~/contexts/themeProvider';

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = useCallback((id: string) => {
    setTooltip(id);
    setShowTooltip(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setShowTooltip(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showTooltip) {
      timer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000); // Tooltip shows for 3 seconds
    }
    return () => clearTimeout(timer);
  }, [showTooltip]);

  return (
    <aside className="flex h-screen overflow-hidden">
      <div className="flex flex-col items-center gap-4 bg-gray-200 dark:bg-gray-800 w-24 flex-shrink-0">
        <AKlogo isDarkMode={isDarkMode} height={100} width={100} />
        <nav className="py-4 flex flex-col items-center gap-2 w-full">
          <NavLink
            to="/dashboard"
            onMouseEnter={() => handleMouseEnter('dashboard-tooltip')}
            onMouseLeave={handleMouseLeave}
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group',
                {
                  'border-l-4': isActive,
                  'border-black': isActive && !isDarkMode,
                  'border-white': isActive && isDarkMode,
                  'bg-gray-300 dark:bg-gray-700': isActive,
                },
              )
            }
            data-tooltip-id="dashboard-tooltip"
            data-tooltip-content="Dashboard"
          >
            <HiDocumentReport size={32} />
          </NavLink>
          <NavLink
            to="/category"
            onMouseEnter={() => handleMouseEnter('category-tooltip')}
            onMouseLeave={handleMouseLeave}
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group',
                {
                  'border-l-4': isActive,
                  'border-black': isActive && !isDarkMode,
                  'border-white': isActive && isDarkMode,
                  'bg-gray-300 dark:bg-gray-700': isActive,
                },
              )
            }
            data-tooltip-id="category-tooltip"
            data-tooltip-content="Category"
          >
            <MdCategory size={32} />
          </NavLink>
          <NavLink
            to="/books"
            onMouseEnter={() => handleMouseEnter('book-tooltip')}
            onMouseLeave={handleMouseLeave}
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group',
                {
                  'border-l-4': isActive,
                  'border-black': isActive && !isDarkMode,
                  'border-white': isActive && isDarkMode,
                  'bg-gray-300 dark:bg-gray-700': isActive,
                },
              )
            }
            data-tooltip-id="book-tooltip"
            data-tooltip-content="Book"
          >
            <PiBooksFill size={32} />
          </NavLink>
          <NavLink
            to="/orders"
            onMouseEnter={() => handleMouseEnter('order-tooltip')}
            onMouseLeave={handleMouseLeave}
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group',
                {
                  'border-l-4': isActive,
                  'border-black': isActive && !isDarkMode,
                  'border-white': isActive && isDarkMode,
                  'bg-gray-300 dark:bg-gray-700': isActive,
                },
              )
            }
            data-tooltip-id="order-tooltip"
            data-tooltip-content="Order"
          >
            <MdOutlinePointOfSale size={32} />
          </NavLink>
        </nav>
      </div>
      {showTooltip && (
        <Tooltip
          id={tooltip || ''}
          place="right"
          className="dark:bg-gray-300 dark:text-gray-700 z-10"
        />
      )}
    </aside>
  );
};

export default Sidebar;
