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

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          stage: string;
          owner_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          stage?: string;
          owner_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          stage?: string;
          owner_user_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          id: string
          name: string
          plan: string
          settings: Json
          financial_system_enabled: boolean
          financial_system_partner: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          plan?: string
          settings?: Json
          financial_system_enabled?: boolean
          financial_system_partner?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          plan?: string
          settings?: Json
          financial_system_enabled?: boolean
          financial_system_partner?: string | null
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
          role_global: UserRoleGlobal
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          account_id?: string | null
          full_name?: string | null
          email: string
          role_global?: UserRoleGlobal
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          full_name?: string | null
          email?: string
          role_global?: UserRoleGlobal
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
      deal_checklist_items: {
        Row: {
          id: string
          deal_id: string | null
          title: string
          done: boolean
          created_at: string
        }
        Insert: {
          id?: string
          deal_id?: string | null
          title: string
          done?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          deal_id?: string | null
          title?: string
          done?: boolean
          created_at?: string
        }
        Relationships: []
      }
      deal_docs: {
        Row: {
          id: string
          account_id: string | null
          deal_id: string | null
          name: string
          storage_path: string
          file_type: string | null
          file_size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id?: string | null
          deal_id?: string | null
          name: string
          storage_path: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          deal_id?: string | null
          name?: string
          storage_path?: string
          file_type?: string | null
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
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
          account_id: string | null
          created_by: string
          slug: string
          status: string
          title: string | null
          description: string | null
          published_version: number | null
          published_schema_json: Json
          published_schema_version: number | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id?: string | null
          created_by: string
          slug: string
          status?: string
          title?: string | null
          description?: string | null
          published_version?: number | null
          published_schema_json?: Json
          published_schema_version?: number | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string | null
          created_by?: string
          slug?: string
          status?: string
          title?: string | null
          description?: string | null
          published_version?: number | null
          published_schema_json?: Json
          published_schema_version?: number | null
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
          version: number
          schema_json: Json
          theme_json: Json
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          version: number
          schema_json?: Json
          theme_json?: Json
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          version?: number
          schema_json?: Json
          theme_json?: Json
          notes?: string | null
          created_by?: string
          created_at?: string
        }
        Relationships: []
      }
      templeteria_ai_jobs: {
        Row: {
          id: string
          site_id: string | null
          version_id: string | null
          job_type: string
          status: string
          prompt: string | null
          result_json: Json
          error: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id?: string | null
          version_id?: string | null
          job_type: string
          status?: string
          prompt?: string | null
          result_json?: Json
          error?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string | null
          version_id?: string | null
          job_type?: string
          status?: string
          prompt?: string | null
          result_json?: Json
          error?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fiscal_events: {
        Row: {
          id: string
          account_id: string
          type: string
          title: string
          due_date: string
          recurring: boolean
          recurrence_rule: string | null
          status: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          type: string
          title: string
          due_date: string
          recurring?: boolean
          recurrence_rule?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          type?: string
          title?: string
          due_date?: string
          recurring?: boolean
          recurrence_rule?: string | null
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      account_checklist: {
        Row: {
          id: string
          account_id: string
          cnae_validado: boolean
          regime_definido: boolean
          certificado_emitido: boolean
          conta_bancaria_criada: boolean
          portal_fiscal_ativo: boolean
          notes: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          cnae_validado?: boolean
          regime_definido?: boolean
          certificado_emitido?: boolean
          conta_bancaria_criada?: boolean
          portal_fiscal_ativo?: boolean
          notes?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          cnae_validado?: boolean
          regime_definido?: boolean
          certificado_emitido?: boolean
          conta_bancaria_criada?: boolean
          portal_fiscal_ativo?: boolean
          notes?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nf_requests: {
        Row: {
          id: string
          account_id: string
          requester_id: string
          customer_cnpj_cpf: string
          amount_cents: number
          description: string
          service_date: string | null
          status: string
          rejection_reason: string | null
          pdf_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          requester_id: string
          customer_cnpj_cpf: string
          amount_cents: number
          description: string
          service_date?: string | null
          status?: string
          rejection_reason?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          requester_id?: string
          customer_cnpj_cpf?: string
          amount_cents?: number
          description?: string
          service_date?: string | null
          status?: string
          rejection_reason?: string | null
          pdf_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      fiscal_tickets: {
        Row: {
          id: string
          account_id: string
          type: string
          priority: string
          status: string
          assigned_to: string | null
          entity_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          type: string
          priority?: string
          status?: string
          assigned_to?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          type?: string
          priority?: string
          status?: string
          assigned_to?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      das_guides: {
        Row: {
          id: string
          account_id: string
          month_ref: string
          storage_path: string
          status: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          month_ref: string
          storage_path: string
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          month_ref?: string
          storage_path?: string
          status?: string
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      company_finance_metrics: {
        Row: {
          id: string
          account_id: string
          month_ref: string
          revenue_month: number
          revenue_accum: number
          taxes_paid: number
          taxes_open: number
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          month_ref: string
          revenue_month?: number
          revenue_accum?: number
          taxes_paid?: number
          taxes_open?: number
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          month_ref?: string
          revenue_month?: number
          revenue_accum?: number
          taxes_paid?: number
          taxes_open?: number
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          account_id: string
          plan_name: string
          status: string
          price_monthly: number
          started_at: string
          canceled_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          plan_name: string
          status: string
          price_monthly?: number
          started_at?: string
          canceled_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          plan_name?: string
          status?: string
          price_monthly?: number
          started_at?: string
          canceled_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      fiscal_event_notifications: {
        Row: {
          id: string
          event_id: string
          account_id: string
          notification_type: string
          sent_at: string
        }
        Insert: {
          id?: string
          event_id: string
          account_id: string
          notification_type: string
          sent_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          account_id?: string
          notification_type?: string
          sent_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          account_id: string
          user_id: string | null
          title: string
          body: string
          type: string
          link: string | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          user_id?: string | null
          title: string
          body: string
          type: string
          link?: string | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          user_id?: string | null
          title?: string
          body?: string
          type?: string
          link?: string | null
          read_at?: string | null
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
      v_product_finance_bi: {
        Row: {
          accumulated_revenue: number | null
          avg_revenue_per_user: number | null
          ticket_average: number | null
          churn_rate_30d: number | null
        }
        Relationships: []
      }
      v_dashboard_stats: {
        Row: {
          account_id: string
          total_pipeline_cents: number
          active_deals: number
          overdue_count: number
          sla_avg_days: number
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
      seed_dev_data: {
        Args: Record<string, never>
        Returns: Json
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
