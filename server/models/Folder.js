import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
   files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form', // replace 'Form' with the actual name of your form model
    }
  ]
}, { timestamps: true });

export default mongoose.model('Folder', folderSchema);
