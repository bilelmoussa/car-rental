import './App.css'
import { Routes, Route } from "react-router"
import Home from "./routes/home";
import { PublicRoute } from './components/public-route';
import { ProtectedRoute } from './components/protected-route';
import Admin from './routes/admin';

function App() {
  return (
    <Routes>
      <Route index element={<PublicRoute><Home /></PublicRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
