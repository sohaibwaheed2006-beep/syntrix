import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

const DATA_TYPES = new Set(["tabular", "relational", "document"]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  const { name, description, data_type } = body as Record<string, unknown>;
  const trimmedName = typeof name === "string" ? name.trim() : "";
  if (!trimmedName) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 });
  }
  if (trimmedName.length > 120) {
    return NextResponse.json({ error: "Project name must be 120 characters or fewer" }, { status: 400 });
  }
  const dataType = data_type === undefined ? "tabular" : data_type;
  if (typeof dataType !== "string" || !DATA_TYPES.has(dataType)) {
    return NextResponse.json({ error: "data_type must be tabular, relational or document" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: trimmedName,
      description: typeof description === "string" && description.trim() ? description.trim() : null,
      data_type: dataType,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
