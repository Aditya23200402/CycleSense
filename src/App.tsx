import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { CycleProvider } from "./context/CycleContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MainLayout } from "./components/layout/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import PCOSPredictor from "./pages/PCOSPredictor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// This would normally be handled by your authentication system
const AuthenticatedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// A layout component to wrap the main logged-in pages
const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  return (
    <MainLayout onLogout={handleLogout}>
      {children}
    </MainLayout>
  );
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* Protected routes */}
    <Route 
      path="/dashboard" 
      element={
        <AuthenticatedRoute>
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        </AuthenticatedRoute>
      } 
    />
    <Route 
      path="/calendar" 
      element={
        <AuthenticatedRoute>
          <ProtectedLayout>
            <Calendar />
          </ProtectedLayout>
        </AuthenticatedRoute>
      } 
    />
    <Route 
      path="/profile" 
      element={
        <AuthenticatedRoute>
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        </AuthenticatedRoute>
      } 
    />
    <Route 
      path="/notifications" 
      element={
        <AuthenticatedRoute>
          <ProtectedLayout>
            <Notifications />
          </ProtectedLayout>
        </AuthenticatedRoute>
      } 
    />
    <Route 
      path="/pcos-predictor" 
      element={
        <AuthenticatedRoute>
          <ProtectedLayout>
            <PCOSPredictor />
          </ProtectedLayout>
        </AuthenticatedRoute>
      } 
    />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CycleProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CycleProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
