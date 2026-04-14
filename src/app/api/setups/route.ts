import { NextRequest, NextResponse } from 'next/server';
import { SavedSetup } from '@/types';
import { supabase } from '@/lib/supabase';

// GET /api/setups?userId=<userId>
// Returns all setups for a user.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId query param is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('setups')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/setups
// Body: SavedSetup & { userId: string }
// Saves a new setup for the given user.
export async function POST(request: NextRequest) {
  const body: SavedSetup & { userId: string } = await request.json();
  const { userId, ...setup } = body;

  if (!userId || !setup.id) {
    return NextResponse.json({ error: 'userId and setup id are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('setups')
    .insert({
      id: setup.id,
      user_id: userId,
      name: setup.name,
      bike_id: setup.formData?.bikeModel ?? null,
      fork_variant_id: setup.formData?.frontSuspension ?? null,
      shock_variant_id: setup.formData?.rearShock ?? null,
      rider_weight: setup.formData?.weight ? Number(setup.formData.weight) : null,
      ride_style: setup.formData?.rideType ?? null,
      calculated_settings: setup.formData ?? null,
      rating: setup.rating ?? null,
      notes: setup.feedback ?? null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PUT /api/setups?id=<id>
// Body: Partial<Pick<SavedSetup, 'rating' | 'feedback'>>
// Updates rating/feedback for an existing setup.
export async function PUT(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
  }

  const body: Partial<Pick<SavedSetup, 'rating' | 'feedback'>> = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.rating !== undefined) updates.rating = body.rating;
  if (body.feedback !== undefined) updates.notes = body.feedback;

  const { data, error } = await supabase
    .from('setups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/setups?id=<id>
// Deletes a setup by id.
export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id query param is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('setups')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id });
}
