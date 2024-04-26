import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../context/UserAuthContext'; 


const Navbar = () => {
  const {token, logOut} = useContext(UserAuthContext);
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    logOut();
  }

  return (
    <div className='relative'>
      <div className='z-100 flex justify-between items-center h-24 max-w-[100%] mx-auto px-4 text-white bg-[#0d6efd]'>
        {/* Logo */}
        <div className="flex items-center">
          <img src="images\logo.png" alt="Logo" className="h-10 w-auto mr-2" />
          <h1 className='text-3xl font-bold text-[#fff]'>Clinica Veterinaria Ciudad Guzman</h1>
        </div>
        {/* Menu principal que se va cuando la pantalla es pequeña */}
        <ul className="hidden md:flex">
          <li className="p-4"><Link to="/">Inicio</Link></li>
          <li className="p-4"><Link to="/services">Servicios</Link></li>
          <li className="p-4"><Link to="/about">La clinica</Link></li>
          <li className="p-4"><Link to="/contact">Contacto</Link></li>
          {!token ? <li className="flex items-center justify-center pt-4 pb-4 border-b-2 border-b-white"><Link to="/login">Iniciar sesión</Link></li> : <li className="flex items-center justify-center pt-4 pb-4 border-b-2 border-b-white no-underline"><button onClick={handleLogout}>Cerrar sesion</button></li>}
        </ul>
        
        {/* Boton de menu para pantallas pequeñas */}
        <div onClick={handleNav} className='block md:hidden'>
          {!nav ? <IoMdMenu size={20} /> : <RxCross1 size={20} />}
        </div>
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      <ul className={`fixed z-10 left-0 top-0 w-[35%] h-full border-r-2 border-r-white text-white bg-[#0d6efd] ease-in-out transition-transform duration-500 ${nav ? 'transform translate-x-0' : 'transform -translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center justify-center my-4">
          <img src="images\logo.png" alt="Logo" className="h-16 w-auto" />
        </div>
        <li className="p-4 mt-3 border-b-2 border-b-white"><Link to="/">Inicio</Link></li>
        <li className="p-4 border-b-2 border-b-white"><Link to="/services">Servicios</Link></li>
        <li className="p-4 border-b-2 border-b-white"><Link to="/about">La clinica</Link></li>
        <li className="p-4 border-b-2 border-b-white"><Link to="/contact">Contacto</Link></li>
        {!token ? <li className="flex items-center justify-center pt-4 pb-4 border-b-2 border-b-white"><Link to="/login">Iniciar sesión</Link></li> : <li className="flex items-center justify-center pt-4 pb-4 border-b-2 border-b-white no-underline"><button onClick={handleLogout}>Cerrar sesion</button></li>}
         
      </ul>
    </div>
  )
}

export default Navbar;
