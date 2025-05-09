import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const AddSong = () => {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [image, setImage] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [albumId, setAlbumId] = useState('');
  const [albums, setAlbums] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch albums from the backend
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/albums');
        setAlbums(response.data); // Assuming the response contains an array of albums
      } catch (error) {
        console.error('Error fetching albums', error);
      }
    };

    fetchAlbums();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set the image preview
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudioFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAudioPreview(reader.result); // Set the audio preview (in this case, a URL)
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // To handle file uploads
    formData.append('name', name);
    formData.append('artist', artist);
    formData.append('image', image);
    formData.append('audioFile', audioFile); // Append the audio file
    formData.append('albumId', albumId);

    try {
      const response = await axios.post('http://localhost:5000/api/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating song', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white p-8 border border-teal-200 rounded-lg shadow-xl max-w-md mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-6 text-green-400">Add Song</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Song Name */}
          <div>
            <input
              type="text"
              value={name}
              placeholder="Song Name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 mt-1 bg-green-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {/* Artist Name */}
          <div>
            <input
              type="text"
              value={artist}
              placeholder="Artist Name"
              onChange={(e) => setArtist(e.target.value)}
              required
              className="w-full p-3 mt-1 bg-green-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {/* Image File */}
          <div className="mt-4">
            <div className="relative flex justify-center items-center p-6 bg-green-200 rounded-lg cursor-pointer hover:bg-green-300 transition-colors">
              <input
                type="file"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-black">Choose Image</span>
            </div>
            {imagePreview && (
              <div className="mt-2">
                <img src={imagePreview} alt="Image Preview" className="w-full object-cover rounded-lg" />
              </div>
            )}
          </div>

          {/* Audio File */}
          <div className="mt-4">
            <div className="relative flex justify-center items-center p-6 bg-green-200 rounded-lg cursor-pointer hover:bg-green-300 transition-colors">
              <input
                type="file"
                onChange={handleAudioChange}
                required
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-black">Choose Audio</span>
            </div>
            {audioPreview && (
              <div className="mt-2">
                <audio controls>
                  <source src={audioPreview} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>

          {/* Album Selection */}
          <div>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              required
              className="w-full p-3 mt-1 bg-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Album</option>
              {albums.map((album) => (
                <option key={album._id} value={album._id}>
                  {album.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-green-400 text-black rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Song
          </button>
        </form>
      </div>
    </>
  );
};

export default AddSong;
