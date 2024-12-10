import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import { auth } from "@/lib/auth";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import PDFComparer from "./components/PDFComparer";
import HomePage from "./components/HomePage";

// Layout component for authenticated pages
const Layout = ({ children }: any) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">plgrzr</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

// Auth pages layout
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">plgrzr</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Welcome to plgrzr</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="bg-background">
                <Login />
              </TabsContent>
              <TabsContent value="signup" className="bg-background">
                <SignUp />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

// Protected Route component with bypass
const ProtectedRoute = ({ children }) => {
  const session = auth.useSession();

  // Development bypass - REMOVE IN PRODUCTION
  const BYPASS_AUTH = true;
  if (BYPASS_AUTH) {
    return children;
  }

  if (!session.data) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Dashboard component with mock data
const Dashboard = () => {
  const session = auth.useSession();

  // Development mock data - REMOVE IN PRODUCTION
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          Hello, {session.data?.user?.name || mockUser.name}!
        </CardContent>
      </Card>
      <PDFComparer />
    </div>
  );
};

// Home layout component
const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">plgrzr</h1>
          <ModeToggle />
        </div>
      </header>
      <HomePage />
    </div>
  );
};

const App = () => {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
