import { NavLink } from 'react-router-dom';
import { HiDocumentReport } from 'react-icons/hi';
import { PiBooksFill } from 'react-icons/pi';
import { MdWorkHistory } from 'react-icons/md';
import classNames from 'classnames';
import { Tooltip } from 'react-tooltip';

const Sidebar = () => {
  return (
    <aside className="flex h-screen">
      <div className="flex flex-col items-center pt-8 gap-10 bg-gray-200 dark:bg-gray-800 w-24 flex-shrink-0">
        Logo
        <nav className="py-4 flex flex-col items-center gap-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-12 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700',
                { 'bg-gray-300 dark:bg-gray-700': isActive },
              )
            }
            data-tooltip-id="dashboard-tooltip"
            data-tooltip-content="Dashboard"
          >
            <HiDocumentReport size={32} />
          </NavLink>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-12 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700',
                { 'bg-gray-300 dark:bg-gray-700': isActive },
              )
            }
            data-tooltip-id="category-tooltip"
            data-tooltip-content="Category"
          >
            <PiBooksFill size={32} />
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              classNames(
                'flex justify-center items-center h-12 w-12 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700',
                { 'bg-gray-300 dark:bg-gray-700': isActive },
              )
            }
            data-tooltip-id="history-tooltip"
            data-tooltip-content="History"
          >
            <MdWorkHistory size={32} />
          </NavLink>
        </nav>
      </div>
      <Tooltip
        id="dashboard-tooltip"
        place="right"
        className="dark:bg-gray-300 dark:text-gray-700"
      />
      <Tooltip
        id="category-tooltip"
        place="right"
        className="dark:bg-gray-300 dark:text-gray-700"
      />
      <Tooltip
        id="history-tooltip"
        place="right"
        className="dark:bg-gray-300 dark:text-gray-700"
      />
    </aside>
  );
};

export default Sidebar;
