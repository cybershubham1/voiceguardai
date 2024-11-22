import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, User } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error loading profile",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      setEditing(false);
      getProfile();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating profile",
      });
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold">Profile</h1>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-lg border space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <User className="w-12 h-12 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{profile?.full_name || 'Anonymous User'}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Input
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={updateProfile}>Save Changes</Button>
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <p className="text-muted-foreground">{profile?.bio || 'No bio added yet'}</p>
              </div>
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;