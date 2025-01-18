import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

import AKlogo from '~/assets/AKlogo';

import { PiBooksFill } from 'react-icons/pi';
import { GrTransaction } from "react-icons/gr";
import { HiDocumentReport } from 'react-icons/hi';
import { MdCategory, MdOutlinePointOfSale } from 'react-icons/md';


import useTooltip from '~/contexts/useTooltip';
import { useTheme } from '~/contexts/themeProvider';
import { useLanguage } from '~/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ role }: { role: string | null }) => {
  const { isDarkMode } = useTheme();
  const { tooltip, showTooltip, handleMouseEnter, handleMouseLeave } =
    useTooltip();
  const { rtl } = useLanguage();
  const { t } = useTranslation();

  const dashboardLabel = t('navbar.dashboard');
  const bookLabel = t('navbar.book');
  const orderLabel = t('navbar.order');
  const categoryLabel = t('navbar.category');
  const transactionLabel = t('navbar.transaction');

  const navItems = [
    {
      to: '/dashboard',
      icon: <HiDocumentReport size={32} />,
      tooltipId: 'dashboard-tooltip',
      label: dashboardLabel,
    },
    {
      to: '/category',
      icon: <MdCategory size={32} />,
      tooltipId: 'category-tooltip',
      label: categoryLabel,
    },
    {
      to: '/books',
      icon: <PiBooksFill size={32} />,
      tooltipId: 'book-tooltip',
      label: bookLabel,
    },
    {
      to: '/orders',
      icon: <MdOutlinePointOfSale size={32} />,
      tooltipId: 'order-tooltip',
      label: orderLabel,
    },
    {
      to: '/transaction',
      icon: <GrTransaction size={32} />,
      tooltipId: 'transaction-tooltip',
      label: transactionLabel,
    },
  ];

  const filteredNavItems = role === 'admin' ? navItems : navItems.filter(item => item.to !== '/dashboard');

  return (
    <aside className="flex h-screen overflow-hidden flex-shrink-0">
      <div className="flex flex-col items-center gap-4 bg-gray-200 dark:bg-gray-800 w-24">
        <AKlogo isDarkMode={isDarkMode} height={100} width={100} />
        <nav className="py-4 flex flex-col items-center w-full">
          {filteredNavItems.map(({ to, icon, tooltipId, label }) => (
            <NavLink
              key={to}
              to={to}
              onMouseEnter={() => handleMouseEnter(tooltipId)}
              onMouseLeave={handleMouseLeave}
              className={({ isActive }) =>
                classNames(
                  'flex justify-center items-center h-12 w-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 relative group py-8',
                  {
                    'border-l-4': !rtl,
                    'border-r-4': rtl,
                    'border-transparent': !isActive,
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
