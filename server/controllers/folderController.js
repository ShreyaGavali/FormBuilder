// import Folder from '../models/Folder.js';

// export const createFolder = async (req, res) => {
//   const { name } = req.body;
//   const userId = req.user._id;

//   try {
//     const folder = await Folder.create({ name, createdBy: userId });
//     res.status(201).json(folder);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to create folder", error: err.message });
//   }
// };

// export const getUserFolders = async (req, res) => {
//   try {
//     const folders = await Folder.find({ createdBy: req.user._id });
//     res.json(folders);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch folders" });
//   }
// };

import Folder from '../models/Folder.js';

export const createFolder = async (req, res) => {
  const { name, files = [] } = req.body; // Optional files during creation
  const userId = req.user._id;

  try {
    const folder = await Folder.create({
      name,
      createdBy: userId,
      files, // optional: you can leave it empty or pass form IDs if needed
    });
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ message: "Failed to create folder", error: err.message });
  }
};

export const getUserFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ createdBy: req.user._id }).populate('files');
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch folders", error: err.message });
  }
};

export const getFolderFiles = async (req, res) => {
  const { folderId } = req.params;

  try {
    const folder = await Folder.findById(folderId).populate('files');

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.status(200).json(folder.files);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching files from folder',
      error: err.message,
    });
  }
};

export const getFolderById = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};