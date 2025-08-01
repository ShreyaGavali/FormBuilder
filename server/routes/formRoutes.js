import express from 'express';
import {
  createForm,
  getAllForms,
  getConditionSummary,
  getFormById,
  getFormOwnerEmail,
  getFormsByFolderId,
  getFormViewStats,
  getSharedForms,
  logFormView,
  shareForm,
  updateForm,
  updateFormHandler
} from '../controllers/formController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkFormAccess } from '../middleware/checkFormAccess.js';

const router = express.Router();

// Routes
router.post('/', protect, createForm);         // Create new form
router.get('/', protect, getAllForms);         // Get all forms of logged-in user
router.get('/shared', protect, getSharedForms);
router.get('/:formId/conditions-summary', getConditionSummary);
router.get('/:id', protect, getFormById); 
router.get('/view/:id', getFormById);
router.get('/folder/:folderId', protect, getFormsByFolderId);  
router.get('/:id/owner-email', getFormOwnerEmail);   
router.put('/:id', protect, updateForm);       // Update form by ID
router.put('/form/:formId/edit',protect, checkFormAccess('edit'), updateFormHandler);
router.post('/form/:formId/share',protect, checkFormAccess('share'), shareForm);
router.post('/:id/view', logFormView);
router.get('/:id/view-stats', getFormViewStats);


export default router;
