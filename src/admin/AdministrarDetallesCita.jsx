import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

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
        return formater(slot)
      });
      setAvailableSlots(formattedSlots);
      
    }
  };
  
  const formater = (slot) => {
    const startDate = new Date(`${slot.date}T${slot.start_time}`);
        const endDate = new Date(`${slot.date}T${slot.end_time}`);
        return {
          ...slot,
          formattedDate: startDate.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }), // Agregar el día, mes y año
          formattedStartTime: startDate.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }), // Formato AM/PM
          formattedEndTime: endDate.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }), // Formato AM/PM
        };
  }


  // Función para añadir un nuevo horario disponible
  const handleAddAvailableSlot = async () => {
    const { data, error } = await supabase
      .from('available_slots')
      .insert({
        date: newSlotDate,
        start_time: newSlotStartTime,
        end_time: newSlotEndTime,
        is_available: true,
      }).select();
  
    if (error) {
      setError('Error al añadir el horario: ' + error.message);
      return
    } 
    // Comprueba que data no es null y que tiene al menos un elemento
    setAvailableSlots([...availableSlots, formater(data[0])]);
    // Resetear los campos del formulario
    setNewSlotDate('');
    setNewSlotStartTime('');
    setNewSlotEndTime('');
    toast.success('Horario creado correctamente')
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
      toast.success('Horario eliminado correctamente');
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
    <>   
     <Toaster position="top-right" richColors/>
    <div className='bg-sky-200'>
      <NavbarAdmin />
      {/* Resto del componente */}
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Bienvenido a la administración de horarios</h2>
      </div>
  
      {/* Formulario para añadir horarios disponibles */}
      <div className='py-12 bg-sky-200'>
        <div className='flex flex-col items-center justify-center p-4 bg-sky-200 shadow-md rounded-lg border border-black m-4'>
          <h3 className='text-lg font-bold mb-6 text-blue-800'>Añadir nuevo horario </h3>
          <form className='w-9/12 lg:w-full border-black'>
          <div className='flex flex-col sm:flex-row items-center justify-center mb-4'>
            <div>
              <label htmlFor="date" className='font-semibold text-md text-gray-700 pr-2'>Fecha</label>
              <input id="date" className='form-input py-2 px-4 rounded-lg text-sm border border-black' type="date" style={{ textAlign: 'center' }} value={newSlotDate} onChange={(e) => setNewSlotDate(e.target.value)} />
            </div>
          
              <div>
                <label htmlFor="startTime" className='font-semibold text-md text-gray-700 px-2'>Inicio</label>
                <input id="startTime" className='form-input py-2 px-4 rounded-lg text-sm border border-black' type="time" style={{ textAlign: 'center' }} value={newSlotStartTime} onChange={(e) => setNewSlotStartTime(e.target.value)} />
              </div>
              <div>
                <label htmlFor="endTime" className='font-semibold text-md text-gray-700 px-2'>Final</label>
                <input id="endTime" className='form-input py-2 px-4 rounded-lg text-sm border border-black' type="time" style={{ textAlign: 'center' }} value={newSlotEndTime} onChange={(e) => setNewSlotEndTime(e.target.value)} />
              </div>
            </div>
            <div className='flex items-center justify-center'>
            <button type="button" className=' mt-4 px-6 py-2  rounded-lg bg-blue-600 text-white text-sm font-medium' onClick={handleAddAvailableSlot}>Añadir horario</button>
            </div>
          </form>
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
    </>
  );  
};


export default AdministrarDetallesCita;