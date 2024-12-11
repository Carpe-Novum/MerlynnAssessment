// API Route for Specific Model

import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_TOM_API_URL}/models/${id}`, {
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_TOM_API_KEY}`,
      },
    });

    if (!response.ok) throw new Error('Model fetch failed');

    const model = await response.json();
    return NextResponse.json(model);
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json({ error: 'Failed to fetch model' }, { status: 500 });
  }
}
