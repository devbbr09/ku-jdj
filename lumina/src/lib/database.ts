import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

// User Service
export const userService = {
  async createUser(data: { email: string; name?: string; passwordHash?: string }) {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
      })
      .select()
      .single();
    if (error) throw error;
    return user;
  },

  async getUserByEmail(email: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error; // PGRST116: No rows found
    return user;
  },

  async getUserById(id: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return user;
  },
};

// Analysis Service
export const analysisService = {
  async createAnalysis(data: {
    userId: string;
    styleId?: string;
    imageUrl: string;
    score: number;
    feedback: string;
    details?: Record<string, unknown>;
  }) {
    const { data: analysis, error } = await supabaseAdmin
      .from('analyses')
      .insert({
        user_id: data.userId,
        style_id: data.styleId,
        image_url: data.imageUrl,
        score: data.score,
        feedback: data.feedback,
        details: data.details,
      })
      .select()
      .single();
    if (error) throw error;
    return analysis;
  },

  async getAnalysisByUserId(userId: string) {
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return analyses;
  },
};
