import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate("/");
        }
        if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
          navigate("/auth");
        }
        // Handle auth errors
        if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
          toast({
            title: "Success",
            description: "Your password has been updated successfully.",
          });
        }
      }
    );

    // Listen for auth errors
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast({
          variant: "destructive",
          title: "Signed out",
          description: "You have been signed out.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              VOICEGUARDAI
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to access advanced AI-powered deepfake detection
          </p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-lg border">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                    inputBackground: 'white',
                    inputText: 'black',
                  },
                },
              },
              style: {
                input: {
                  backgroundColor: 'white',
                  color: 'black',
                },
                message: {
                  color: 'hsl(var(--destructive))',
                  backgroundColor: 'hsl(var(--destructive) / 0.1)',
                  padding: '8px',
                  marginTop: '4px',
                  borderRadius: '4px',
                },
              },
            }}
            providers={[]}
            onError={(error) => {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;