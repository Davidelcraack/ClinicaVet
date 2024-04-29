import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from './NavbarAdmin';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from "../context/UserAuthContext";

const AdministrarCita = () => {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [appoiments, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/permission");
    } else {
      fetchCitas();
    }
  }, [user, navigate]);

  const fetchCitas = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from('appoiments')
        .select(`
          id,
          pets: pets_id (name),   
          services: services_id (description),
          slot: slot_id (date, start_time)
        `);
  
      if (error) throw error;
  
      // Filtramos los resultados para asegurarnos de que sólo incluyamos citas con un slot asociado.
      const citasConSlot = data.filter(appoiment => appoiment.slot);
  
      // Ordenamos los datos después de la consulta, asegurándonos de que exista el objeto slot.
      citasConSlot.sort((a, b) => {
        const dateA = a.slot ? new Date(`${a.slot.date}T${a.slot.start_time}`) : new Date();
        const dateB = b.slot ? new Date(`${b.slot.date}T${b.slot.start_time}`) : new Date();
        return dateA - dateB;
      });
  
      setCitas(citasConSlot);
    } catch (error) {
      setError('Error al cargar las citas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCita = async (appoimentId) => {
    const { data, error } = await supabase
      .from('appoiments')
      .delete()
      .match({ id: appoimentId });

    if (error) {
      setError(`Error al eliminar la appoiment: ${error.message}`);
    } else {
      // Actualizar la lista de appoiments
      setCitas(appoiments.filter((appoiment) => appoiment.id !== appoimentId));
    }
  };

  return (
    <div  className='bg-sky-200 w-screen h-screen'>
      <NavbarAdmin/>
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto '></img>
        <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Gestión de Citas</h2>
        {/* ... resto de tu componente ... */}
      </div>

      {/* Muestra un mensaje de carga o error si es necesario */}
      {loading ? <p>Cargando citas...</p> : error ? <p>{error}</p> : null}

      {/* Tabla de citas */}
      
      <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
          <h3 className='py-4 text-black font-bold'>Horarios disponibles</h3>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
          <thead className='text-gray-800 uppercase bg-sky-400'>
            <tr>
              <th scope='col' className='px-6'>Mascota</th>
              <th scope='col' className='px-6'>Servicio</th>
              <th scope='col' className='px-6'>Fecha y hora</th>
              <th scope='col' className='px-6'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appoiments.map((appoiment) => (
              <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={appoiment.id}>
                <td className='px-6 py-4'>{appoiment.pets.name}</td>  
                <td className='px-6 py-4'>{appoiment.services.description}</td>  
                <td>
                  {appoiment.slot
                    ? `${new Date(appoiment.slot.date + 'T' + appoiment.slot.start_time).toLocaleString()}`
                    : 'Sin horario definido'}
                </td>
                <td className='px-6 py-4'>
                  <button className='font-medium text-red-600 hover:underline px-1'  onClick={() => handleDeleteCita(appoiment.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default AdministrarCita;
