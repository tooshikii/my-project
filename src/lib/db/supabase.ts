import { createClient } from "@supabase/supabase-js";

// These should be in your environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-key";

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseKey);

// Utility functions for common operations
export async function saveDataToSupabase<T>(
  table: string,
  data: T,
  upsertOptions = { onConflict: "id" },
) {
  const { data: result, error } = await supabase
    .from(table)
    .upsert(data, upsertOptions);

  if (error) {
    console.error("Error saving to Supabase:", error);
    throw error;
  }

  return result;
}

export async function fetchDataFromSupabase(
  table: string,
  query?: { column: string; value: string | number | boolean | null }[],
) {
  let queryBuilder = supabase.from(table).select("*");

  if (query) {
    query.forEach(({ column, value }) => {
      queryBuilder = queryBuilder.eq(column, value);
    });
  }

  const { data, error } = await queryBuilder;

  if (error) {
    console.error(`Error fetching from Supabase (${table}):`, error);
    throw error;
  }

  return data;
}

export async function deleteDataFromSupabase(table: string, id: string) {
  const { error } = await supabase.from(table).delete().match({ id });

  if (error) {
    console.error(`Error deleting from Supabase (${table}):`, error);
    throw error;
  }

  return true;
}
