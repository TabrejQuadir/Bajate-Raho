import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        // Fetch album details
        const response = await axios.get(`${baseUrl}/api/albums/${id}`);
        setAlbum(response.data);

        // Fetch category details
        const categoryId = response.data.category; // Assuming this is the category ID
        const categoryResponse = await axios.get(`${baseUrl}/api/categories/${categoryId}`);
        const categoryName = categoryResponse.data.name;
        setCategoryName(categoryName);

        // Fetch songs details
        const songRequests = response.data.songs.map(async (songId) => {
          const songResponse = await axios.get(`${baseUrl}/api/songs/${songId}`);
          return songResponse.data;
        });

        const songDetails = await Promise.all(songRequests);
        setSongs(songDetails);
      } catch (error) {
        console.error('Error fetching album details', error);
      }
    };

    fetchAlbumDetails();
  }, [id]);


  if (!album) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700 animate-pulse">
        Loading...
      </div>
    );
  }

  const handleAddSong = () => {
    navigate('/add-song');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  return (
    <div className="h-fit min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="fixed top-5 left-5 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-2xl transition-transform transform hover:bg-green-800  focus:outline-none  z-10"
      >
        ← Back
      </button>

      <div className="px-32 md:px-32 py-4">
        {/* Album Card */}
        <div className="shadow-2xl rounded-2xl p-6 bg-gradient-to-r from-green-200 via-green-400 to-green-200 flex flex-col md:flex-row gap-6 animate-fade-in">
          {/* Album Image */}
          <div className="w-full md:w-1/3 bg-gray-200 rounded-lg overflow-hidden shadow-lg transform  transition-transform duration-500">
            {album.image && (
              <img
                src={`${baseUrl}${album.image}`}
                alt={album.name}
                className="w-full h-full object-cover"
              />
            )}
            {album.backgroundColor && (
              <div
                className="w-full h-full object-cover" style={{ backgroundColor: album.backgroundColor }}
              ></div>
            )}
          </div>

          {/* Album Details */}
          <div className="flex-1 bg-gray-900 p-8 rounded-xl shadow-2xl transform transition-transform duration-800">
            <h1 className="text-5xl font-extrabold text-white">{album.name}</h1>

            {/* Album Creation Info */}
            <div className="flex items-center mt-4 space-x-3">
              <div className="flex items-center bg-green-500 text-white font-semibold px-3 py-1 rounded-full shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6 2a1 1 0 00-1 1v1H4a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1h-1V3a1 1 0 00-1-1H6zm3 12H7v-2h2v2zm4 0h-2v-2h2v2zm0-4H7V8h6v2z" />
                </svg>
                Created
              </div>
              <p className="text-gray-400 text-sm font-medium">
                {new Date(album.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Album Category */}
            <div className="mt-4">
              <div className="mt-4">
                <p className="text-lg font-bold text-green-400">
                  Category: <span className="text-white">{categoryName}</span>
                </p>
              </div>

            </div>

            {/* Album Total Duration */}
            <div className="mt-2">
              <p className="text-lg font-bold text-green-400">
                Total Duration:{" "}
                <span className="text-white">
                  {album.totalDuration ? `${formatDuration(album.totalDuration)} min` : "0:00"}
                </span>
              </p>
            </div>

            {/* Album Description */}
            <div className="mt-6 border-t border-gray-700 pt-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                {album.description || (
                  <span className="text-gray-500 italic">
                    No description available for this album.
                  </span>
                )}
              </p>
            </div>

            {/* Buttons Section */}
            <div className="mt-8 flex space-x-4">
              <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-transform duration-300 font-semibold hover:scale-105">
                Play All Songs
              </button>
              <button className="bg-gray-800 text-gray-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-lg hover:scale-105 transition-transform duration-300 font-semibold">
                Add to Playlist
              </button>
            </div>
          </div>

        </div>

        {/* Songs List */}
        <div className="mt-10 shadow-2xl rounded-2xl p-8 bg-gradient-to-r from-green-200 via-green-400 to-green-200">
          <h2 className="text-4xl font-semibold text-gray-900 mb-6">
            Songs in this Album
          </h2>
          <ul className="space-y-6">
            {songs.map((song) => (
              <li
                key={song._id}
                className="flex items-center p-4 bg-gray-800 border-gray-600 rounded-lg shadow-xl "
              >
                {/* Song Cover Image */}
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                  <img
                    src={`${baseUrl}${song.image}`}
                    alt={song.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Song Details */}
                <div className="ml-6 flex-1">
                  <h3 className="text-xl font-bold text-white">{song.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">By {song.artist}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Released: {new Date(song.releaseDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Styled Audio Player */}
                {song.audioUrl ? (
                  <div className="flex items-center ml-auto md:w-[400px]">
                    <div className="w-full md:w-[400px] p-2 rounded-xl ">
                      <audio
                        controls
                        className="w-full bg-transparent text-white focus:outline-none rounded-3xl"
                        src={`${baseUrl}${song.audioUrl}`}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                ) : (
                  <p className="text-red-500 ml-6">Audio file not available</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fixed Add Song Button */}
      <button
        onClick={handleAddSong}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full shadow-xl transition-all transform hover:scale-105 focus:outline-none "
      >
        Add Song
      </button>
    </div>
  );
};

export default AlbumDetails;
