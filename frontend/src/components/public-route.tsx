import { useAuth } from '../hooks/use-auth';
import { Navigate } from 'react-router';
import { LoadingScreen } from './loading-screen';

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  console.log(status)

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
