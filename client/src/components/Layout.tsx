import React, { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsSidebar from './StatsSidebar';
import { useStats } from '../hooks/useStats';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { userStats, roomStats } = useStats();
  
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <Sidebar sidebarOpen={sidebarOpen} />
      
      <div className="flex-1 flex flex-col relative">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="flex-1 flex">
          <main className={`flex-1 overflow-auto ${isDashboard ? '' : 'p-6'}`}>
            {children}
          </main>

          {/* Stats Sidebar - only show on dashboard */}
          {isDashboard && (
            <StatsSidebar userStats={userStats} roomStats={roomStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;