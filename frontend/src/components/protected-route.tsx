import { useAuth } from '../hooks/use-auth';
import { Navigate } from 'react-router';
import { LoadingScreen } from './loading-screen';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
