// This is the POST handler for the batch upload

import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  const { id } = await params; // Extract model ID from the request URL
  
  try {
    // Extract the uploaded file from the request
    const formData = await request.formData(); 
    const file = formData.get('file'); // Extract the file by name

    // Create a new FormData instance for the TOM API request
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Make the request to the TOM API
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOM_API_URL}/batch/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      },
      body: apiFormData, // Send FormData with the file
    });

    // Check for errors
    if (!response.ok) {
      throw new Error('Failed to process the batch upload');
    }

    // Parse the API response
    const data = await response.json();

    // Return file ID if present
    if (data?.data?.jobs?.[0]?.id) {
        return NextResponse.json({ fileId: data?.data?.jobs?.[0].id });
    } else {
        return NextResponse.json(
        { error: 'No file ID returned from the API' }, 
        { status: 400 }
      );
    }
    } catch (error) {
        console.error('Batch upload error:', error);
        return NextResponse.json(
            { error: 'Failed to process the batch upload' }, 
            { status: 500 }
        );
    }
}
