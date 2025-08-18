// src/auth/RouteGuards.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function RequireAuth() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <div className="p-4 text-muted">Loading…</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function RequireAdmin() {
  const { isLoading, isAdmin } = useAuth();
  if (isLoading) return <div className="p-4 text-muted">Loading…</div>;
  // Return 404-like page to avoid revealing admin route
  return isAdmin ? <Outlet /> : <Navigate to="/not-found" replace />;
}

export function RequireWorker() {
  const { isLoading, isWorker } = useAuth();
  if (isLoading) return <div className="p-4 text-muted">Loading…</div>;
  return isWorker ? <Outlet /> : <Navigate to="/not-found" replace />;
}

export function RequireStoreKeeper() {
  const { isLoading, isStoreKeeper } = useAuth();
  if (isLoading) return <div className="p-4 text-muted">Loading…</div>;
  return isStoreKeeper ? <Outlet /> : <Navigate to="/not-found" replace />;
}

// For pages accessible by multiple roles:
export function RequireRoles({ roles }) {
  const { isLoading, user } = useAuth();
  if (isLoading) return <div className="p-4 text-muted">Loading…</div>;
  return user && roles.includes(user.role) ? <Outlet /> : <Navigate to="/not-found" replace />;
}