const Album = require('../models/AlbumSchema');
const Category = require('../models/CategorySchema');

exports.createAlbum = async (req, res) => {
  try {
    const { name, backgroundColor, description, categoryName } = req.body;

    // Initialize album data with required fields
    const albumData = {
      name,
      description,
      backgroundColor: backgroundColor || '#000000', // Default black if not provided
    };

    // Add Cloudinary image URL if image was uploaded
    if (req.file) {
      albumData.image = req.file.path;
    }

    // Check if category exists or create a new one
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = new Category({ name: categoryName });
      await category.save();
    }

    // Assign the category to the album
    albumData.category = category._id;

    // Create and save the album
    const album = new Album(albumData);
    await album.save();

    // Return populated album data
    const populatedAlbum = await Album.findById(album._id)
      .populate('category')
      .populate('songs');

    res.status(201).json({
      success: true,
      message: 'Album created successfully!',
      album: populatedAlbum
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating album',
      error: error.message 
    });
  }
};


exports.getAlbums = async (req, res) => {
    try {
        const albums = await Album.find().populate('songs');
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controller function to get a single album by its ID
exports.getAlbumById = async (req, res) => {
    const { id } = req.params; // Extract the album ID from the URL params

    try {
        const album = await Album.findById(id); // Fetch the album by its ID

        if (!album) {
            return res.status(404).json({ message: 'Album not found' });
        }

        res.status(200).json(album); // Return the album data
    } catch (error) {
        console.error('Error fetching album by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
