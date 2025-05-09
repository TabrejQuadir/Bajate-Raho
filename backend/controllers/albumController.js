const Album = require('../models/AlbumSchema');
const Category = require('../models/CategorySchema');

exports.createAlbum = async (req, res) => {
  try {
    const { name, backgroundColor, image, description, categoryName } = req.body;
    console.log(req.body);

    // Initialize album data with required fields
    const albumData = {
      name,
      description,
    };

    // Add optional fields if provided in the request body
    if (backgroundColor) albumData.backgroundColor = backgroundColor;
    if (image) albumData.image = image; // Image path if provided directly

    // If an image is uploaded, use the file path from the upload
    if (req.file) {
      albumData.image = `/uploads/images/${req.file.filename}`;
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

    res.status(201).json({
      message: 'Album created successfully!',
      album,
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ error: error.message });
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

