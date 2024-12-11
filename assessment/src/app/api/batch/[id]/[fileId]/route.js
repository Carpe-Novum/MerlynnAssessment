// This is for the GET request for batch data

import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id, fileId } = await params;

  try {
    // Make the GET request to the TOM API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TOM_API_URL}/batch/${id}/${fileId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Failed to retrieve the processed file.');
    }

    // Extract the file blob and return it
    const fileBlob = await response.blob();

    return new Response(fileBlob, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="processed_file_${fileId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error fetching processed file:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve the processed file' },
      { status: 500 }
    );
  }
}
