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
        .in('pets_id', petsData.map(pet => pet.id)); // Filtering appointments based on the owner's pets
        toast.success("Información cargada correctamente");
      if (citasError) throw citasError;
      setCitas(citasData);
    } catch (error) {
      setError(`Error al cargar los datos: ${error.message}`);
      toast.error("Error a la hora de obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-sky-200 pb-12'>
      <Toaster position="top-right" richColors/>
      <NavbarUser />
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto' alt='Banner' />
      </div>
      
     {/* Agregar aquí el div de Solicitar Cancelación de Cita */}
     <div className='bg-sky-400 p-4 my-4 shadow rounded-lg'>
          <h3 className="text-lg font-semibold text-gray-800">Solicitar Cancelación de Cita</h3>
          <p className="text-gray-700">Si necesita cancelar su cita, por favor contacte a nuestro equipo:</p>
          <ul className="list-none space-y-1">
            <li className="text-gray-900 font-medium">Teléfono: <span className="text-gray-700">+1 234 567 8900</span></li>
            <li className="text-gray-900 font-medium">Correo electrónico: <a href="mailto:cancelaciones@clinica.com" className="text-blue-600 hover:text-blue-800">cancelaciones@clinica.com</a></li>
          </ul>
        </div>

      {loading ? (
        <p>Cargando datos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <section className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>

            <div className='flex justify-between'>
              <h2 className="flex-row p-2 my-6 text-black font-bold">Citas Registradas</h2>
              <Link to="/crear-cita" className="flex-row justify-end p-2 rounded-xl   bg-[#0d6efd] text-white my-6 text-md font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all ">Crear cita</Link>
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center rtl:text-right text-gray-500">
                <thead className='text-gray-800 uppercase bg-sky-400'>
                  <tr className='"border-collapse border border-gray-500'>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Mascota
                    </th>
                    <th  scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th  scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Hora
                    </th>
                    <th  scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Servicio
                    </th>
                  </tr>
                </thead>
                <tbody className='border-collapse border border-gray-500'>
                  {citas.length > 0 ? citas.map((cita) => (
                    <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={cita.id}>
                      <td className="px-5 py-5 border-b border-gray-400 text-sm">
                        {cita.pets.name}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-400 text-sm">
                        {cita.slot ? new Date(`${cita.slot.date}T${cita.slot.start_time}`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No disponible'}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-400 text-sm">
                        {cita.slot ? new Date(`${cita.slot.date}T${cita.slot.start_time}`).toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'No disponible'}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-400 text-sm">
                        {cita.services.description}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="4" className="text-center py-5">No hay citas registradas.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
  
          <section className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>

           <div className='flex justify-between'>           
           <h2 className="flex-row p-2 my-6 text-black font-bold">Mis Mascotas</h2>
           <Link to="/crear-mascota" className="flex-row justify-end p-2 rounded-xl   bg-[#0d6efd] text-white my-6 text-md font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all ">Añadir mascota</Link>
           </div>
 
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-center rtl:text-right text-gray-500">
                <thead className='text-gray-800 uppercase bg-sky-400'>
                  <tr className='"border-collapse border border-gray-500'>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Especie
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Género
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Edad
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Peso
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th scope='col' className="px-6 py-3 border-b-2 border-gray-200  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Notas posteriores a la cita
                    </th>
                  </tr>
                </thead>
                <tbody className='border-collapse border border-gray-500'>
                  {pets.length > 0 ? pets.map((pet) => (
                    <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={pet.id}>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.name}
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.species}
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.gender}
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.age} años
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.weight} kg
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.medical_history}
                      </td>
                      <td  className="px-5 py-5 border-b border-gray-400 text-sm">
                        {pet.doctor_notes}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6" className="text-center py-5">No tienes mascotas registradas.</td></tr>}
                </tbody>
              </table>
            </div>   
          </section>
          <div className="flex justify-start items-end h-full">
            <Link to="/" className="mt-8 p-2 rounded-xl bg-[#0d6efd] text-white my-6 text-md font-medium active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all">
                Volver al inicio
            </Link>
          </div>
        </>
      )}

    </div>
  );
}

export default Dashboard;
