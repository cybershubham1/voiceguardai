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
        if (event === 'SIGNED_OUT') {
          navigate("/auth");
        }
        if (event === 'PASSWORD_RECOVERY') {
          toast({
            title: "Success",
            description: "Your password has been updated successfully.",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Auth Form Section */}
        <div className="bg-secondary/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-accent/20">
          <div className="flex items-center justify-start gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              VOICEGUARDAI
            </h1>
          </div>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputText: 'white',
                    brandButtonText: "white",
                  },
                },
              },
              style: {
                anchor: {
                  color: 'white',
                },
                button: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  height: '45px',
                  fontSize: '16px',
                },
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  height: '45px',
                },
                message: {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '8px',
                },
                container: {
                  color: 'white',
                },
                divider: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                label: {
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '8px',
                },
              },
              className: {
                button: 'hover:bg-primary hover:border-primary transition-all duration-200',
                container: 'space-y-4',
                label: 'font-medium',
                input: 'focus:border-primary transition-colors duration-200',
                anchor: 'text-white hover:text-primary transition-colors duration-200',
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}`}
            magicLink={false}
          />
        </div>

        {/* Illustration Section */}
        <div className="hidden md:flex items-center justify-center p-8">
          <div className="relative w-full h-full max-w-md">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl backdrop-blur-3xl" />
            <div className="relative p-8 text-center space-y-4">
              <h2 className="text-3xl font-bold text-white">Welcome to VoiceGuardAI</h2>
              <p className="text-gray-300">
                Your trusted partner in deepfake detection. Protect yourself from digital manipulation with real-time content verification.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;