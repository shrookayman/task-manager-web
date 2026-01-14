import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom';

import Login from './app/pages/Login';
import Register from './app/pages/Register';
import Task from './app/pages/task'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/task" element={<Task />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
