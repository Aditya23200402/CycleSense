
import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleLogin = () => {
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cycle-purple-light to-white p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="hidden md:block bg-cycle-purple p-8 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold mb-3">CycleSense</h1>
            <p className="text-cycle-purple-light mb-6">Track your cycle. Understand your body.</p>
            <div className="w-32 h-32 mx-auto rounded-full bg-white bg-opacity-10 flex items-center justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-cycle-purple rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-0 flex items-center justify-center">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;
