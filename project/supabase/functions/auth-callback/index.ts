import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Get the authorization code from the URL
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/galaxy';
  
  if (!code) {
    return new Response(
      JSON.stringify({ error: 'No code provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) throw error;

    // Get user data
    const { data: userData, error: userError } = await supabase.auth.getUser(data.session?.access_token);
    
    if (userError) throw userError;
    
    const user = userData.user;
    
    // Check if user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
    
    // If no profile exists, create one
    if (profileError && profileError.code === 'PGRST116') {
      // Get provider info
      const provider = user?.app_metadata?.provider || 'email';
      const providerName = provider === 'google' ? 'Gmail' : 
                          provider === 'tiktok' ? 'TikTok' : 
                          provider === 'twitter' ? 'X' : 'Email';
      
      // Create default username from provider data
      let username = '';
      if (provider === 'google') {
        username = user?.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase() || 
                  user?.email?.split('@')[0] || 
                  `user_${Date.now()}`;
      } else if (provider === 'tiktok' || provider === 'twitter') {
        username = user?.user_metadata?.preferred_username || 
                  user?.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase() || 
                  `user_${Date.now()}`;
      }
      
      // Create profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user?.id,
          username,
          email: user?.email,
          user_type: 'partygoer', // Default to partygoer
          level: 1,
          beatcoins: 100,
          created_at: new Date(),
          auth_provider: provider,
          profile_image: user?.user_metadata?.avatar_url
        });
      
      if (insertError) throw insertError;
    }
    
    // Redirect to the app
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${url.origin}${next}`
      }
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});