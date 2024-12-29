import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import { TransactionProvider } from "./context/TransactionContext";
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import Spinner from "./components/Spinner";

import PropTypes from "prop-types";

const RequireAuth = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Spinner loading={loading} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Or a more user-friendly error message
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" replace />; // Use replace to prevent going back to the protected route
  }

  return children; // Render the protected component if authenticated
};

const ProtectedLayout = () => {
  return (
    <RequireAuth>
      <TransactionProvider>
        <Outlet />
      </TransactionProvider>
    </RequireAuth>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
