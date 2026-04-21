import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const pingResult = await db.command({ ping: 1 });

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb: {
        uriConfigured: Boolean(process.env.MONGODB_URI),
        dbName: process.env.MONGODB_DB_NAME || 'medilearn',
        ping: pingResult?.ok === 1 ? 'ok' : 'failed',
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 