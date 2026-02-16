import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/authpage';
import Management from './pages/Management';
import BudgetManager from './pages/BudgetManager';
import ProtectedRoute from './ProtectedRoute';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<LoginPage />} />
    <Route path="/management" element={
        <ProtectedRoute><Management /></ProtectedRoute>
    } />
    <Route path="/budgetmanager" element={
        <ProtectedRoute><BudgetManager /></ProtectedRoute>
    } />
</Routes>
    </BrowserRouter>
    </>
  )
}

export default App