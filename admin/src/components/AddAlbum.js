import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";

const AlbumForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [albumData, setAlbumData] = useState({
    name: '',
    backgroundColor: '',
    image: null,
    description: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', albumData.name);
    formData.append('backgroundColor', albumData.backgroundColor);
    formData.append('description', albumData.description);
    formData.append('categoryName', categoryName);
    if (albumData.image) {
      formData.append('image', albumData.image);
    }

    try {
      await axios.post('http://localhost:5000/api/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Album created successfully!');
    } catch (error) {
      console.error('Error creating album:', error);
      alert('Failed to create album.');
    }
  };

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white border border-teal-200 rounded-lg shadow-xl text-white max-w-md mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold mb-6 text-green-400">Create Album</h2>

        {/* Album Name */}
        <input
          type="text"
          placeholder="Album Name"
          value={albumData.name}
          onChange={(e) => setAlbumData({ ...albumData, name: e.target.value })}
          required
          className="w-full p-3 mb-4 bg-green-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Background Color */}
        <input
          type="text"
          placeholder="Background Color (e.g., #1DB954)"
          value={albumData.backgroundColor}
          onChange={(e) => setAlbumData({ ...albumData, backgroundColor: e.target.value })}
          className="w-full p-3 mb-4 bg-green-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Image Upload */}
        <div className="relative mb-4">
          <input
            type="file"
            onChange={(e) => setAlbumData({ ...albumData, image: e.target.files[0] })}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex justify-center items-center p-6 bg-green-200 rounded-lg cursor-pointer hover:bg-green-300 transition-all">
            <span className="text-black">Choose Image</span>
          </div>
          {albumData.image && (
            <div className="mt-2 text-black">
              <img
                src={URL.createObjectURL(albumData.image)}
                alt="Album Preview"
                className="w-full  object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <textarea
          placeholder="Description"
          value={albumData.description}
          onChange={(e) => setAlbumData({ ...albumData, description: e.target.value })}
          maxLength={500}
          className="w-full p-3 mb-4 bg-green-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Category Selection */}
        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-3 mb-4 bg-green-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name} className="bg-green-300 text-black">
              {category.name}
            </option>
          ))}
        </select>

        {/* Create New Category */}
        <input
          type="text"
          placeholder="New Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-3 mb-4 bg-green-200 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full p-3 bg-green-400 text-black font-semibold rounded-lg hover:bg-green-500 transition-all"
        >
          Create Album
        </button>
      </form>
    </>
  );
};

export default AlbumForm;
