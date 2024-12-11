// This is for saving relevant model data to the database

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Model from '@/lib/models/Model';

export async function GET() {
  try {
    // Fetch models from TOM API
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOM_API_URL}/models`, {
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models from TOM API');
    }

    const models = await response.json();

    // Connect to MongoDB
    await connectDB();

   // Save the entire data array to MongoDB
   const savedModel = new Model({
    data: models,  // Save the whole array
  });
  
  await savedModel.save();

    // Respond with success
    return NextResponse.json({
      message: 'Models saved successfully',
      savedModel,
    });

  } catch (error) {
    console.error('Error saving models:', error);
    return NextResponse.json(
      { message: 'Error saving models', error: error.message },
      { status: 500 }
    );
  }
}

