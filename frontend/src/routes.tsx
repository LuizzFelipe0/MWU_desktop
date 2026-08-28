import React from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout/index.tsx';
import NotFoundPage from './pages/NotFound/index.tsx';
import HomePage from './pages/Home/index.tsx';
import { useAuth } from './hooks/useAuth.tsx';
import LoginPage from './pages/Login/index.tsx';
import FinancialGoalsPage from './pages/FinancialGoals/index.tsx';
import AddFinancialGoalPage from './pages/FinancialGoals/Add/index.tsx';
import UpdateFinancialGoalPage from './pages/FinancialGoals/Update/index.tsx';
import CategoriesPage from './pages/Categories/index.tsx';
import AddCategoryPage from './pages/Categories/Add/index.tsx';
import UpdateCategoryPage from './pages/Categories/Update/index.tsx';
import AccountsPage from './pages/Accounts/index.tsx';
import AddAccountPage from './pages/Accounts/Add/index.tsx';
import UpdateAccountPage from './pages/Accounts/Update/index.tsx';
import TransactionsPage from './pages/Transactions/index.tsx';
import AddTransactionPage from './pages/Transactions/Add/index.tsx';
import UpdateTransactionPage from './pages/Transactions/Update/index.tsx';
import DashboardPage from './pages/Dashboard/index.tsx';
import AddUserPage from './pages/User/Add/index.tsx';
import UpdateUserPage from './pages/User/Update/index.tsx';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const MWURoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!user ? <AddUserPage /> : <Navigate to="/" />}
      />

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<UpdateUserPage />} />
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="accounts" element={<AccountsPage />}>
            <Route path="add" element={<AddAccountPage />} />
            <Route path=":id" element={<UpdateAccountPage />} />
          </Route>

          <Route path="categories" element={<CategoriesPage />}>
            <Route path="add" element={<AddCategoryPage />} />
            <Route path=":id" element={<UpdateCategoryPage />} />
          </Route>

          <Route path="financial-goals" element={<FinancialGoalsPage />}>
            <Route path="add" element={<AddFinancialGoalPage />} />
            <Route path=":id" element={<UpdateFinancialGoalPage />} />
          </Route>

          <Route path="transactions" element={<TransactionsPage />}>
            <Route path="add" element={<AddTransactionPage />} />
            <Route path=":id" element={<UpdateTransactionPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default MWURoutes;
