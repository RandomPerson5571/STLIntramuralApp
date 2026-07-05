/**
 * Supabase-generated Database types.
 * Regenerate with: Supabase MCP `generate_typescript_types` (project: thsdsspaqytuxqbhtpbo)
 * or: npx supabase gen types typescript --project-id thsdsspaqytuxqbhtpbo
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      event_attendances: {
        Row: {
          attended_at: string | null;
          created_at: string;
          event_id: string;
          id: string;
          scanned_by: string | null;
          user_id: string;
        };
        Insert: {
          attended_at?: string | null;
          created_at?: string;
          event_id: string;
          id?: string;
          scanned_by?: string | null;
          user_id: string;
        };
        Update: {
          attended_at?: string | null;
          created_at?: string;
          event_id?: string;
          id?: string;
          scanned_by?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_attendances_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_attendances_scanned_by_fkey";
            columns: ["scanned_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_attendances_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          end_date: string;
          external_links: string[] | null;
          host_id: string;
          id: string;
          max_attendees: number | null;
          points_awarded: number;
          start_date: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          end_date: string;
          external_links?: string[] | null;
          host_id: string;
          id?: string;
          max_attendees?: number | null;
          points_awarded?: number;
          start_date: string;
          title: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          end_date?: string;
          external_links?: string[] | null;
          host_id?: string;
          id?: string;
          max_attendees?: number | null;
          points_awarded?: number;
          start_date?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_host_id_fkey";
            columns: ["host_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      point_transactions: {
        Row: {
          attendance_id: string | null;
          created_at: string;
          description: string;
          event_id: string | null;
          id: string;
          points: number;
          user_id: string;
        };
        Insert: {
          attendance_id?: string | null;
          created_at?: string;
          description: string;
          event_id?: string | null;
          id?: string;
          points: number;
          user_id: string;
        };
        Update: {
          attendance_id?: string | null;
          created_at?: string;
          description?: string;
          event_id?: string | null;
          id?: string;
          points?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "point_transactions_attendance_id_fkey";
            columns: ["attendance_id"];
            isOneToOne: false;
            referencedRelation: "event_attendances";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "point_transactions_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "point_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_items: {
        Row: {
          cost: number;
          created_at: string;
          description: string | null;
          id: string;
          seller_id: string;
          stock: number;
          title: string;
        };
        Insert: {
          cost: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          seller_id: string;
          stock?: number;
          title: string;
        };
        Update: {
          cost?: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          seller_id?: string;
          stock?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_items_seller_id_fkey";
            columns: ["seller_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      shop_transactions: {
        Row: {
          id: string;
          points_spent: number;
          purchased_at: string;
          quantity: number;
          shop_item_id: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          points_spent: number;
          purchased_at?: string;
          quantity?: number;
          shop_item_id?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          points_spent?: number;
          purchased_at?: string;
          quantity?: number;
          shop_item_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_transactions_shop_item_id_fkey";
            columns: ["shop_item_id"];
            isOneToOne: false;
            referencedRelation: "shop_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          auth_id: string;
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          points_balance: number;
          qr_code_token: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          auth_id: string;
          created_at?: string;
          first_name: string;
          id?: string;
          last_name: string;
          points_balance?: number;
          qr_code_token?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          auth_id?: string;
          created_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          points_balance?: number;
          qr_code_token?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "student" | "teacher" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof Database;
}
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type TableName = keyof Database["public"]["Tables"];
