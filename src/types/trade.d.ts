import { Database } from "./supabase"

export type Trade = Database["public"]["Tables"]["trades"]["Row"]

export type Account = Database["public"]["Tables"]["accounts"]["Row"]