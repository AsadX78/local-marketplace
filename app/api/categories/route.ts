import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
