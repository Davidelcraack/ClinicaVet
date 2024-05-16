import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarUser from './NavbarUser';
import { Toaster, toast } from 'sonner';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';

registerLocale('es', es);

function CrearCita() {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/permission");
    }
  }, [user, navigate]);

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
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const fetchServicesAndSlots = async (date) => {
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('id, description');

    const { data: slotsData, error: slotsError } = await supabase
      .from('available_slots')
      .select('id, date, start_time')
      .eq('is_available', true)
      .eq('date', date)
      .order('start_time', { ascending: true });

    if (servicesError) {
      setError('Error al cargar los servicios: ' + servicesError.message);
    } else {
      setServices(servicesData);
    }

    if (slotsError) {
      setError('Error al cargar los slots: ' + slotsError.message);
    } else {
      const now = new Date();
      const formattedSlots = slotsData
        .map(slot => {
          const fullDate = new Date(`${slot.date}T${slot.start_time}`);
          return {
            ...slot,
            fullDate,
            displayString: `${fullDate.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}, ${fullDate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}`
          };
        })
        .filter(slot => slot.fullDate > now); // Filtrar slots pasados

      setAvailableSlots(formattedSlots);
    }
  };

  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    fetchServicesAndSlots(dateString);
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

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
      }]);

    if (appointmentError) {
      setError('Error al crear la cita: ' + appointmentError.message);
      toast.error("Ha ocurrido un error inesperado");
      return;
    }

    const { error: slotUpdateError } = await supabase
      .from('available_slots')
      .update({ is_available: false })
      .match({ id: formData.selectedSlot });

    if (slotUpdateError) {
      setError('Error al actualizar el slot: ' + slotUpdateError.message);
    } else {
      toast.success("Cita creada con éxito");
      setFormData({
        selectedPet: '',
        selectedService: '',
        selectedSlot: '',
      });
    }
    navigate("/dashboard");
  };

  return (
    <div className='bg-sky-200'>
      <NavbarUser />
      <Toaster position="top-right" richColors />
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto' alt='banner' />
        <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la creación de su cita</h2>
      </div>
      <section className='py-4'>
        <div className='max-w-4xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-lg sm:rounded-lg bg-sky-300 pb-6'>
          <h2 className='pt-4 pb-2 text-xl font-bold text-black text-center'>Crear Cita</h2>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && <div className='text-red-500 text-center'>{error}</div>}
            {success && <div className='text-green-500 text-center'>{success}</div>}

            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona tu mascota:</label>
              <select
                name="selectedPet"
                value={formData.selectedPet}
                onChange={handleChange}
                required
                className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'>
                <option value="">Elige una mascota</option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona el servicio:</label>
              <select
                name="selectedService"
                value={formData.selectedService}
                onChange={handleChange}
                required
                className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'>
                <option value="">Elige un servicio</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>{service.description}</option>
                ))}
              </select>
            </div>

            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona la fecha:</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="yyyy-MM-dd"
                locale="es"
                minDate={new Date()}
                className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'
              />
            </div>

            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Selecciona el horario:</label>
              <select
                name="selectedSlot"
                value={formData.selectedSlot}
                onChange={handleChange}
                required
                className='w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5'>
                <option value="">Elige un horario</option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.displayString}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex justify-between items-center pt-4'>
              <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex-1 transition duration-150 ease-in-out">Crear Cita</button>
              <Link to="/crear-mascota" className="mx-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex-1 transition duration-150 ease-in-out">Añadir mascota</Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CrearCita;
