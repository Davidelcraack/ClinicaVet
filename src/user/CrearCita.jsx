import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarUser  from './NavbarUser';

function CrearCita() {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate("/permission");
    } else {
      
    }
    }, [user, navigate]); 

  const handleMascota = () => {
    navigate("/crear-mascota");
  };

  const handleVolver = () => {
    navigate("/");
  };

  // Estados iniciales
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    selectedPet: '',
    selectedService: '',
    selectedSlot: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar mascotas del usuario
  useEffect(() => {
    if (user) {
      const fetchPets = async () => {
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('*')
          .eq('owner_id', user.id);
        if (petsError) {
          setError('Error al cargar las mascotas: ' + petsError.message);
        } else {
          setPets(petsData);
        }
      };
      fetchPets();
    }
  }, [user]);

 // Cargar servicios y slots disponibles
useEffect(() => {
  const fetchServicesAndSlots = async () => {
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, description');

    const { data: slotsData, error: slotsError } = await supabase
      .from('available_slots')
      .select('id, date, start_time')
      .eq('is_available', true)
      .order('date', { ascending: true }) // Asegúrate de que la API de Supabase soporte esto
      .order('start_time', { ascending: true }); // Ordena primero por fecha, luego por hora de inicio

    if (servicesError) {
      setError('Error al cargar los servicios: ' + servicesError.message);
    } else {
      setServices(servicesData);
    }

    if (slotsError) {
      setError('Error al cargar los slots: ' + slotsError.message);
    } else {
      const formattedSlots = slotsData.map(slot => {
        // Crea una fecha completa y la formatea
        const fullDate = new Date(`${slot.date}T${slot.start_time}`);
        return {
          ...slot,
          displayString: `${fullDate.toLocaleDateString()} ${fullDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, // Usa opciones para mostrar solo la hora y los minutos
        };
      });

      setAvailableSlots(formattedSlots);
    }
  };

  fetchServicesAndSlots();
}, []);


  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Enviar el formulario para crear la cita
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { data: newAppointment, error: appointmentError } = await supabase
    .from('appoiments')
    .insert([{
      pets_id: formData.selectedPet,
      services_id: formData.selectedService,
      slot_id: formData.selectedSlot,
      // Aquí no necesitas 'is_available' porque esa columna no existe en 'appointments'
    }]);

  if (appointmentError) {
    setError('Error al crear la cita: ' + appointmentError.message);
    return; // Detén la ejecución si hay un error
  } 

    const { error: slotUpdateError } = await supabase
    .from('available_slots')
    .update({ is_available: false })
    .match({ id: formData.selectedSlot });

  if (slotUpdateError) {
    setError('Error al actualizar el slot: ' + slotUpdateError.message);
  } else {
    setSuccess('Cita creada con éxito!');
    // Opcional: resetear formulario o redirigir
    setFormData({
      selectedPet: '',
      selectedService: '',
      selectedSlot: '',
    });
  }
  navigate("/dashboard")
};

  return (
  <div className='bg-sky-200'>
    <NavbarUser/>
    {/* Resto del componente */}
    <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la creación de su cita</h2>
    </div>
    <section className='py-4'>
      <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
        <h2 className='py-4 text-xl font-bold text-black'>Crear Cita</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}

          {/* Selector de mascota */}
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
          <div className='sm:col-span-2'>
            <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona tu mascota:</label>
            <select
              name="selectedPet"
              value={formData.selectedPet}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' >
              <option value="">Elige una mascota</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>{pet.name}</option>
              ))}
            </select>
          </div>
          </div>

          {/* Selector de servicio */}
          <div>
            <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona el servicio:</label>
            <select
              name="selectedService"
              value={formData.selectedService}
              onChange={handleChange}
              required
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'>
              <option value="">Elige un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.description}</option>
              ))}
            </select>
          </div>

          {/* Selector de horario */}
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona el horario:</label>
              <select
                name="selectedSlot"
                value={formData.selectedSlot}
                onChange={handleChange}
                required
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5'>
                <option value="">Elige un horario</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.displayString} {/* Usar el string formateado para mostrar */}
                  </option>
                ))}
              </select>
            </div>

          {/* Botones */}
          <div className='flex justify-between items-center p-4'>
          <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md flex-1">Crear Cita</button>
          <Link to="/crear-mascota" className="mx-2 px-4 py-2 text-white bg-blue-600 rounded-md flex-1">Añadir mascota</Link>
          </div>
        </form>
      </div>
    </section>
  </div>
  );
}

export default CrearCita;