import { NextResponse } from 'next/server';
import { refreshPrices } from '@/lib/prices/refresh';

/**
 * Scheduled endpoint that Vercel Cron calls daily to refresh OSRS prices.
 *
 * Protected by CRON_SECRET \u2014 requests must include a matching bearer token
 * in the Authorization header. Vercel sends this automatically for cron
 * invocations; other callers get 401.
 *
 * Schedule is configured in vercel.json.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await refreshPrices();
    return NextResponse.json({
      ok: true,
      written: result.written,
      skipped: result.skipped,
    });
  } catch (error) {
    console.error('Cron refresh failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}

export const dynamic = 'force-dynamic';
