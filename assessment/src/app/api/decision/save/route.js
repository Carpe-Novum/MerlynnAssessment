import connectToDatabase from '../../../lib/mongodb';
import { Decision } from '../../../lib/models/decision';

export async function POST(request) {
  try {
    // Extract data from the request body
    const { id, inputData, decision } = await request.json();

    // Ensure MongoDB is connected
    await connectToDatabase();

    // Create a new decision document
    const newDecision = new Decision({
      modelId: id,
      userInput: inputData,
      decision, // Store the decision received from the API
    });

    // Save the decision document to MongoDB
    await newDecision.save();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error saving decision and user input:', error);
    return new Response(JSON.stringify({ error: 'Failed to save decision and user input' }), { status: 500 });
  }
}

