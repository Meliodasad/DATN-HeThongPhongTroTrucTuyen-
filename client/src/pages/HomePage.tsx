import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import PostList from '../components/PostList';
import React from 'react';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SidebarLeft />
        <PostList />
      </div>

      <div style={{ flex: 1 }}>
        <SidebarRight />
      </div>
    </div>
  );
};

export default HomePage;
