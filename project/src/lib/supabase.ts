// This is a mock implementation that doesn't actually use Supabase
// but provides the same interface for compatibility

export const supabase = {
  auth: {
    signInWithPassword: async () => {
      return { data: {}, error: null };
    },
    signUp: async () => {
      return { data: {}, error: null };
    },
    signOut: async () => {
      return { error: null };
    },
    getUser: async () => {
      return { data: {}, error: null };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    signInWithOAuth: async () => {
      return { data: {}, error: null };
    },
    unlinkIdentity: async () => {
      return { data: {}, error: null };
    },
    admin: {
      deleteUser: async () => {
        return { data: {}, error: null };
      }
    }
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => {
          return { data: {}, error: null };
        },
        limit: () => ({
          single: async () => {
            return { data: {}, error: null };
          }
        }),
        order: () => ({
          limit: () => ({
            single: async () => {
              return { data: {}, error: null };
            }
          })
        })
      }),
      order: () => ({
        limit: () => ({
          single: async () => {
            return { data: {}, error: null };
          }
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: async () => {
          return { data: {}, error: null };
        }
      })
    }),
    update: () => ({
      eq: () => ({
        single: async () => {
          return { data: {}, error: null };
        }
      })
    })
  }),
  functions: {
    invoke: async () => {
      return { data: {}, error: null };
    }
  }
};

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return !!supabaseUrl && !!supabaseAnonKey && supabaseUrl !== 'https://your-project-ref.supabase.co';
};