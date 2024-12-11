// This is for getting the different models data from the api

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOM_API_URL}/models`, {
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const models = await response.json();

    // Extract model names and IDs
    const modelDetails = models.data.map(model =>({
      id: model.id,
      name: model.attributes.name,
    }));

    return NextResponse.json({ modelDetails });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({ message: 'Error fetching models', error: error.message }, { status: 500 });
  }
}

