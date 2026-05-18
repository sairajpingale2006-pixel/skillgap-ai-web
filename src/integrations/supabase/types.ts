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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      analyses: {
        Row: {
          created_at: string
          id: string
          match_score: number
          matched_skills: Json
          missing_skills: Json
          role_id: string
          total_required: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_score: number
          matched_skills?: Json
          missing_skills?: Json
          role_id: string
          total_required?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_score?: number
          matched_skills?: Json
          missing_skills?: Json
          role_id?: string
          total_required?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analyses_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          kind: string
          slug: string
          threshold: number | null
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          kind?: string
          slug: string
          threshold?: number | null
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          kind?: string
          slug?: string
          threshold?: number | null
          title?: string
        }
        Relationships: []
      }
      chat_history: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          experience_years: number | null
          full_name: string | null
          id: string
          last_active_date: string | null
          links: Json | null
          location: string | null
          streak_days: number
          target_role_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          id: string
          last_active_date?: string | null
          links?: Json | null
          location?: string | null
          streak_days?: number
          target_role_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          experience_years?: number | null
          full_name?: string | null
          id?: string
          last_active_date?: string | null
          links?: Json | null
          location?: string | null
          streak_days?: number
          target_role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_target_role_fk"
            columns: ["target_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_uploads: {
        Row: {
          ats_score: number | null
          created_at: string
          error: string | null
          extracted_skills: Json | null
          extracted_text: string | null
          filename: string
          id: string
          mime_type: string | null
          missing_keywords: Json | null
          resume_score: number | null
          status: string
          storage_path: string
          suggestions: Json | null
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string
          error?: string | null
          extracted_skills?: Json | null
          extracted_text?: string | null
          filename: string
          id?: string
          mime_type?: string | null
          missing_keywords?: Json | null
          resume_score?: number | null
          status?: string
          storage_path: string
          suggestions?: Json | null
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string
          error?: string | null
          extracted_skills?: Json | null
          extracted_text?: string | null
          filename?: string
          id?: string
          mime_type?: string | null
          missing_keywords?: Json | null
          resume_score?: number | null
          status?: string
          storage_path?: string
          suggestions?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          analysis_id: string | null
          created_at: string
          id: string
          progress_pct: number
          role_id: string | null
          updated_at: string
          user_id: string
          weeks: Json
        }
        Insert: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          progress_pct?: number
          role_id?: string | null
          updated_at?: string
          user_id: string
          weeks?: Json
        }
        Update: {
          analysis_id?: string | null
          created_at?: string
          id?: string
          progress_pct?: number
          role_id?: string | null
          updated_at?: string
          user_id?: string
          weeks?: Json
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmaps_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_skills: {
        Row: {
          priority: string
          role_id: string
          skill_id: string
        }
        Insert: {
          priority?: string
          role_id: string
          skill_id: string
        }
        Update: {
          priority?: string
          role_id?: string
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_skills_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          demand_level: string | null
          description: string | null
          growth_pct: number | null
          icon: string | null
          id: string
          salary_range: string | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          demand_level?: string | null
          description?: string | null
          growth_pct?: number | null
          icon?: string | null
          id?: string
          salary_range?: string | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          demand_level?: string | null
          description?: string | null
          growth_pct?: number | null
          icon?: string | null
          id?: string
          salary_range?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: Database["public"]["Enums"]["skill_category"]
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["skill_category"]
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["skill_category"]
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          level: number
          skill_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          level?: number
          skill_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          level?: number
          skill_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      skill_category:
        | "languages"
        | "frontend"
        | "backend"
        | "ai"
        | "database"
        | "devops"
        | "design"
        | "soft"
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
      skill_category: [
        "languages",
        "frontend",
        "backend",
        "ai",
        "database",
        "devops",
        "design",
        "soft",
      ],
    },
  },
} as const
