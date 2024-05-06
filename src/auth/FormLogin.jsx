import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const FormLogin = ({handleChange, handleSubmit}) => {

  
  return (
    <div className='flex w-full h-screen items-center justify-center bg-gray-50'> {/* Ajustar el fondo para todo el viewport */}
      <div className='flex flex-col md:flex-row w-full max-w-4xl mx-auto bg-white shadow-lg rounded-3xl overflow-hidden'> {/* Envoltorio principal con sombra y bordes redondeados */}
  
        {/* Contenido del formulario */}
        <div className='p-10 md:w-1/2 flex flex-col justify-center'>
          <h1 className='text-5xl font-semibold'>Iniciar sesión</h1>
          <p className='font-medium text-lg text-gray-400 mt-3'>Bienvenido de regreso a su clínica de confianza</p>
          
          <div className='mt-8'>
            <div>
              <label className='text-lg font-medium'>Correo electrónico</label>
              <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su correo electrónico" onChange={handleChange} name='email'/>
            </div>
            
            <div>
              <label className='text-lg font-medium'>Contraseña</label>
              <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su contraseña" type="password" onChange={handleChange} name='password'/>
            </div>
            
            <div className='flex items-center mt-8 mb-2'>
              <input type="checkbox" id='remember'/>
              <label className='ml-2 font-medium text-base'>Recordar la contraseña</label>
            </div>
            <button className='font-medium text-base text-[#0d6efd]'>Olvide mi contraseña</button>
            
            <button className='mt-6 py-2 w-full border-2 border-gray-100 rounded-xl bg-[#0d6efd] text-white text-md active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all' onClick={handleSubmit}>Iniciar sesión</button>
            
            <div className="mt-6 flex justify-center items-center">
              <p className="font-medium text-base">¿No tienes una cuenta?</p>
              <Link to='/register' className="text-[#0d6efd] text-base font-medium ml-2">Crear cuenta</Link>
            </div>
          </div>
        </div>
  
        {/* Panel visual lateral */}
        <div className='hidden md:flex md:w-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 items-center justify-center p-10'>
          <img src="../images/logo.png" alt="Logo" className='w-1/2'/>
        </div>
      </div>
    </div>
  );  
};

export default FormLogin;
