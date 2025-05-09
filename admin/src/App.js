import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddAlbum from './components/AddAlbum';
import AddSong from './components/AddSong';
import AlbumList from './components/AlbumList';
import AlbumDetails from './components/AlbumDetails'; // Import the AlbumDetails component
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<AlbumList />} />
          <Route path="/add-album" element={<AddAlbum />} />
          <Route path="/add-song" element={<AddSong />} />
          <Route path="/album/:id" element={<AlbumDetails />} /> {/* Dynamic route for album details */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
