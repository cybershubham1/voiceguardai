export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      detection_results: {
        Row: {
          analysis_details: Json | null
          analysis_metadata: Json | null
          confidence_score: number
          created_at: string
          detection_method: string | null
          file_url: string | null
          id: string
          is_deepfake: boolean
          media_type: string
          model_version: string | null
          processing_time: number | null
          user_id: string
        }
        Insert: {
          analysis_details?: Json | null
          analysis_metadata?: Json | null
          confidence_score: number
          created_at?: string
          detection_method?: string | null
          file_url?: string | null
          id?: string
          is_deepfake: boolean
          media_type: string
          model_version?: string | null
          processing_time?: number | null
          user_id: string
        }
        Update: {
          analysis_details?: Json | null
          analysis_metadata?: Json | null
          confidence_score?: number
          created_at?: string
          detection_method?: string | null
          file_url?: string | null
          id?: string
          is_deepfake?: boolean
          media_type?: string
          model_version?: string | null
          processing_time?: number | null
          user_id?: string
        }
        Relationships: []
      }
      model_versions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          media_type: string
          metrics: Json
          parameters: Json | null
          training_completed: boolean | null
          version: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type: string
          metrics?: Json
          parameters?: Json | null
          training_completed?: boolean | null
          version: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          media_type?: string
          metrics?: Json
          parameters?: Json | null
          training_completed?: boolean | null
          version?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      training_data: {
        Row: {
          created_at: string
          features: Json | null
          file_url: string | null
          id: string
          is_deepfake: boolean
          media_type: string
          metadata: Json | null
          user_id: string
          validation_status: string | null
        }
        Insert: {
          created_at?: string
          features?: Json | null
          file_url?: string | null
          id?: string
          is_deepfake: boolean
          media_type: string
          metadata?: Json | null
          user_id: string
          validation_status?: string | null
        }
        Update: {
          created_at?: string
          features?: Json | null
          file_url?: string | null
          id?: string
          is_deepfake?: boolean
          media_type?: string
          metadata?: Json | null
          user_id?: string
          validation_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
