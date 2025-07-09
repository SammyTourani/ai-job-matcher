import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Server-side Supabase client for API routes
export const createSupabaseServerClient = (
  request: NextRequest,
  response: NextResponse
) => {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        request.cookies.set({
          name,
          value,
          ...options,
        });
        response.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name: string, options: any) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        });
        response.cookies.set({
          name,
          value: '',
          ...options,
        });
      },
    },
  });
};

// Database schema types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          salary_min: number | null;
          salary_max: number | null;
          description: string;
          requirements: string[];
          skills: string[];
          experience_level: 'entry' | 'mid' | 'senior' | 'executive';
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
          remote_option: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          company: string;
          location: string;
          salary_min?: number | null;
          salary_max?: number | null;
          description: string;
          requirements: string[];
          skills: string[];
          experience_level: 'entry' | 'mid' | 'senior' | 'executive';
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
          remote_option?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          company?: string;
          location?: string;
          salary_min?: number | null;
          salary_max?: number | null;
          description?: string;
          requirements?: string[];
          skills?: string[];
          experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          remote_option?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_url: string;
          extracted_text: string;
          parsed_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          filename: string;
          file_url: string;
          extracted_text: string;
          parsed_data: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_url?: string;
          extracted_text?: string;
          parsed_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_matches: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          resume_id: string;
          match_score: number;
          skills_match: number;
          experience_match: number;
          location_match: number;
          title_match: number;
          explanation: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          resume_id: string;
          match_score: number;
          skills_match: number;
          experience_match: number;
          location_match: number;
          title_match: number;
          explanation: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          resume_id?: string;
          match_score?: number;
          skills_match?: number;
          experience_match?: number;
          location_match?: number;
          title_match?: number;
          explanation?: string;
          created_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          resume_id: string;
          status: 'pending' | 'applied' | 'interview' | 'rejected' | 'accepted';
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_id: string;
          resume_id: string;
          status?: 'pending' | 'applied' | 'interview' | 'rejected' | 'accepted';
          applied_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_id?: string;
          resume_id?: string;
          status?: 'pending' | 'applied' | 'interview' | 'rejected' | 'accepted';
          applied_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};