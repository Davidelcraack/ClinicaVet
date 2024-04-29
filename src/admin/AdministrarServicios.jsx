import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';

const AdministrarServicios = () => {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [availableServices, setAvailableServices] = useState([]);
  const [newService, setNewService] = useState('');

  // Función para cargar los servicios disponibles
  const fetchAvailableServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*');

    if (error) {
      setError('Error al cargar los servicios: ' + error.message);
    } else {
      setAvailableServices(data);
    }
  };

  // Función para añadir un nuevo servicio disponible
  const handleAddAvailableService = async () => {
    const { data, error } = await supabase
      .from('services')
      .insert([{
          description: newService,
      }]);
  
    if (error) {
      setError('Error al añadir el servicio: ' + error.message);
    } else if (data && data.length > 0) { 
      setAvailableServices([...availableServices, data[0]]);
      // Resetear los campos del formulario
      setNewService('');
    } else {
      // Manejar el caso de que data no tenga el formato esperado
      setError('Se recibió una respuesta inesperada al añadir el servicio.');
    }
  };

  const handleDeleteAvailableService = async (serviceId) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .match({ id: serviceId });

    if (error) {
      setError('Error al eliminar el servicio: ' + error.message);
    } else {
      setAvailableServices(availableServices.filter((service) => service.id !== serviceId));
    }
  };

   useEffect(() => {
     if (user && user.role === 'admin') {
       fetchAvailableServices();
     } else {
       navigate("/permission");
     }
   }, [user, navigate]);


  return (
    <div className='bg-sky-200 w-screen h-screen'>
      <NavbarAdmin />
      {/* Resto del componente */}
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Bienvenido a la administración de horarios</h2>
      </div>

    {/* Formulario para añadir servicios */}
    <div className='py-12'>
     <div className='flex flex-col items-center justify-center pb-8'>
       <div className='flex flex-row items-center justify-center'>
         <h3 className='font-bold text-lg py-4'>Añadir nuevo Servicio</h3>
      </div>
    <div className='flex flex-row items-center justify-center pb-4'>
      <input
      className='py-2 rounded-lg text-sm'
      type="text"
      placeholder="Servicio"
      style={{ textAlign: 'center' }}
      value={newService}
      onChange={(e) => setNewService(e.target.value)}
     />
     <button className='py-2 rounded-lg bg-[#0d6efd] text-white text-sm w-[120px] font-medium ml-4' onClick={handleAddAvailableService}>Añadir servicio</button>
    </div>
  </div>

      {/* Mostrar lista de Servicios disponibles */}
      <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
        <h3 className='py-4 text-black font-bold'>Servicios disponibles</h3>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        {availableServices.length > 0 ? (
        <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
          <thead className='text-gray-800 uppercase bg-sky-400'>
            <tr className=''>
              <th scope='col' className='px-6'>Nombre del servicio</th>
              <th scope='col' className='px-6'>Acción</th>
           </tr>
          </thead>
        <tbody>
           {availableServices.map((service) => (
          <tr key={service.id} className='odd:bg-sky-300 font-semibold  even:bg-sky-200 border-b text-gray-600'>
            <td className='px-6 py-4'>{service.description}</td>
             <td>
              <button className='font-medium text-red-600 hover:underline px-1' onClick={() => handleDeleteAvailableService(service.id)}>Eliminar</button>
            </td>
           </tr>
          ))}
       </tbody>
      </table>
        ) : (
          <p>No hay servicios registrados.</p>
        )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdministrarServicios;