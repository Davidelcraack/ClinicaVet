import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

const Administrador = () => {

  const {token, user, logOut} = useContext(UserAuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/permission");
    }
  }, [user, token, navigate]); 

  function handleLogout() {
    logOut();
    navigate('/');
  }
  
  //Encontrar la forma que mediante el token me de los datos

  return (
    <div className='bg-sky-300 w-screen h-screen'>
      <NavbarAdmin/>
      {/* Aquí puedes añadir el resto*/}
      <div className='py-8 bg-sky-400'>
      <h2 className="font-semibold text-xl text-gray-800 leading-tight ">
            Bienvenido a la vista de administrador
        </h2>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Administrador;
