import mongoose from 'mongoose';

const conditionRuleSchema = new mongoose.Schema({
  questionId: Number,
  option: String,
}, { _id: false });

const conditionSchema = new mongoose.Schema({
  pageId: Number, // the source page where the condition applies
  rules: [conditionRuleSchema], // list of question+option to match
  ifTrue: Number, // redirect to pageId if condition is true
  ifFalse: Number, // redirect to pageId if condition is false
}, { _id: false });

const optionSchema = new mongoose.Schema({
  label: String,
}, { _id: false });

const questionDataSchema = new mongoose.Schema({
  label: String,
  type: String,
  options: [optionSchema],
  starCount: Number,
}, { _id: false });

const contentBlockSchema = new mongoose.Schema({
  id: Number,
  type: {
    type: String,
    enum: ['question', 'text', 'image', 'video'],
  },
  data: mongoose.Schema.Types.Mixed, // holds questionData, text, or url
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  id: Number,
  content: [contentBlockSchema],
}, { _id: false });

const pageSchema = new mongoose.Schema({
  id: Number,
  sections: [sectionSchema],
}, { _id: false });

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null,
  },
  pages: [pageSchema], // nested structure
  conditions: [conditionSchema],
  viewLogs: [{ timestamp: { type: Date, default: Date.now } }],
}, { timestamps: true });

export default mongoose.model('Form', formSchema);
