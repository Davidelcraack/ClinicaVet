import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoMdMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { UserAuthContext } from '../context/UserAuthContext'; 
import { useNavigate } from 'react-router-dom';



const NavbarUser = () => {
  const {logOut} = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    logOut();
    navigate("/")
  }

  return (
    <div className='fixed top-0 left-0 z-50 w-full'>
      <div className='z-100 flex justify-between items-center h-24 max-w-[100%] mx-auto px-4 text-white bg-[#0d6efd]'>
        {/* Logo */}
        <div className="flex items-center">
        <Link to= "/">
          <img src="images\logo.png" alt="Logo" className="w-auto h-10 mr-2" />
        </Link>
          <h1 className='text-3xl font-bold text-[#fff]'> Menú del Usuario</h1>
        </div>
        {/* Menu principal que se va cuando la pantalla es pequeña */}
        <ul className="hidden md:flex">
          <li className="p-4"><Link to="/dashboard">Dashboard</Link></li>
          <li className="p-4"><Link to="/crear-cita">Crear cita</Link></li>
          <li className="p-4"><Link to="/crear-mascota">Agregar mascota</Link></li>
          <li className="flex items-center justify-center pt-4 pb-4 no-underline border-b-2 border-b-white"><button onClick={handleLogout}>Cerrar sesion</button></li>
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
        <Link to="/">
          <img src="images\logo.png" alt="Logo" className="w-auto h-16" />
        </Link>
        </div>
        <li className="p-4 border-b-2 border-b-white"><Link to="/dashboard">Dashboard</Link></li>
        <li className="p-4 border-b-2 border-b-white"><Link to="/crear-cita">Crear cita</Link></li>
        <li className="p-4 border-b-2 border-b-white"><Link to="/crear-mascota">Agregar mascota</Link></li>
       <li className="flex items-center justify-center pt-4 pb-4 no-underline border-b-2 border-b-white"><button onClick={handleLogout}>Cerrar sesion</button></li>  
      </ul>
    </div>
  )
}

export default NavbarUser;
