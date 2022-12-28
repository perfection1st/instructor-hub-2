import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home } from './routes/Home';
import { Login } from './routes/Login';
import { Register } from './routes/Register';
import { PageNotFound } from './routes/PageNotFound';
import { Route, Routes, BrowserRouter } from "react-router-dom";

export const App = ({ auth }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(auth ? auth.isLoggedIn : false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}