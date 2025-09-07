import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Schedule from './pages/Schedule.jsx';
import Budget from './pages/Budget.jsx';
import Planner from './pages/Planner.jsx';
import QA from './pages/QA.jsx';
import Focus from './pages/Focus.jsx';
import AI from './pages/AI.jsx';
import MindMap from './pages/MindMap.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AppShell from './layouts/AppShell.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes - Wrapped in AppShell */}
      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/focus" element={<Focus />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/mindmap" element={<MindMap />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
