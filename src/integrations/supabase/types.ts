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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          phone: string | null
          college: string | null
          graduation_year: number | null
          field_of_study: string | null
          experience_level: 'fresher' | 'experienced' | null
          target_companies: string[] | null
          preferred_roles: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phone?: string | null
          college?: string | null
          graduation_year?: number | null
          field_of_study?: string | null
          experience_level?: 'fresher' | 'experienced' | null
          target_companies?: string[] | null
          preferred_roles?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phone?: string | null
          college?: string | null
          graduation_year?: number | null
          field_of_study?: string | null
          experience_level?: 'fresher' | 'experienced' | null
          target_companies?: string[] | null
          preferred_roles?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_url: string | null
          file_base64: string | null
          file_size: number | null
          extracted_data: Json | null
          parsing_status: 'pending' | 'processing' | 'completed' | 'failed'
          parsing_error: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_url?: string | null
          file_base64?: string | null
          file_size?: number | null
          extracted_data?: Json | null
          parsing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          parsing_error?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_url?: string | null
          file_base64?: string | null
          file_size?: number | null
          extracted_data?: Json | null
          parsing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          parsing_error?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      job_descriptions: {
        Row: {
          id: string
          user_id: string
          company_name: string
          role_title: string
          description: string
          requirements: string[] | null
          skills_required: string[] | null
          experience_level: string | null
          extracted_keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          role_title: string
          description: string
          requirements?: string[] | null
          skills_required?: string[] | null
          experience_level?: string | null
          extracted_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          role_title?: string
          description?: string
          requirements?: string[] | null
          skills_required?: string[] | null
          experience_level?: string | null
          extracted_keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_descriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mock_interviews: {
        Row: {
          id: string
          user_id: string
          resume_id: string | null
          job_description_id: string | null
          company_name: string
          role_title: string
          interview_type: 'predefined' | 'custom'
          status: 'in_progress' | 'completed' | 'abandoned'
          total_questions: number
          questions_answered: number
          overall_score: number | null
          competency_scores: Json | null
          strengths: string[] | null
          improvements: string[] | null
          feedback_summary: string | null
          questions: Json | null
          error_message: string | null
          started_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_id?: string | null
          job_description_id?: string | null
          company_name: string
          role_title: string
          interview_type?: 'predefined' | 'custom'
          status?: 'in_progress' | 'completed' | 'abandoned'
          total_questions?: number
          questions_answered?: number
          overall_score?: number | null
          competency_scores?: Json | null
          strengths?: string[] | null
          improvements?: string[] | null
          feedback_summary?: string | null
          questions?: Json | null
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_id?: string | null
          job_description_id?: string | null
          company_name?: string
          role_title?: string
          interview_type?: 'predefined' | 'custom'
          status?: 'in_progress' | 'completed' | 'abandoned'
          total_questions?: number
          questions_answered?: number
          overall_score?: number | null
          competency_scores?: Json | null
          strengths?: string[] | null
          improvements?: string[] | null
          feedback_summary?: string | null
          questions?: Json | null
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_interviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interviews_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mock_interviews_job_description_id_fkey"
            columns: ["job_description_id"]
            isOneToOne: false
            referencedRelation: "job_descriptions"
            referencedColumns: ["id"]
          }
        ]
      }
      interview_questions: {
        Row: {
          id: string
          mock_interview_id: string
          question_number: number
          question_text: string
          question_type: 'behavioral' | 'technical' | 'situational' | 'company_specific' | null
          question_category: string | null
          ai_generated: boolean
          created_at: string
        }
        Insert: {
          id?: string
          mock_interview_id: string
          question_number: number
          question_text: string
          question_type?: 'behavioral' | 'technical' | 'situational' | 'company_specific' | null
          question_category?: string | null
          ai_generated?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          mock_interview_id?: string
          question_number?: number
          question_text?: string
          question_type?: 'behavioral' | 'technical' | 'situational' | 'company_specific' | null
          question_category?: string | null
          ai_generated?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_questions_mock_interview_id_fkey"
            columns: ["mock_interview_id"]
            isOneToOne: false
            referencedRelation: "mock_interviews"
            referencedColumns: ["id"]
          }
        ]
      }
      interview_responses: {
        Row: {
          id: string
          question_id: string
          mock_interview_id: string
          response_text: string | null
          audio_url: string | null
          response_duration: number | null
          ai_score: number | null
          ai_feedback: string | null
          key_points: string[] | null
          responded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          question_id: string
          mock_interview_id: string
          response_text?: string | null
          audio_url?: string | null
          response_duration?: number | null
          ai_score?: number | null
          ai_feedback?: string | null
          key_points?: string[] | null
          responded_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          question_id?: string
          mock_interview_id?: string
          response_text?: string | null
          audio_url?: string | null
          response_duration?: number | null
          ai_score?: number | null
          ai_feedback?: string | null
          key_points?: string[] | null
          responded_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "interview_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_responses_mock_interview_id_fkey"
            columns: ["mock_interview_id"]
            isOneToOne: false
            referencedRelation: "mock_interviews"
            referencedColumns: ["id"]
          }
        ]
      }
      interview_chats: {
        Row: {
          id: string
          mock_interview_id: string
          message_type: 'question' | 'response' | 'feedback' | 'system'
          sender: 'ai' | 'user' | 'system'
          content: string
          message_order: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          mock_interview_id: string
          message_type: 'question' | 'response' | 'feedback' | 'system'
          sender: 'ai' | 'user' | 'system'
          content: string
          message_order: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          mock_interview_id?: string
          message_type?: 'question' | 'response' | 'feedback' | 'system'
          sender?: 'ai' | 'user' | 'system'
          content?: string
          message_order?: number
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_chats_mock_interview_id_fkey"
            columns: ["mock_interview_id"]
            isOneToOne: false
            referencedRelation: "mock_interviews"
            referencedColumns: ["id"]
          }
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
