import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';

const AdministrarDetallesCita = () => {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const [availableSlots, setAvailableSlots] = useState([]);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');

  // Función para cargar los horarios disponibles
  const fetchAvailableSlots = async () => {
    const { data, error } = await supabase
      .from('available_slots')
      .select('*')
      .eq('is_available', true)
      .order('date', { ascending: true }) // Ordenar por fecha
      .order('start_time', { ascending: true }); // y luego por hora de inicio

    if (error) {
      setError('Error al cargar los horarios: ' + error.message);
    } else {
      const formattedSlots = data.map(slot => {
        return {
          ...slot,
          formattedDate: new Date(slot.date).toLocaleDateString(),
          formattedStartTime: new Date(`${slot.date}T${slot.start_time}`).toLocaleTimeString([], { timeStyle: 'short' }),
          formattedEndTime: new Date(`${slot.date}T${slot.end_time}`).toLocaleTimeString([], { timeStyle: 'short' }),
        };
      });
      setAvailableSlots(formattedSlots);
    }
  };

  // Función para añadir un nuevo horario disponible
  const handleAddAvailableSlot = async () => {
    const { data, error } = await supabase
      .from('available_slots')
      .insert([{
        date: newSlotDate,
        start_time: newSlotStartTime,
        end_time: newSlotEndTime,
        is_available: true,
      }]);
  
    if (error) {
      setError('Error al añadir el horario: ' + error.message);
    } else if (data && data.length > 0) { // Comprueba que data no es null y que tiene al menos un elemento
      setAvailableSlots([...availableSlots, data[0]]);
      // Resetear los campos del formulario
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
    } else {
      // Manejar el caso de que data no tenga el formato esperado
      setError('Se recibió una respuesta inesperada al añadir el horario.');
    }
  };

  // Función para eliminar un horario disponible
  const handleDeleteAvailableSlot = async (slotId) => {
    const { error } = await supabase
      .from('available_slots')
      .delete()
      .match({ id: slotId });

    if (error) {
      setError('Error al eliminar el horario: ' + error.message);
    } else {
      setAvailableSlots(availableSlots.filter((slot) => slot.id !== slotId));
    }
  };

  

  // Cargar ambos servicios y horarios al montar el componente
   useEffect(() => {
     if (user && user.role === 'admin') {
       fetchAvailableSlots();
     } else {
       navigate("/permission");
     }
   }, [user, navigate]);

  // Resto del componente...
  return (
    <div className='bg-sky-200 w-screen h-screen'>
      <NavbarAdmin />
      {/* Resto del componente */}
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Bienvenido a la administración de horarios</h2>
      </div>
  
      {/* Formulario para añadir horarios disponibles */}
      <div className='py-12 bg-sky-200'>
        <div className='flex flex-col items-center justify-center pb-8'>
          <div className='flex flex-row items-center justify-center'>
            <h3 className='font-bold text-lg py-4'>Añadir nuevo horario disponible</h3>
          </div>
          <div className='flex flex-row items-center justify-center pb-4'>
            <h5 className='font-semibold text-md py-4'>Fecha</h5>
            <input className='py-2 mx-2 rounded-lg text-sm' type="date" style={{ textAlign: 'center' }} value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)}/>
            <h5 className='font-semibold text-md py-4'>inicio</h5>
            <input className='py-2 mx-2 rounded-lg text-sm' type="time" style={{ textAlign: 'center' }} value={newSlotStartTime} onChange={(e) => setNewSlotStartTime(e.target.value)}/>
            <h5 className='font-semibold text-md py-4'>Final</h5>
            <input className='py-2 mx-2 rounded-lg text-sm' type="time" style={{ textAlign: 'center' }} value={newSlotEndTime} onChange={(e) => setNewSlotEndTime(e.target.value)}/>
            <button className='py-2 rounded-lg bg-[#0d6efd] text-white text-sm w-[120px] font-medium ml-2' onClick={handleAddAvailableSlot}>Añadir horario</button>
          </div>
        </div>
  
        {/* Mostrar lista de horarios disponibles */}
        <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
          <h3 className='py-4 text-black font-bold'>Horarios disponibles</h3>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            {availableSlots.length > 0 ? (
              <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
                <thead className='text-gray-800 uppercase bg-sky-400'>
                  <tr>
                    <th scope='col' className='px-6'>Fecha</th>
                    <th scope='col' className='px-6'>Hora de inicio</th>
                    <th scope='col' className='px-6'>Hora de fin</th>
                    <th scope='col' className='px-6'>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {availableSlots.map((slot) => (
                    <tr key={slot.id} className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600'>
                      <td className='px-6 py-4'>{slot.formattedDate}</td>
                      <td className='px-6 py-4'>{slot.formattedStartTime}</td>
                      <td className='px-6 py-4'>{slot.formattedEndTime}</td>
                      <td>
                        <button className='font-medium text-red-600 hover:underline px-1' onClick={() => handleDeleteAvailableSlot(slot.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay horarios registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );  
};

export default AdministrarDetallesCita;