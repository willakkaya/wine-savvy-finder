export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      corporate_accounts: {
        Row: {
          admin_id: string | null
          company_name: string
          created_at: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          monthly_budget: number | null
          monthly_fee: number | null
          per_meal_budget: number | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          company_name: string
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          monthly_budget?: number | null
          monthly_fee?: number | null
          per_meal_budget?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          company_name?: string
          created_at?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          monthly_budget?: number | null
          monthly_fee?: number | null
          per_meal_budget?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_accounts_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      corporate_team_members: {
        Row: {
          added_at: string | null
          corporate_account_id: string | null
          id: string
          is_active: boolean | null
          per_meal_budget: number | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          corporate_account_id?: string | null
          id?: string
          is_active?: boolean | null
          per_meal_budget?: number | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          corporate_account_id?: string | null
          id?: string
          is_active?: boolean | null
          per_meal_budget?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "corporate_team_members_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corporate_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          user_id: string
          wine_data: Json
          wine_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          wine_data: Json
          wine_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          wine_data?: Json
          wine_id?: string
        }
        Relationships: []
      }
      pre_order_wines: {
        Row: {
          id: string
          notes: string | null
          pre_order_id: string | null
          price_per_bottle: number
          quantity: number
          wine_id: string | null
        }
        Insert: {
          id?: string
          notes?: string | null
          pre_order_id?: string | null
          price_per_bottle: number
          quantity?: number
          wine_id?: string | null
        }
        Update: {
          id?: string
          notes?: string | null
          pre_order_id?: string | null
          price_per_bottle?: number
          quantity?: number
          wine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_order_wines_pre_order_id_fkey"
            columns: ["pre_order_id"]
            isOneToOne: false
            referencedRelation: "pre_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_order_wines_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wine_database"
            referencedColumns: ["id"]
          },
        ]
      }
      pre_orders: {
        Row: {
          corporate_account_id: string | null
          created_at: string | null
          dinner_date: string
          id: string
          num_guests: number
          ordered_by: string | null
          restaurant_id: string | null
          special_requests: string | null
          status: string | null
          total_budget: number | null
          updated_at: string | null
        }
        Insert: {
          corporate_account_id?: string | null
          created_at?: string | null
          dinner_date: string
          id?: string
          num_guests: number
          ordered_by?: string | null
          restaurant_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Update: {
          corporate_account_id?: string | null
          created_at?: string | null
          dinner_date?: string
          id?: string
          num_guests?: number
          ordered_by?: string | null
          restaurant_id?: string | null
          special_requests?: string | null
          status?: string | null
          total_budget?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pre_orders_corporate_account_id_fkey"
            columns: ["corporate_account_id"]
            isOneToOne: false
            referencedRelation: "corporate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pre_orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurant_wines: {
        Row: {
          by_glass_price: number | null
          current_price: number
          date_added: string | null
          date_updated: string | null
          id: string
          is_available: boolean | null
          notes: string | null
          restaurant_id: string | null
          section: string | null
          wine_id: string | null
        }
        Insert: {
          by_glass_price?: number | null
          current_price: number
          date_added?: string | null
          date_updated?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          restaurant_id?: string | null
          section?: string | null
          wine_id?: string | null
        }
        Update: {
          by_glass_price?: number | null
          current_price?: number
          date_added?: string | null
          date_updated?: string | null
          id?: string
          is_available?: boolean | null
          notes?: string | null
          restaurant_id?: string | null
          section?: string | null
          wine_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_wines_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "restaurant_wines_wine_id_fkey"
            columns: ["wine_id"]
            isOneToOne: false
            referencedRelation: "wine_database"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          city: string
          created_at: string | null
          cuisine_type: string | null
          id: string
          is_active: boolean | null
          is_partner: boolean | null
          monthly_fee: number | null
          name: string
          neighborhood: string | null
          owner_id: string | null
          phone: string | null
          price_range: number | null
          subscription_tier: string | null
          updated_at: string | null
          website: string | null
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          cuisine_type?: string | null
          id?: string
          is_active?: boolean | null
          is_partner?: boolean | null
          monthly_fee?: number | null
          name: string
          neighborhood?: string | null
          owner_id?: string | null
          phone?: string | null
          price_range?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          cuisine_type?: string | null
          id?: string
          is_active?: boolean | null
          is_partner?: boolean | null
          monthly_fee?: number | null
          name?: string
          neighborhood?: string | null
          owner_id?: string | null
          phone?: string | null
          price_range?: number | null
          subscription_tier?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_history: {
        Row: {
          created_at: string
          highest_rated_wine_id: string | null
          id: string
          image_data: string | null
          scan_date: string
          scenario: string | null
          top_value_wine_id: string | null
          user_id: string | null
          wines_found: number
        }
        Insert: {
          created_at?: string
          highest_rated_wine_id?: string | null
          id?: string
          image_data?: string | null
          scan_date?: string
          scenario?: string | null
          top_value_wine_id?: string | null
          user_id?: string | null
          wines_found?: number
        }
        Update: {
          created_at?: string
          highest_rated_wine_id?: string | null
          id?: string
          image_data?: string | null
          scan_date?: string
          scenario?: string | null
          top_value_wine_id?: string | null
          user_id?: string | null
          wines_found?: number
        }
        Relationships: [
          {
            foreignKeyName: "scan_history_highest_rated_wine_id_fkey"
            columns: ["highest_rated_wine_id"]
            isOneToOne: false
            referencedRelation: "wine_database"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_history_top_value_wine_id_fkey"
            columns: ["top_value_wine_id"]
            isOneToOne: false
            referencedRelation: "wine_database"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wine_database: {
        Row: {
          alcohol_content: number | null
          bottle_size: string | null
          country: string | null
          created_at: string | null
          critic_score: number | null
          description: string | null
          grape_varieties: string[] | null
          id: string
          image_url: string | null
          market_price_estimate: number | null
          name: string
          region: string | null
          updated_at: string | null
          vintage: number | null
          vivino_id: string | null
          wine_searcher_id: string | null
          wine_type: string | null
          winery: string
        }
        Insert: {
          alcohol_content?: number | null
          bottle_size?: string | null
          country?: string | null
          created_at?: string | null
          critic_score?: number | null
          description?: string | null
          grape_varieties?: string[] | null
          id?: string
          image_url?: string | null
          market_price_estimate?: number | null
          name: string
          region?: string | null
          updated_at?: string | null
          vintage?: number | null
          vivino_id?: string | null
          wine_searcher_id?: string | null
          wine_type?: string | null
          winery: string
        }
        Update: {
          alcohol_content?: number | null
          bottle_size?: string | null
          country?: string | null
          created_at?: string | null
          critic_score?: number | null
          description?: string | null
          grape_varieties?: string[] | null
          id?: string
          image_url?: string | null
          market_price_estimate?: number | null
          name?: string
          region?: string | null
          updated_at?: string | null
          vintage?: number | null
          vivino_id?: string | null
          wine_searcher_id?: string | null
          wine_type?: string | null
          winery?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "consumer"
        | "corporate_admin"
        | "restaurant_partner"
        | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "consumer",
        "corporate_admin",
        "restaurant_partner",
        "super_admin",
      ],
    },
  },
} as const
