import { useNavigate } from "react-router-dom";

const Permission = () => {

  const navigate = useNavigate()

  const goToHome = () => {
    navigate("/");
  };

return (

    <div className='relative h-screen flex flex-col justify-center items-center text-balance bg-gray-200'>
        <img src='/images/404.png' className=''></img>
        <h2 className='text-4xl font-bold text-center text-[#004f6f]'>No tienes permisos de ver el contenido</h2>
        <button className="py-3 rounded-xl bg-[#0d6efd] text-white my-6 text-md w-[250px] font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all" onClick={goToHome}>Volver al inicio</button>
    </div>

);

}

export default Permission;