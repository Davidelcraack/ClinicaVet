// App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import Login from './auth/Login';
import Register from './auth/Register';
import CrearCita from './user/CrearCita';
import UserAuthProvider from './context/UserAuthContext';


function App() {
 
  return (
  <UserAuthProvider>    
    <Router>
      <Routes>
        {/* Definir la ruta para la página de inicio */}
        <Route path="/" element={<Home/>} />
        {/* Resto de las rutas */}
        <Route path="/services" element={<Services/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/crear-cita" element={<CrearCita />} />
      </Routes>
    </Router>
  </UserAuthProvider>
    );
}

export default App;
