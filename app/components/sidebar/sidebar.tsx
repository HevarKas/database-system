import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import AKlogo from '~/assets/AKlogo';

import { PiBooksFill } from 'react-icons/pi';
import { HiDocumentReport } from 'react-icons/hi';
import { MdCategory, MdOutlinePointOfSale } from 'react-icons/md';

import useTooltip from '~/contexts/useTooltip';
import { useTheme } from '~/contexts/themeProvider';

const Sidebar = () => {
  const { isDarkMode } = useTheme();
  const { tooltip, showTooltip, handleMouseEnter, handleMouseLeave } =
    useTooltip();

  const navItems = [
    {
      to: '/dashboard',
      icon: <HiDocumentReport size={32} />,
      tooltipId: 'dashboard-tooltip',
      label: 'Dashboard',
    },
    {
      to: '/category',
      icon: <MdCategory size={32} />,
      tooltipId: 'category-tooltip',
      label: 'Category',
    },
    {
      to: '/books',
      icon: <PiBooksFill size={32} />,
      tooltipId: 'book-tooltip',
      label: 'Book',
    },
    {
      to: '/orders',
      icon: <MdOutlinePointOfSale size={32} />,
      tooltipId: 'order-tooltip',
      label: 'Order',
    },
  ];

  return (
    <aside className="flex h-screen overflow-hidden">
      <div className="flex flex-col items-center gap-4 bg-gray-200 dark:bg-gray-800 w-24 flex-shrink-0">
        <AKlogo isDarkMode={isDarkMode} height={100} width={100} />
        <nav className="py-4 flex flex-col items-center w-full">
          {navItems.map(({ to, icon, tooltipId, label }) => (
            <NavLink
              key={to}
              to={to}
              onMouseEnter={() => handleMouseEnter(tooltipId)}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) =>
                classNames(
                  'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group py-8',
                  {
                    'border-l-4': isActive,
                    'border-black': isActive && !isDarkMode,
                    'border-white': isActive && isDarkMode,
                    'bg-gray-300 dark:bg-gray-700': isActive,
                  },
                )
              }
              data-tooltip-id={tooltipId}
              data-tooltip-content={label}
            >
              {icon}
            </NavLink>
          ))}
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
