import { v2 as cloudinary } from 'cloudinary';
import albumModel from '../models/albumModel.js';

const addAlbum = async (req, res) => {
  try {
    // Extract data from request
    const { name, desc, bgColour } = req.body;
    const imageFile = req.file;

    // Check if image is provided
    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const albumData = {
      name,
      desc,
      bgColour,
      image: imageUpload.secure_url,
    };

    // Create new album and save to database
    const album = new albumModel(albumData);
    await album.save();

    // Send success response
    res.json({ success: true, message: "Album added successfully!" });
  } catch (error) {
    console.error("Error adding album:", error); // Log error for debugging
    res.status(500).json({ success: false, message: "Error occurred while adding album" });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({ success: true, albums: allAlbums });
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ success: false, message: "Error occurred while fetching albums" });
  }
};

const removeAlbum = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, message: "Album ID is required" });
    }

    const deletedAlbum = await albumModel.findByIdAndDelete(id);
    if (!deletedAlbum) {
      return res.status(404).json({ success: false, message: "Album not found" });
    }

    res.json({ success: true, message: "Album removed successfully" });
  } catch (error) {
    console.error("Error removing album:", error);
    res.status(500).json({ success: false, message: "Error occurred while removing album" });
  }
};

export { addAlbum, listAlbum, removeAlbum };
