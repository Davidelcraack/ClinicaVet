import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { UserAuthContext } from '../context/UserAuthContext';

const Administrador = () => {

  const {token, user, logOut} = useContext(UserAuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      navigate("/permission");
    }
  }, [user, token, navigate]); 

  function handleLogout() {
    logOut();
    navigate('/');
  }
  
  //Encontrar la forma que mediante el token me de los datos

  return (
    <div>
      <NavbarAdmin/>
      {/* Aquí puedes añadir el resto*/}
      <div>
         
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Administrador;
