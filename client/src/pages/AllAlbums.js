import React from 'react';
import { useParams, Link } from 'react-router-dom';
import albumsData from '../albums.json'; // Assuming you have this JSON file with album categories
import Footer from '../../src/components/Footer'

const AllAlbumsPage = () => {
  // Get the category from the URL params
  const { categoryName } = useParams();

  // Find the category based on the URL parameter
  const category = albumsData.find(section => section.category.toLowerCase().replace(" ", "-") === categoryName);

  if (!category) {
    return <div className="text-center text-red-500">Category not found.</div>;
  }

  return (
    <>
      <div className="p-8">
        <h2 className="text-3xl font-bold mt-10 mb-12 text-white">{category.category}</h2>
        <div className="grid grid-cols-6 gap-4 mb-8">
          {category.albums.map((album) => (
            <div key={album.id} className="flex flex-col ">
              <Link to={`/album/${album.id}`}>
                <div
                  className={`p-4 rounded-lg cursor-pointer relative w-full h-44 flex items-center justify-center ${category.category === "Featured Albums" ? '' : 'bg-gray-200'
                    }`}
                  style={{
                    background: category.category === "Featured Albums" ? album.backgroundColor : 'transparent',
                  }}
                >
                  {/* Render image only if it's "Popular Now", else render background color */}
                  {category.category === "Popular Now" && album.imageUrl ? (
                    <img
                      src={album.imageUrl} // Use the imageUrl from the album data
                      alt={album.name}
                      className="rounded w-full  object-cover"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: album.backgroundColor }} />
                  )}
                  <h3 className="text-lg font-semibold text-white absolute bottom-8 left-4">{album.name}</h3>
                </div>
                <p className="text-sm text-gray-400  ml-4 font-semibold">{album.artist}</p>
              </Link>
            </div>
          ))}
        </div>
        <Footer />
      </div>

    </>
  );
};

export default AllAlbumsPage;
