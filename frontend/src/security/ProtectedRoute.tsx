import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useRecoilValue } from 'recoil';
import { isAuthenticatedAtom } from '../store/Atom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("authToken");
  const isAuthenticated= useRecoilValue(isAuthenticatedAtom);

  /**
   * Note: This can still be bypassed if someone manually creates
   * a token key in sessionStorage with any value.
   * For better security, implement proper token validation (e.g., call backend API to validate token authenticity).
   */

  if (!isAuthenticated || !token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}