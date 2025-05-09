import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaMusic, FaList } from 'react-icons/fa';
import Footer from '../components/Footer';
import axios from 'axios';

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchAlbumsAndCategories = async () => {
      try {
        const albumResponse = await axios.get(`${baseUrl}/api/albums`);
        setAlbums(albumResponse.data);

        const categoryResponse = await axios.get(`${baseUrl}/api/categories`);
        setCategories(categoryResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching albums or categories', error);
        setLoading(false);
      }
    };

    fetchAlbumsAndCategories();
  }, []);

  const groupAlbumsByCategory = () => {
    return albums.reduce((groups, album) => {
      const category = album.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(album);
      return groups;
    }, {});
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  const groupedAlbums = groupAlbumsByCategory();

  return (
    <>
      <div className="px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Morning</h1>

        {/* Main Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-600 transition">
            <FaHeart className="text-green-400" />
            <span className="text-sm sm:text-base">Liked Songs</span>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-600 transition">
            <FaMusic className="text-blue-400" />
            <span className="text-sm sm:text-base">Dance / Electronic Mix</span>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-600 transition">
            <FaList className="text-purple-400" />
            <span className="text-sm sm:text-base">Your Playlist</span>
          </div>
        </div>

        {/* Albums by Category */}
        {Object.keys(groupedAlbums).map((categoryId) => (
          <div key={categoryId} className="mb-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              {getCategoryName(categoryId)}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {groupedAlbums[categoryId].map((album) => (
                <div
                  key={album._id}
                  className="flex flex-col items-start bg-gray-800 hover:bg-white/20 hover:backdrop-blur-lg transition-colors p-3 sm:p-4 rounded-lg shadow-md border border-green-500"
                  style={{ boxShadow: '0px 0px 10px #00FF00' }}
                >
                  <Link to={`/album/${album._id}`} className="w-full">
                    {album.image ? (
                      <img
                        src={`${baseUrl}${album.image}`}
                        alt={album.name}
                        className="w-full h-36 sm:h-40 object-cover rounded mb-3"
                      />
                    ) : album.backgroundColor ? (
                      <div className="w-full h-36 sm:h-40 rounded mb-3 relative" style={{ backgroundColor: album.backgroundColor }}>
                        <div className="absolute bottom-2 left-2">
                          <FaMusic className="text-green-400 text-xl" />
                          <h3 className="text-white font-bold text-sm mt-2">{album.name}</h3>
                        </div>
                      </div>
                    ) : null}
                  </Link>

                  <div className="w-full">
                    <Link to={`/album/${album._id}`}>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-300 mb-1">
                        {album.description?.length > 36
                          ? `${album.description.slice(0, 36)}...`
                          : album.description}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400">{album.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Home;
