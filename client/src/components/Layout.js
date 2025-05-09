import Sidebar from './Sidebar';
import Player from './Player';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-full bg-black text-white">
      {/* Sidebar: hidden on small screens, shown on medium and up */}
      <div className="md:block w-64 ">
        <Sidebar />
      </div>
      

      {/* Main content and Navbar */}
      <div className="flex flex-col flex-1">
        
      <Navbar />
        {/* Main content area with scrollable view */}
        <main className="flex-1 overflow-y-auto px-4 py-2 md:py-4">
          {children}
        </main>
      </div>

      {/* Player bar pinned to bottom on small screens */}
      <div className="w-full md:w-auto">
        <Player />
      </div>
    </div>
  );
};

export default Layout;
