import { NextRequest, NextResponse } from 'next/server';
import { UserPreferences } from '@/types';
import { supabase } from '@/lib/supabase';

// Maps a raw Supabase row to the UserPreferences shape the UI expects.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToPrefs(row: Record<string, any>): UserPreferences {
  return {
    pressureModifier: row?.pressure_modifier ?? 1.0,
    reboundModifier: row?.rebound_modifier ?? 0,
  };
}

// GET /api/preferences?userId=<userId>
// Returns { pressureModifier, reboundModifier } | null (null if no row yet).
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId query param is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ? rowToPrefs(data) : null);
}

// PUT /api/preferences
// Body: { userId, pressureModifier, reboundModifier }
// Upserts the user's preferences row, keyed on user_id.
export async function PUT(request: NextRequest) {
  const body: { userId?: string } & Partial<UserPreferences> = await request.json();
  const { userId, pressureModifier, reboundModifier } = body;

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }
  if (typeof pressureModifier !== 'number' || typeof reboundModifier !== 'number') {
    return NextResponse.json(
      { error: 'pressureModifier and reboundModifier must be numbers' },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: userId,
        pressure_modifier: pressureModifier,
        rebound_modifier: reboundModifier,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message, code: error.code, details: error.details, hint: error.hint },
      { status: 500 },
    );
  }

  return NextResponse.json(rowToPrefs(data));
}
