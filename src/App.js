import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';

import Login from './app/pages/Login';
import Register from './app/pages/Register';
import Task from './app/pages/task'
import ProtectedRoute from './app/components/routing/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route element={<ProtectedRoute />}>
          <Route path="/task" element={<Task />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
