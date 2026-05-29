// ============================================
// Supabase 数据库类型定义
// 
// 运行以下命令生成最新类型：
// npx supabase gen types typescript --project-id snjygwmdbdahlrtegnnb > types/supabase.ts
//
// 当前为占位类型，Phase 2 认证完成后建议生成真实类型
// ============================================

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
      todos: {
        Row: {
          id: string
          user_id: string
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}

// 临时类型别名，解决占位类型中 Update 为 never 的问题
export type TodoUpdate = Database['public']['Tables']['todos']['Update']
