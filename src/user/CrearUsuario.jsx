import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext'; 
import { Toaster, toast } from 'sonner'

function CrearUsuario() {
  const { user } = useContext(UserAuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate("/permission");
    } else {
      
    }
    }, [user, navigate]); 
  
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Ensure user is defined before using its ID
    if (!user || !user.id) {
      setError('Usuario no definido.');
      return;
    }

    const { data, error: userError } = await supabase
      .from('users')
      .update({ ...formData })
      .eq('id', user.id);  // Actualizar el registro existente

    if (userError) {
      setError('Error al actualizar el usuario: ' + userError.message);
    } else {
      setSuccess('Usuario registrado con éxito!');
      navigate("/crear-mascota"); // Redirigir para registrar mascota
    }
  };

  return (
    <div className='bg-sky-200'>
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la verificacion de su informacion</h2>
      </div>
      <section className=''>
        <div className='py-8 px-4 mx-6 max-w-2x1 lg:py-16'>
          <h2 className='mb-4 text-xl font-bold text-gray-900'>Registre sus datos correctamente</h2>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}

            <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
              <div className='sm:col-span-2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Nombre</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              
              <div className='sm:col-span-2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Apellidos</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
              </div>

              <div className='sm:col-span-2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Correo electronico</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              
              <div className='w-full'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Numero de telefono</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder='número de telefono' required/>
              </div>
            </div>
            
            <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Registrar Usuario</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CrearUsuario;
