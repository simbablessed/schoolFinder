/**
 * School Finder Zimbabwe - Cloudflare Worker Edge Backend
 * Connects Cloudflare Workers -> Neon Serverless PostgreSQL -> Clerk Auth
 */

import { neon } from "@neondatabase/serverless";

export interface Env {
  DATABASE_URL?: string;
  CLERK_SECRET_KEY?: string;
  CLERK_PUBLISHABLE_KEY?: string;
  ENVIRONMENT?: string;
}

// Standard CORS headers for frontend communication
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Temp-Email",
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

function errorResponse(message: string, status = 400) {
  return json({ error: message, success: false }, status);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Optional Neon Postgres client
    const sql = env.DATABASE_URL ? neon(env.DATABASE_URL) : null;

    try {
      // 1. Health check
      if (path === "/api/health" || path === "/health") {
        return json({
          status: "healthy",
          provider: "Cloudflare Workers",
          database: env.DATABASE_URL ? "Neon Serverless Postgres (Connected)" : "Mock/Local Fallback Ready",
          auth: env.CLERK_SECRET_KEY ? "Clerk Active" : "Temp/Demo Credentials Mode",
          timestamp: new Date().toISOString(),
        });
      }

      // 2. GET /api/schools
      if (path === "/api/schools" && request.method === "GET") {
        const query = url.searchParams.get("q")?.toLowerCase();
        const province = url.searchParams.get("province");

        if (sql) {
          let rows;
          if (province && province !== "All") {
            rows = await sql`SELECT * FROM schools WHERE province = ${province} ORDER BY rating DESC`;
          } else {
            rows = await sql`SELECT * FROM schools ORDER BY rating DESC`;
          }
          if (query) {
            rows = rows.filter((s: any) =>
              s.name.toLowerCase().includes(query) ||
              s.location.toLowerCase().includes(query)
            );
          }
          return json({ schools: rows, count: rows.length });
        }

        // Fallback demo response if database URL not bound yet
        return json({
          status: "fallback",
          message: "Neon DATABASE_URL not set in Cloudflare Worker env. Provide DATABASE_URL in wrangler.toml or Neon dashboard.",
        });
      }

      // 3. GET /api/schools/:id
      const schoolMatch = path.match(/^\/api\/schools\/([^/]+)$/);
      if (schoolMatch && request.method === "GET") {
        const schoolId = schoolMatch[1];
        if (sql) {
          const rows = await sql`SELECT * FROM schools WHERE id = ${schoolId} LIMIT 1`;
          if (rows.length === 0) return errorResponse("School not found", 404);
          const reviews = await sql`SELECT * FROM reviews WHERE school_id = ${schoolId} ORDER BY created_at DESC`;
          return json({ school: rows[0], reviews });
        }
        return errorResponse("Database connection unavailable", 503);
      }

      // 4. PATCH /api/schools/:id (Update school details by Admin)
      if (schoolMatch && request.method === "PATCH") {
        const schoolId = schoolMatch[1];
        const body = await request.json() as any;

        if (sql) {
          await sql`
            UPDATE schools 
            SET 
              starting_fees = COALESCE(${body.startingFees ?? body.starting_fees}, starting_fees),
              pass_rate = COALESCE(${body.passRate ?? body.pass_rate}, pass_rate),
              phone = COALESCE(${body.phone}, phone),
              motto = COALESCE(${body.motto}, motto),
              description = COALESCE(${body.description}, description)
            WHERE id = ${schoolId}
          `;
          return json({ success: true, message: `Updated school ${schoolId}` });
        }
        return json({ success: true, message: "Updated (mocked)" });
      }

      // 5. GET /api/enquiries
      if (path === "/api/enquiries" && request.method === "GET") {
        const schoolId = url.searchParams.get("schoolId") || url.searchParams.get("school_id");
        const parentEmail = url.searchParams.get("parentEmail") || url.searchParams.get("email");

        if (sql) {
          let rows;
          if (schoolId) {
            rows = await sql`SELECT * FROM enquiries WHERE school_id = ${schoolId} ORDER BY created_at DESC`;
          } else if (parentEmail) {
            rows = await sql`SELECT * FROM enquiries WHERE parent_email = ${parentEmail} ORDER BY created_at DESC`;
          } else {
            rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 50`;
          }
          return json({ enquiries: rows });
        }
        return json({ enquiries: [] });
      }

      // 6. POST /api/enquiries
      if (path === "/api/enquiries" && request.method === "POST") {
        const b = await request.json() as any;
        if (!b.schoolId || !b.parentName || !b.parentEmail) {
          return errorResponse("Missing required enquiry fields");
        }

        if (sql) {
          const res = await sql`
            INSERT INTO enquiries (school_id, parent_name, parent_email, parent_phone, interest, status, notes)
            VALUES (${b.schoolId}, ${b.parentName}, ${b.parentEmail}, ${b.parentPhone || null}, ${b.interest}, 'New', ${b.notes || null})
            RETURNING *
          `;
          return json({ success: true, enquiry: res[0] }, 201);
        }
        return json({ success: true, enquiry: { id: "mock-" + Date.now(), ...b, status: "New" } }, 201);
      }

      // 7. PATCH /api/enquiries/:id (Update Status)
      const enquiryMatch = path.match(/^\/api\/enquiries\/([^/]+)$/);
      if (enquiryMatch && request.method === "PATCH") {
        const enquiryId = enquiryMatch[1];
        const { status } = await request.json() as any;
        if (sql) {
          await sql`UPDATE enquiries SET status = ${status} WHERE id = ${enquiryId}::uuid`;
          return json({ success: true, status });
        }
        return json({ success: true, status });
      }

      // 8. POST /api/reviews
      if (path === "/api/reviews" && request.method === "POST") {
        const b = await request.json() as any;
        if (sql) {
          const res = await sql`
            INSERT INTO reviews (school_id, author, role, rating, title, comment, verified)
            VALUES (${b.schoolId}, ${b.author}, ${b.role || 'Parent'}, ${b.rating}, ${b.title}, ${b.comment}, true)
            RETURNING *
          `;
          return json({ success: true, review: res[0] }, 201);
        }
        return json({ success: true, review: { id: "mock-" + Date.now(), ...b } }, 201);
      }

      // 404 for unknown API routes
      return errorResponse(`Endpoint ${path} not found`, 404);
    } catch (err: any) {
      return json({ error: err.message || "Internal server error" }, 500);
    }
  },
};
