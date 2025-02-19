import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");

  return (
    <Route
      {...rest}
      element={token ? (
        <Component /> // Render the component if the user is authenticated
      ) : (
        <Navigate to="/" replace /> // Redirect to home page if not authenticated
      )}
    />
  );
};

export default ProtectedRoute;
