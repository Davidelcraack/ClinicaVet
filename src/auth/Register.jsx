import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const {singUp} = useContext(UserAuthContext);
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    singUp(formData);
    navigate("/login")
  };

  return (
    <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100'>
      <h1 className='text-5xl font-semibold'>Crear una cuenta</h1>
      <p className='font-medium text-lg text-gray-400 mt-3'>¡Regístrate para acceder a todos nuestros servicios!</p>
      <form onSubmit={handleSubmit} className='mt-8'>
        <div>
          <label className='text-lg font-medium'>Nombre</label>
          <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su nombre" name='name' onChange={handleChange} />
        </div>

        <div>
          <label className='text-lg font-medium'>Apellido</label>
          <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su apellido" name='last_name' onChange={handleChange} />
        </div>

        <div>
          <label className='text-lg font-medium'>Teléfono</label>
          <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su teléfono" name='phone' onChange={handleChange} />
        </div>

        <div>
          <label className='text-lg font-medium'>Correo electrónico</label>
          <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su correo electrónico" name='email' onChange={handleChange} />
        </div>

        <div>
          <label className='text-lg font-medium'>Contraseña</label>
          <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su contraseña" type="password" name='password' onChange={handleChange} />
        </div>
        
        <div className='mt-8 flex items-center mb-2'>
          <input type="checkbox" id='remember' />
          <label className='ml-2 font-medium text-base'>Recordar la contraseña</label>
        </div>

        <button type="submit" className='py-2 border-2 border-gray-100 rounded-xl bg-[#0d6efd] text-white text-md active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all px-8'onClick={handleSubmit}>Crear cuenta</button>
      </form>

      <div className="mt-6 flex justify-center items-center">
        <p className="font-medium text-base">¿Ya tienes una cuenta?</p>
        <Link to='/login' className="text-[#0d6efd] text-base font-medium ml-2">Iniciar sesión</Link>
      </div>
    </div>
  );
};

export default Register;
