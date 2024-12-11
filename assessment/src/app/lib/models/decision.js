import mongoose from 'mongoose';

const decisionSchema = new mongoose.Schema({
  modelId: { type: String, required: true },  // Model ID for reference
  userInput: { type: Object, required: true },  // User input data
  decision: { type: String, required: true },  // Decision made by the API
  createdAt: { type: Date, default: Date.now },  // Timestamp
});

const Decision = mongoose.models.Decision || mongoose.model('Decision', decisionSchema);

export { Decision };




