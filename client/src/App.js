import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AllAlbumsPage from './pages/AllAlbums';  // All albums page by category
import AlbumPage from './pages/AlbumPage';      // Individual album page
import Profile from './pages/Profile';          // Profile page
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  return (
    <Router>
      <PlaylistProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          {/* Route to display all albums based on category */}
          <Route path="/albums/:categoryName" element={<Layout><AllAlbumsPage /></Layout>} />
          {/* Route for a specific album */}
          <Route path="/album/:albumId" element={<Layout><AlbumPage /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </PlaylistProvider>
    </Router>
  );
}

export default App;
