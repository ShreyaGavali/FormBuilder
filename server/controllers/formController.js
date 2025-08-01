import Form from '../models/Form.js';
import User from '../models/User.js';

export const createForm = async (req, res) => {
  try {
    const { title, folderId, pages } = req.body;
    const userId = req.user._id;

    const newForm = await Form.create({
      title,
      folder: folderId || null,
      pages,
      createdBy: userId
    });

    res.status(201).json(newForm);
  } catch (err) {
    res.status(500).json({ message: 'Error creating form', error: err.message });
  }
};

export const getAllForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const forms = await Form.find({ createdBy: userId }).populate('folder');
    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching forms', error: err.message });
  }
};

export const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.status(200).json(form);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching form', error: err.message });
  }
};

export const getFormsByFolderId = async (req, res) => {
  const { folderId } = req.params;

  try {
    const forms = await Form.find({ folder: folderId }).populate('folder');

    res.status(200).json(forms);
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching forms for this folder',
      error: err.message,
    });
  }
};

export const updateForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const { pages, conditions } = req.body;

    const update = {};
    if (pages !== undefined) update.pages = pages;
    if (conditions !== undefined) update.conditions = conditions;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }

    const updatedForm = await Form.findByIdAndUpdate(formId, update, { new: true });

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json(updatedForm);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update form', error: err.message });
  }
};

export const getConditionSummary = async (req, res) => {
  const { formId } = req.params;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const summary = form.conditions.map((condition, index) => ({
      conditionNumber: index + 1,
      pageId: condition.pageId,
      rules: condition.rules.map(({ questionId, option }) => ({ questionId, option })),
      ifTruePageId: condition.ifTrue,
      ifFalsePageId: condition.ifFalse,
    }));

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching condition summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getFormOwnerEmail = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).select('createdBy');

    if (!form) return res.status(404).json({ message: 'Form not found' });

    const user = await User.findById(form.createdBy).select('email');

    if (!user) return res.status(404).json({ message: 'Owner not found' });

    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching owner email', error: err.message });
  }
};


export const shareForm = async (req, res) => {
  const { formId, shares } = req.body;

  if (!formId || !Array.isArray(shares)) {
    return res.status(400).json({ message: 'formId and shares are required.' });
  }

  try {
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found.' });

    const result = [];

    for (let { email, access } of shares) {
      const user = await User.findOne({ email });

      if (user) {
        const existingShareIndex = user.sharedForms.findIndex(
          (item) => item.form.toString() === formId
        );

        if (existingShareIndex !== -1) {
          // Update existing access if different
          user.sharedForms[existingShareIndex].access = access;
        } else {
          // Add new shared form
          user.sharedForms.push({ form: formId, access });
        }

        await user.save();
        result.push({ email, status: 'shared', access });
      } else {
        result.push({ email, status: 'not found' });
      }
    }

    res.status(200).json({
      message: 'Sharing process completed with access control.',
      result,
    });
  } catch (error) {
    console.error('Error sharing form with access control:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const updateFormHandler = async (req, res) => {
  const { formId } = req.params;
  const updateData = req.body; // Could include title, pages, conditions, etc.

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      updateData,
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json({
      message: 'Form updated successfully',
      form: updatedForm,
    });
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSharedForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('sharedForms.form');

    const sharedForms = user.sharedForms.map((entry) => ({
      form: entry.form,
      access: entry.access,
    }));

    res.status(200).json(sharedForms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shared forms', error: error.message });
  }
};

export const logFormView = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    form.viewLogs.push({ timestamp: new Date() });
    await form.save();

    res.status(200).json({ message: 'View recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFormViewStats = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const logs = form.viewLogs || [];

    // Total views
    const totalViews = logs.length;

    // Average views per hour (for last 24 hrs)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentLogs = logs.filter(log => log.timestamp > oneDayAgo);
    const avgViewsPerHour = recentLogs.length / 24;

    // Time ranges for chart (label + views)
    const now = Date.now();
    const timeRanges = [
      { label: '+2hr', range: 2 * 60 * 60 * 1000 },
      { label: '+6hr', range: 6 * 60 * 60 * 1000 },
      { label: '+12hr', range: 12 * 60 * 60 * 1000 },
      { label: '+24hr', range: 24 * 60 * 60 * 1000 },
      { label: '+1 Day', range: 1 * 24 * 60 * 60 * 1000 },
      { label: '+4 Day', range: 4 * 24 * 60 * 60 * 1000 },
      { label: '+12 Day', range: 12 * 24 * 60 * 60 * 1000 },
    ];

    const viewTimeline = timeRanges.map(({ label, range }) => {
      const cutoff = new Date(now - range);
      return {
        label,
        views: logs.filter(log => log.timestamp >= cutoff).length,
      };
    });

    res.status(200).json({
      totalViews,
      avgViewsPerHour,
      viewTimeline,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

