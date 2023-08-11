export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          cash: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          cash?: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          cash?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: []
      }
      trades: {
        Row: {
          account_id: number
          id: number
          inserted_at: string
          name: string
          price: number
          shares: number
          symbol: string
        }
        Insert: {
          account_id: number
          id?: number
          inserted_at?: string
          name: string
          price: number
          shares: number
          symbol: string
        }
        Update: {
          account_id?: number
          id?: number
          inserted_at?: string
          name?: string
          price?: number
          shares?: number
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_id_fkey"
            columns: ["account_id"]
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
