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

export type OnboardingStepStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'NEEDS_FIX'
  | 'APPROVED';

export type DocumentStatus = 'RECEIVED' | 'INVALID' | 'APPROVED';

export type TicketType = 'TICKET_CNPJ' | 'TICKET_INPI' | 'TICKET_FISCAL';

export type TicketStatus =
  | 'NEW'
  | 'WAITING_CLIENT'
  | 'READY'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'PENDING_EXTERNAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'DONE';

export type TicketPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type MessageVisibility = 'CLIENT' | 'INTERNAL';

export type NotificationType =
  | 'STATUS_CHANGED'
  | 'DOC_REQUIRED'
  | 'DOC_APPROVED'
  | 'MESSAGE_RECEIVED'
  | 'REPORT_READY'
  | 'PAYMENT_INVOICE'
  | 'TASK_ASSIGNED';

export type LeadStage =
  | 'NOVO'
  | 'CONTATO'
  | 'QUALIFICADO'
  | 'PROPOSTA'
  | 'FECHADO'
  | 'PERDIDO';

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role_global: UserRoleGlobal;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      clients: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          status: ClientStatus;
          fantasy_name: string | null;
          cnpj: string | null;
          segment: string | null;
          city: string | null;
          state: string | null;
          address_json: Record<string, unknown>;
          contacts_json: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      client_memberships: {
        Row: {
          id: string;
          client_id: string;
          user_id: string;
          role_in_client: ClientRole;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['client_memberships']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['client_memberships']['Insert']>;
      };
      onboarding_steps: {
        Row: {
          id: string;
          client_id: string;
          step_key: string;
          status: OnboardingStepStatus;
          data_json: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['onboarding_steps']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['onboarding_steps']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          client_id: string;
          category: string;
          filename: string;
          storage_path: string;
          file_size: number | null;
          mime_type: string | null;
          status: DocumentStatus;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      tickets: {
        Row: {
          id: string;
          client_id: string;
          type: TicketType;
          status: TicketStatus;
          priority: TicketPriority;
          assigned_to: string | null;
          sla_due_at: string | null;
          data_json: Record<string, unknown>;
          timeline: unknown[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>;
      };
      notifications: {
        Row: {
          id: string;
          client_id: string | null;
          user_id: string;
          type: NotificationType;
          title: string;
          body: string;
          entity_type: string | null;
          entity_id: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          client_id: string;
          form_id: string | null;
          name: string;
          email: string | null;
          phone: string | null;
          source: string | null;
          tags_json: unknown[];
          stage: LeadStage;
          owner_user_id: string | null;
          custom_fields: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
    };
  };
}
