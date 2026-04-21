import { NextResponse } from 'next/server';
import { getActiveUsers } from '@/lib/metrics';

// ===== Metrics storage =====
let requestCount = 0;
let errorCount = 0;
let successCount = 0;
let totalLatency = 0;
let dbQueryTime = 0;
let dbQueryCount = 0;

export async function GET() {

  // ===== Simulate usage =====
  const isError = Math.random() < 0.2;
  const latency = Math.random() * 200;

  requestCount++;

  if (isError) {
    errorCount++;
  } else {
    successCount++;
  }

  totalLatency += latency;

  // ===== Simulate DB =====
  const dbTime = Math.random() * 50;
  dbQueryTime += dbTime;
  dbQueryCount++;

  const avgLatency = totalLatency / requestCount;
  const avgDbTime = dbQueryTime / dbQueryCount;

  // ===== REAL active users =====
  const activeUsers = getActiveUsers();

  const metrics = `
# HELP app_requests_total Total requests
# TYPE app_requests_total counter
app_requests_total ${requestCount}

# HELP app_errors_total Total errors
# TYPE app_errors_total counter
app_errors_total ${errorCount}

# HELP app_success_total Total successful requests
# TYPE app_success_total counter
app_success_total ${successCount}

# HELP app_latency_ms Average latency
# TYPE app_latency_ms gauge
app_latency_ms ${avgLatency}

# HELP app_active_users Active users
# TYPE app_active_users gauge
app_active_users ${activeUsers}

# HELP app_db_query_time_ms Average DB query time
# TYPE app_db_query_time_ms gauge
app_db_query_time_ms ${avgDbTime}

# HELP app_uptime_seconds Uptime
# TYPE app_uptime_seconds gauge
app_uptime_seconds ${process.uptime()}
`;

  return new NextResponse(metrics, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}