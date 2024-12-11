// this is for the post request for input data for a model

import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params; // Get the model ID from the URL params
  const formData = await request.json(); // Get the form data sent from the frontend
 
  try {
    // Make the request to the TOM API with the form data
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOM_API_URL}/decision/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
      },
      body: JSON.stringify(formData),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to get the decision');
    }

    // Parse the JSON response
    const data = await response.json();
    const decision = data.data;

    // Return the decision as the response
    return NextResponse.json({ decision });
  } catch (error) {
    console.error('Error making API request:', error);
    return NextResponse.json({ error: 'Failed to get the decision' }, { status: 500 });
  }
}
