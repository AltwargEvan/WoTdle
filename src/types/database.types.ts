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
      daily_data: {
        Row: {
          date: string;
          dd_mm_yy: string;
          id: number;
          normal: Json | null;
          hard: Json | null;
          normal_wins: number;
          hard_wins: number;
        };
        Insert: {
          date: string;
          dd_mm_yy: string;
          id?: number;
          normal?: Json | null;
          hard?: Json | null;
          normal_wins?: number;
          hard_wins?: number;
        };
        Update: {
          date?: string;
          dd_mm_yy?: string;
          id?: number;
          normal?: Json | null;
          hard?: Json | null;
          normal_wins?: number;
          hard_wins?: number;
        };
        Relationships: [];
      };
      tank_of_day: {
        Row: {
          created_at: string;
          dd_mm_yy: string | null;
          id: string;
          tank_id: number;
          tank_name: string;
          win_count: number | null;
        };
        Insert: {
          created_at?: string;
          dd_mm_yy?: string | null;
          id?: string;
          tank_id: number;
          tank_name: string;
          win_count?: number | null;
        };
        Update: {
          created_at?: string;
          dd_mm_yy?: string | null;
          id?: string;
          tank_id?: number;
          tank_name?: string;
          win_count?: number | null;
        };
        Relationships: [];
      };
      vehicle_data: {
        Row: {
          created_at: string;
          data: Json | null;
          dd_mm_yy: string | null;
          id: number;
        };
        Insert: {
          created_at?: string;
          data?: Json | null;
          dd_mm_yy?: string | null;
          id?: number;
        };
        Update: {
          created_at?: string;
          data?: Json | null;
          dd_mm_yy?: string | null;
          id?: number;
        };
        Relationships: [];
      };
      vehicle_data_v2: {
        Row: {
          data: Json | null;
          tier: number;
        };
        Insert: {
          data?: Json | null;
          tier?: number;
        };
        Update: {
          data?: Json | null;
          tier?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      incrementnormalwins: {
        Args: {
          row_id: string;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
