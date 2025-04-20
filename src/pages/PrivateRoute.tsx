import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute = ({ element }: PrivateRouteProps) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('username') !== null;
  
  console.log('Auth check:', { 
    isAuthenticated, 
    storedUsername: localStorage.getItem('username')
  });

  if (!isAuthenticated) {
    // Redirect to login page while saving the attempted url
    // return <Navigate to="/login" state={{ from: location }} replace />;
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;