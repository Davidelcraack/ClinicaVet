import { UserAuthContext } from "../context/UserAuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdministrarCita = () => {
  
  const {token, user} = useContext(UserAuthContext);
  const navigate = useNavigate()

  const goToHome = () => {
    navigate("/");
  };
  
  useEffect(() => {
    if (!user || !token || user.role !== 'admin') {
      navigate("/permission");
    }
  }, [user, token, navigate]); 

  return (
    <div>
      <div className='relative z-0 filter'>
          <img src='/images/banner.jpg' className='w-full h-auto '></img>
          <h2 className='text-4xl font-bold text-center text-[#004f6f]'>Bienvenido a la administracion de citas</h2>
          <button className="py-3 rounded-xl bg-[#0d6efd] text-white my-6 text-md w-[250px] font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all" onClick={goToHome}>Volver al inicio</button>
      </div>
    </div>
  );
};

export default AdministrarCita;