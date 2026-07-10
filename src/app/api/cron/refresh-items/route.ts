import { NextResponse } from 'next/server';
import { refreshItems } from '@/lib/items/refresh';

/**
 * Scheduled endpoint that Vercel Cron calls weekly to refresh the item catalog.
 *
 * The catalog changes rarely \u2014 only when Jagex ships new items \u2014 so we refresh
 * weekly (Monday 04:00 UTC). This picks up any new items the OSRS Wiki team
 * has added since the last run.
 *
 * Protected by CRON_SECRET (same secret as the prices refresh endpoint).
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await refreshItems();
    return NextResponse.json({
      ok: true,
      written: result.written,
    });
  } catch (error) {
    console.error('Cron item refresh failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
