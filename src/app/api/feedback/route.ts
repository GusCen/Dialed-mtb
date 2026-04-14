import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface FeedbackPayload {
  message: string;
  rating: number;
  userId?: string;
}

// POST /api/feedback
// Body: { message: string; rating: number; userId?: string }
// Submits user feedback.
export async function POST(request: NextRequest) {
  const body: FeedbackPayload = await request.json();
  const { message, rating, userId } = body;

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating must be a number between 1 and 5' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: userId ?? null,
      message,
      rating,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
