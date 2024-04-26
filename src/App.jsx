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
import AdministrarCita from './admin/AdministrarCitas';
import Permission from './permission/Permission';
import CrearMascota from './user/CrearMascota';
import Administrador from './admin/Administrador';
import AdministrarDetallesCita from './admin/AdministrarDetallesCita';
import AdministrarMascota from './admin/AdministrarMascota';

function App() {

  return (
  <Router>
    <UserAuthProvider>    
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
        <Route path='/admin' element={<Administrador />}/>
        <Route path="/administrar-cita" element={<AdministrarCita />} />
        <Route path="/detalles-cita" element={<AdministrarDetallesCita/>} />
        <Route path='/crear-mascota' element={<CrearMascota />}/>
        <Route path='/administrar-mascota' element={<AdministrarMascota/>}/>
        <Route path='/permission' element={<Permission/>}/>
      </Routes>
    </UserAuthProvider>
  </Router>
    );

}

export default App;
