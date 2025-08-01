import express from 'express';
import { createFolder, getFolderById, getFolderFiles, getUserFolders } from '../controllers/folderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createFolder);
router.get('/', protect, getUserFolders);
router.get('/:folderId/files', protect, getFolderFiles);
router.get('/:id', protect, getFolderById);

export default router;
