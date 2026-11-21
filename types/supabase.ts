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
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          plan: "trial" | "start" | "business" | "pro";
          minutes_used: number;
          minutes_limit: number;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          plan?: "trial" | "start" | "business" | "pro";
          minutes_used?: number;
          minutes_limit?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          plan?: "trial" | "start" | "business" | "pro";
          minutes_used?: number;
          minutes_limit?: number;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          industry: string | null;
          address: string | null;
          timezone: string;
          working_hours: Json;
          greeting: string | null;
          transfer_phone: string | null;
          vapi_assistant_id: string | null;
          phone_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          industry?: string | null;
          address?: string | null;
          timezone?: string;
          working_hours?: Json;
          greeting?: string | null;
          transfer_phone?: string | null;
          vapi_assistant_id?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          industry?: string | null;
          address?: string | null;
          timezone?: string;
          working_hours?: Json;
          greeting?: string | null;
          transfer_phone?: string | null;
          vapi_assistant_id?: string | null;
          phone_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      calls: {
        Row: {
          id: string;
          business_id: string;
          vapi_call_id: string | null;
          caller_phone: string | null;
          direction: "inbound" | "outbound";
          status: "queued" | "ringing" | "in-progress" | "ended" | "failed";
          duration_seconds: number;
          transcript: string | null;
          summary: string | null;
          sentiment: "positive" | "neutral" | "negative" | null;
          recording_url: string | null;
          cost: number;
          metadata: Json;
          started_at: string | null;
          ended_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          vapi_call_id?: string | null;
          caller_phone?: string | null;
          direction?: "inbound" | "outbound";
          status?: "queued" | "ringing" | "in-progress" | "ended" | "failed";
          duration_seconds?: number;
          transcript?: string | null;
          summary?: string | null;
          sentiment?: "positive" | "neutral" | "negative" | null;
          recording_url?: string | null;
          cost?: number;
          metadata?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          vapi_call_id?: string | null;
          caller_phone?: string | null;
          direction?: "inbound" | "outbound";
          status?: "queued" | "ringing" | "in-progress" | "ended" | "failed";
          duration_seconds?: number;
          transcript?: string | null;
          summary?: string | null;
          sentiment?: "positive" | "neutral" | "negative" | null;
          recording_url?: string | null;
          cost?: number;
          metadata?: Json;
          started_at?: string | null;
          ended_at?: string | null;
          created_at?: string;
        };
      };
      scenarios: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          system_prompt: string;
          first_message: string | null;
          tools: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          system_prompt: string;
          first_message?: string | null;
          tools?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          system_prompt?: string;
          first_message?: string | null;
          tools?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          call_id: string | null;
          client_name: string | null;
          client_phone: string | null;
          starts_at: string;
          ends_at: string | null;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          google_event_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          call_id?: string | null;
          client_name?: string | null;
          client_phone?: string | null;
          starts_at: string;
          ends_at?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          google_event_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          call_id?: string | null;
          client_name?: string | null;
          client_phone?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          google_event_id?: string | null;
          created_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: "trial" | "start" | "business" | "pro";
          status: "active" | "cancelled" | "past_due" | "trialing";
          yookassa_payment_id: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan: "trial" | "start" | "business" | "pro";
          status?: "active" | "cancelled" | "past_due" | "trialing";
          yookassa_payment_id?: string | null;
          current_period_start: string;
          current_period_end: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: "trial" | "start" | "business" | "pro";
          status?: "active" | "cancelled" | "past_due" | "trialing";
          yookassa_payment_id?: string | null;
          current_period_start?: string;
          current_period_end?: string;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type Call = Database["public"]["Tables"]["calls"]["Row"];
export type Scenario = Database["public"]["Tables"]["scenarios"]["Row"];
export type Appointment = Database["public"]["Tables"]["appointments"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
