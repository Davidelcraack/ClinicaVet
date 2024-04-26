// Hero.js
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";


const Hero = () => {

  const {user, token} = useContext(UserAuthContext);
  
  const navigate = useNavigate()

  const handleClick = () => {
    if ( user.role == "admin") {

      navigate("/crear-cita");
    }

    if(user.role == "user"){
      navigate("/crear-cita");
    }
  
    if (!token) {
      navigate("/login");
    }
    //console.log(user && user.role);
  }

  const handleAdmin = () => {
    navigate("/administrar-cita");
  }


  return (
    <div className='relative text-white z-0'>
      <div className='relative bg-hero bg-no-repeat bg-cover filter text-white h-screen flex flex-col justify-center items-center text-balance'>
        {/* Contenido */}
        <div className='relative max-w-[90%] md:max-w-[800px] mx-auto text-center  rounded-xl bg-white/15'>
          <h1 className='text-balance md:text-6xl sm:text-5xl text-4xl font-bold md:py-6'>
            SERVICIOS VETERINARIOS <span className="md:text-5xl sm:text-4xl text-3xl font-bold md:py-6">CIUDAD GUZMAN</span>
          </h1>
          <p className='md:text-2xl text-xl font-bold text-gray-200'>&ldquo;Donde el amor por los animales se encuentra con la excelencia en el cuidado veterinario.&rdquo;</p>
          <button onClick={handleClick} className='py-3 rounded-xl bg-[#0d6efd] text-white my-6 text-md w-[250px] font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all'>AGENDAR UNA CITA</button>
          {console.log(user)}
          {user && user.role === "admin" &&
            <button onClick={handleAdmin} className='py-3 rounded-xl bg-[#0d6efd] text-white my-6 text-md w-[250px] font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all ml-4'>
             PANEL DE ADMINISTRACION 
          </button> 
         }

        </div>
      </div>
    </div>
  );
};

export default Hero;