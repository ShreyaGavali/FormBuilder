import Form from "../models/Form.js";
import User from "../models/User.js";

// export const checkFormAccess = (requiredAccess) => {
//   return async (req, res, next) => {
//     const userId = req.user._id;
//     const { formId } = req.params;

//     const user = await User.findById(userId);

//     const formAccess = user.sharedForms.find(
//       (item) => item.form.toString() === formId
//     );

//     if (!formAccess) {
//       return res.status(403).json({ message: 'Access denied: no permission.' });
//     }

//     const accessHierarchy = { view: 1, edit: 2, share: 3 };

//     if (accessHierarchy[formAccess.access] < accessHierarchy[requiredAccess]) {
//       return res.status(403).json({ message: 'Access denied: insufficient permission.' });
//     }

//     next();
//   };
// };

export const checkFormAccess = (requiredAccess) => {
  return async (req, res, next) => {
    const userId = req.user._id;
    const { formId } = req.params;

    const user = await User.findById(userId);
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // ✅ Allow owner to bypass check
    if (form.createdBy.toString() === userId.toString()) {
      return next();
    }

    const formAccess = user.sharedForms.find(
      (item) => item.form.toString() === formId
    );

    const accessHierarchy = { view: 1, edit: 2, share: 3 };

    if (!formAccess || accessHierarchy[formAccess.access] < accessHierarchy[requiredAccess]) {
      return res.status(403).json({ message: 'Access denied: insufficient permission.' });
    }

    next();
  };
};

