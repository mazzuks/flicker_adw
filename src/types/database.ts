export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRoleGlobal =
  | 'ADWORKS_SUPERADMIN'
  | 'ADWORKS_ADMIN'
  | 'ADWORKS_ACCOUNT_MANAGER'
  | 'OPERATOR_ACCOUNTING'
  | 'OPERATOR_INPI'
  | 'CLIENT_OWNER'
  | 'CLIENT_USER'
  | 'CLIENT_VIEWER';

export type ClientRole = 'CLIENT_OWNER' | 'CLIENT_USER' | 'CLIENT_VIEWER';
export type ClientStatus = 'ONBOARDING' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          plan: string
          settings: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: string
          settings?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: string
          settings?: Json
          created_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          account_id: string | null
          full_name: string | null
          email: string
          role_global: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          account_id?: string | null
          full_name?: string | null
          email: string
          role_global?: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          full_name?: string | null
          email?: string
          role_global?: string
          avatar_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      companies: {
        Row: {
          id: string
          account_id: string | null
          name: string
          cnpj: string | null
          status: string
          owner_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id?: string | null
          name: string
          cnpj?: string | null
          status?: string
          owner_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          name?: string
          cnpj?: string | null
          status?: string
          owner_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          id: string
          account_id: string | null
          company_id: string | null
          stage_key: string
          title: string
          value_cents: number
          priority: string
          owner_id: string | null
          sla_due_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id?: string | null
          company_id?: string | null
          stage_key?: string
          title: string
          value_cents?: number
          priority?: string
          owner_id?: string | null
          sla_due_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          company_id?: string | null
          stage_key?: string
          title?: string
          value_cents?: number
          priority?: string
          owner_id?: string | null
          sla_due_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_threads: {
        Row: {
          id: string
          account_id: string | null
          company_id: string | null
          last_message_preview: string | null
          last_message_at: string
          unread_count_operator: number
          unread_count_client: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          account_id?: string | null
          company_id?: string | null
          last_message_preview?: string | null
          last_message_at?: string
          unread_count_operator?: number
          unread_count_client?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          company_id?: string | null
          last_message_preview?: string | null
          last_message_at?: string
          unread_count_operator?: number
          unread_count_client?: number
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_threads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          id: string
          thread_id: string | null
          author_id: string | null
          body: string
          is_internal: boolean
          attachments: Json
          created_at: string
        }
        Insert: {
          id?: string
          thread_id?: string | null
          author_id?: string | null
          body: string
          is_internal?: boolean
          attachments?: Json
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string | null
          author_id?: string | null
          body?: string
          is_internal?: boolean
          attachments?: Json
          created_at?: string
        }
        Relationships: []
      }
      templeteria_sites: {
        Row: {
          id: string
          client_id: string | null
          created_by: string
          slug: string
          status: string
          title: string | null
          description: string | null
          schema_json: Json
          theme_json: Json
          published_version_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          created_by: string
          slug: string
          status?: string
          title?: string | null
          description?: string | null
          schema_json?: Json
          theme_json?: Json
          published_version_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          created_by?: string
          slug?: string
          status?: string
          title?: string | null
          description?: string | null
          schema_json?: Json
          theme_json?: Json
          published_version_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      templeteria_site_versions: {
        Row: {
          id: string
          site_id: string
          client_id: string | null
          version: number
          schema_json: Json
          theme_json: Json
          notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          client_id?: string | null
          version: number
          schema_json?: Json
          theme_json?: Json
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          client_id?: string | null
          version?: number
          schema_json?: Json
          theme_json?: Json
          notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      templeteria_ai_jobs: {
        Row: {
          id: string
          client_id: string | null
          site_id: string | null
          status: string
          mode: string
          provider: string | null
          input_payload_json: Json
          output_payload_json: Json
          error_message: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id?: string | null
          site_id?: string | null
          status: string
          mode: string
          provider?: string | null
          input_payload_json?: Json
          output_payload_json?: Json
          error_message?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          site_id?: string | null
          status?: string
          mode?: string
          provider?: string | null
          input_payload_json?: Json
          output_payload_json?: Json
          error_message?: string | null
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          slug: string
          plan: string
          status: string
          fantasy_name: string | null
          cnpj: string | null
          segment: string | null
          city: string | null
          state: string | null
          address_json: Json
          contacts_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          plan?: string
          status?: string
          fantasy_name?: string | null
          cnpj?: string | null
          segment?: string | null
          city?: string | null
          state?: string | null
          address_json?: Json
          contacts_json?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          plan?: string
          status?: string
          fantasy_name?: string | null
          cnpj?: string | null
          segment?: string | null
          city?: string | null
          state?: string | null
          address_json?: Json
          contacts_json?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_memberships: {
        Row: {
          id: string
          client_id: string
          user_id: string
          role_in_client: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          user_id: string
          role_in_client: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          user_id?: string
          role_in_client?: string
          created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          client_id: string
          name: string
          email: string | null
          phone: string | null
          stage: string
          owner_user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          email?: string | null
          phone?: string | null
          stage?: string
          owner_user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          stage?: string
          owner_user_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_deals_board: {
        Row: {
          id: string
          account_id: string | null
          company_id: string | null
          stage_key: string
          title: string
          value_cents: number
          priority: string
          owner_id: string | null
          sla_due_at: string | null
          created_at: string
          updated_at: string
          company_name: string | null
          company_cnpj: string | null
          checklist_total: number | null
          checklist_done: number | null
          docs_count: number | null
          sla_status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      mark_thread_read: {
        Args: { p_thread_id: string }
        Returns: void
      }
      send_chat_message: {
        Args: { p_thread_id: string, p_body: string, p_is_internal: boolean }
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
