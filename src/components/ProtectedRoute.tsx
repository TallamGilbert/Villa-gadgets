import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Subscribe to auth changes (e.g., logout, token refresh)
    // This makes the app reactive to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Show loading state while checking the session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Verifying access...</p>
      </div>
    );
  }

  // 4. Redirect to login if no session exists
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // 5. Whitelist check (The "Admin" gate)
  // If the logged-in user is not you, send them to the public home page
  if (session.user.email !== "tallamgilbert084@gmail.com") {
    return <Navigate to="/" replace />;
  }

  // 6. Authorized: Render the admin content
  return <>{children}</>;
}
