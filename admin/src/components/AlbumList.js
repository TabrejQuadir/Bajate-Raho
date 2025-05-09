import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaMusic } from "react-icons/fa";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/albums");
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums", error);
      }
    };
    fetchAlbums();
  }, []);

  // Helper function to format seconds to mm:ss
  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to handle both number and mm:ss formats for song duration
  const parseDuration = (duration) => {
    // If the duration is in seconds (number format), use it directly
    if (!isNaN(duration)) {
      return parseFloat(duration);
    }
    
    // If the duration is in mm:ss format, convert to seconds
    const parts = duration.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      return minutes * 60 + seconds;
    }

    return 0; // Return 0 if the format is invalid
  };

  return (
    <div className="bg-gradient-to-r from-green-50 via-gray-100 to-green-50 text-gray-900 min-h-screen py-10 px-6">
      <h2 className="text-5xl font-extrabold text-center mb-10 text-green-600 drop-shadow-md">
        <FaMusic className="inline-flex mr-6" />
        Bajate Raho Admin
      </h2>

      {/* Table Header */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Serial
              </th>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Name
              </th>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Description
              </th>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Songs
              </th>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Total Duration
              </th>
              <th className="px-4 py-3 text-lg font-bold border-b border-green-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album, index) => {
              // Calculate total duration of all songs in the album
              const totalDuration = album.songs.reduce((acc, song) => {
                const songDuration = parseDuration(song.duration); // Parse the song duration
                console.log("Duration for song:", songDuration); // Log the parsed duration
                return acc + songDuration;
              }, 0);

              return (
                <tr
                  key={album._id}
                  className={`transition-colors duration-300 ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-green-100`}
                >
                  {/* Serial Number */}
                  <td className="px-4 py-3 border-b border-gray-300 text-gray-800 text-center">
                    {index + 1}
                  </td>

                  {/* Album Name */}
                  <td className="px-4 py-3 border-b border-gray-300 font-semibold text-green-700">
                    {album.name}
                  </td>

                  {/* Album Description */}
                  <td className="px-4 py-3 border-b border-gray-300 text-gray-600">
                    {album.description || (
                      <span className="italic text-gray-400">
                        No description available
                      </span>
                    )}
                  </td>

                  {/* Song List */}
                  <td className="px-4 py-3 border-b border-gray-300 text-gray-600">
                    {album.songs.length > 0 ? (
                      <span className="text-gray-800 font-semibold">
                        {album.songs.length} Songs
                      </span>
                    ) : (
                      <span className="italic text-gray-400">No songs</span>
                    )}
                  </td>

                  {/* Total Duration */}
                  <td className="px-4 py-3 border-b border-gray-300 text-gray-600">
                    {formatDuration(totalDuration)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 border-b border-gray-300 text-center">
                    <Link to={`/album/${album._id}`}>
                      <button
                        className="bg-green-600 text-white py-1 px-4 rounded-full hover:bg-green-700 transition-colors duration-200"
                        title="View Album Details"
                      >
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating Button to Add Album */}
      <Link to="/add-album">
        <button
          className="flex items-center gap-2 fixed bottom-10 right-10 bg-green-600 text-white p-5 rounded-full shadow-lg hover:bg-green-700 hover:shadow-2xl transition-all duration-300 "
          aria-label="Add Album"
        >
          <FaPlus size={20} />
          <span className="hidden md:block font-semibold">Add Album</span>
        </button>
      </Link>
    </div>
  );
};

export default AlbumList;
