import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarUser from './NavbarUser';
import { Toaster,toast } from 'sonner';

function Dashboard() {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [pets, setMascotas] = useState([]);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate("/permission");
    } else {
      fetchPetsAndAppointments();
    }
  }, [user, navigate]);

  const fetchPetsAndAppointments = async () => {
    setLoading(true);
    try {
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);
  
      if (petsError) throw petsError;
      setMascotas(petsData);
  
      const { data: citasData, error: citasError } = await supabase
        .from('appoiments')
        .select(`
          id,
          pets: pets_id (name, species),
          services: services_id (description),
          slot: slot_id (date, start_time)
        `)
        .in('pets_id', petsData.map(pet => pet.id)); // Filtrar citas basadas en las mascotas del usuario
  
      if (citasError) throw citasError;
  
      // Filtrar citas pasadas
      const now = new Date();
      const citasFuturas = citasData.filter(cita => {
        if (cita.slot && cita.slot.date && cita.slot.start_time) {
          const citaFecha = new Date(`${cita.slot.date}T${cita.slot.start_time}`);
          return citaFecha >= now; // Retener solo citas futuras
        }
        return false; // Excluir citas sin fecha/hora válida
      });
  
      setCitas(citasFuturas);
      toast.success("Información cargada correctamente");
    } catch (error) {
      setError(`Error al cargar los datos: ${error.message}`);
      toast.error("Error a la hora de obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='pb-12 bg-sky-200'>
      <Toaster position="top-right" richColors/>
      <NavbarUser />
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto' alt='Banner' />
      </div>
      
     {/* Agregar aquí el div de Solicitar Cancelación de Cita */}
     <div className='p-4 my-4 rounded-lg shadow bg-sky-400'>
          <h3 className="text-lg font-semibold text-gray-800">Solicitar Cancelación de Cita</h3>
          <p className="text-gray-700">Si necesita cancelar su cita, por favor contacte a nuestro equipo:</p>
          <ul className="space-y-1 list-none">
            <li className="font-medium text-gray-900">Teléfono: <span className="text-gray-700">+52 341 239 2552</span></li>
            <li className="font-medium text-gray-900">Correo electrónico: <a href="mailto:cancelaciones@clinica.com" className="text-blue-600 hover:text-blue-800">info@clinicaveterinariaguzman.com</a></li>
          </ul>
        </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <section className='pb-6 mx-auto overflow-hidden shadow-sm max-w-7xl sm:px-4 lg:px-6 sm:rounded-lg bg-sky-300'>

            <div className='flex justify-between'>
              <h2 className="flex-row p-2 my-6 font-bold text-black">Citas Registradas</h2>
              <Link to="/crear-cita" className="flex-row justify-end p-2 rounded-xl   bg-[#0d6efd] text-white my-6 text-md font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all ">Crear cita</Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center text-gray-500 rtl:text-right">
                <thead className='text-gray-800 uppercase bg-sky-400'>
                  <tr className='"border-collapse border border-gray-500'>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Mascota
                    </th>
                    <th  scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Fecha
                    </th>
                    <th  scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Hora
                    </th>
                    <th  scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Servicio
                    </th>
                  </tr>
                </thead>
                <tbody className='border border-collapse border-gray-500'>
                  {citas.length > 0 ? citas.map((cita) => (
                    <tr className='font-semibold text-gray-600 border-b odd:bg-sky-300 even:bg-sky-200' key={cita.id}>
                      <td className="px-5 py-5 text-sm border-b border-gray-400">
                        {cita.pets.name}
                      </td>
                      <td className="px-5 py-5 text-sm border-b border-gray-400">
                        {cita.slot ? new Date(`${cita.slot.date}T${cita.slot.start_time}`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No disponible'}
                      </td>
                      <td className="px-5 py-5 text-sm border-b border-gray-400">
                        {cita.slot ? new Date(`${cita.slot.date}T${cita.slot.start_time}`).toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'No disponible'}
                      </td>
                      <td className="px-5 py-5 text-sm border-b border-gray-400">
                        {cita.services.description}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="py-5 text-center">No hay citas registradas.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
  
          <section className='pb-6 mx-auto overflow-hidden shadow-sm max-w-7xl sm:px-4 lg:px-6 sm:rounded-lg bg-sky-300'>

           <div className='flex justify-between'>           
           <h2 className="flex-row p-2 my-6 font-bold text-black">Mis Mascotas</h2>
           <Link to="/crear-mascota" className="flex-row justify-end p-2 rounded-xl   bg-[#0d6efd] text-white my-6 text-md font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all ">Añadir mascota</Link>
           </div>
 
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center text-gray-500 rtl:text-right">
                <thead className='text-gray-800 uppercase bg-sky-400'>
                  <tr className='"border-collapse border border-gray-500'>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Nombre
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Especie
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Género
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Edad
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Peso
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Descripción
                    </th>
                    <th scope='col' className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-900 uppercase border-b-2 border-gray-200">
                      Notas posteriores a la cita
                    </th>
                  </tr>
                </thead>
                <tbody className='border border-collapse border-gray-500'>
                  {pets.length > 0 ? pets.map((pet) => (
                    <tr className='font-semibold text-gray-600 border-b odd:bg-sky-300 even:bg-sky-200' key={pet.id}>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.name}
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.species}
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.gender}
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.age} años
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.weight} kg
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.medical_history}
                      </td>
                      <td  className="px-5 py-5 text-sm border-b border-gray-400">
                        {pet.doctor_notes}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6" className="py-5 text-center">No tienes mascotas registradas.</td></tr>}
                </tbody>
              </table>
            </div>   
          </section>
        </>
      )}

    </div>
  );
}

export default Dashboard;
