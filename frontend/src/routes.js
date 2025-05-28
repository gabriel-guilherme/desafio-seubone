// routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Pecas from './pages/Pecas';
import MainLayout from './layouts/MainLayout/MainLayout';
import PecaForm from './pages/PecaForm';
import EditPeca from './pages/EditPeca';
import PecasMontagem from './pages/PecasMontagem';
import PecasVisualizacao from './pages/PecasVisualizacao';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />} >
          <Route path="/" element={<Pecas />} />
          <Route path="/pecas" element={<Pecas/>} />
          <Route path="/pecas/add" element={<PecaForm/>} />
          <Route path="/pecas/:id" element={<EditPeca/>} />
          <Route path="/montagem" element={<PecasMontagem/>} />
          <Route path="/visualizacao" element={<PecasVisualizacao />} />
          <Route path="/clientes" element={<h1>Clientes</h1>} />

          
        </Route>
  
      <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
    </Routes>
  );
};

export default AppRoutes;
