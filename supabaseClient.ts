import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pqxeccwmswhqyawxswfu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxeGVjY3dtc3docXlhd3hzd2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMzQxMzcsImV4cCI6MjA3MzgxMDEzN30.k82G59z3ELFo1cO-3xPhPaKJA_8aK2tS9hapsG4uSRQ";
export const supabase = createClient(supabaseUrl, supabaseKey);
