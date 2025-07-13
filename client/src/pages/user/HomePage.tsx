import React from 'react'; 
import SidebarLeft from '../../components/SidebarLeft';
import PostList from '../../components/PostList';
import SidebarRight from '../../components/SidebarRight';
import '../../css/HomePage.css'

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="main-content">
        <SidebarLeft />
        <PostList />
      </div>

      <div className="side-content">
        <SidebarRight />
      </div>
    </div>
  );
};

export default HomePage;
