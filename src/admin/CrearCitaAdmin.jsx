import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { supabase } from '../helpers/supabase';
import { Toaster, toast } from 'sonner';

registerLocale('es', es);

const CrearCitaAdmin = ({ onClose }) => {
  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    owner: '',
    pet: '',
    service: '',
    slot: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Cargar dueños al montar
  useEffect(() => {
    const fetchOwners = async () => {
      const { data, error } = await supabase.from('users').select('id, name');
      if (error) {
        toast.error('Error al cargar dueños');
        return;
      }
      setOwners(data);
      setFilteredOwners(data);
    };
    fetchOwners();
  }, []);

  // Cargar mascotas cuando se selecciona un dueño
  useEffect(() => {
    const fetchPets = async () => {
      if (!formData.owner) return;
      const { data, error } = await supabase
        .from('pets')
        .select('id, name')
        .eq('owner_id', formData.owner);
      if (error) {
        toast.error('Error al cargar mascotas');
        return;
      }
      setPets(data);
    };
    fetchPets();
  }, [formData.owner]);

  // Cargar servicios disponibles
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('services').select('id, description');
      if (error) {
        toast.error('Error al cargar servicios');
        return;
      }
      setServices(data);
    };
    fetchServices();
  }, []);

  // Cargar horarios disponibles para la fecha seleccionada
  useEffect(() => {
    const fetchSlots = async () => {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('available_slots')
        .select('id, date, start_time')
        .eq('is_available', true)
        .eq('date', formattedDate)
        .order('start_time', { ascending: true });
      if (error) {
        toast.error('Error al cargar horarios');
        return;
      }
      setSlots(data);
    };
    fetchSlots();
  }, [selectedDate]);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar búsqueda de dueños
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filtered = owners.filter((owner) =>
      owner.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredOwners(filtered);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { owner, pet, service, slot } = formData;

    if (!owner || !pet || !service || !slot) {
      toast.warning('Por favor, completa todos los campos');
      return;
    }

    try {
      const { error } = await supabase.from('appoiments').insert({
        pets_id: pet,
        services_id: service,
        slot_id: slot,
      });

      if (error) throw error;

      toast.success('Cita creada exitosamente');
      onClose(); // Cerrar el formulario
    } catch (error) {
      toast.error('Error al crear la cita');
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-md modal">
      <Toaster position="top-right" richColors />
      <div className="w-full max-w-lg p-6 rounded-lg bg-sky-300">
        <h3 className="pb-4 text-xl font-bold text-center text-gray-900">Crear Cita</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Búsqueda de dueño */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Buscar Dueño:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Escribe el nombre del dueño..."
              className="w-full p-2 text-sm border rounded-lg bg-gray-50"
            />
            <ul className="mt-2 overflow-y-auto bg-white border rounded-lg max-h-40">
              {filteredOwners.map((owner) => (
                <li
                  key={owner.id}
                  onClick={() => {
                    setFormData({ ...formData, owner: owner.id });
                    setSearchQuery(owner.name);
                    setFilteredOwners([]);
                  }}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-200"
                >
                  {owner.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Seleccionar mascota */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Selecciona Mascota:</label>
            <select
              name="pet"
              value={formData.pet}
              onChange={handleChange}
              className="w-full p-2 text-sm border rounded-lg bg-gray-50"
            >
              <option value="">Seleccione una mascota</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Seleccionar servicio */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Selecciona Servicio:</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full p-2 text-sm border rounded-lg bg-gray-50"
            >
              <option value="">Seleccione un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.description}
                </option>
              ))}
            </select>
          </div>

          {/* Seleccionar fecha */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Selecciona Fecha:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              locale="es"
              minDate={new Date()}
              className="w-full p-2 text-sm border rounded-lg bg-gray-50"
            />
          </div>

          {/* Seleccionar horario */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Selecciona Horario:</label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-2 text-sm border rounded-lg bg-gray-50"
            >
              <option value="">Seleccione un horario</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {`${slot.date} - ${slot.start_time}`}
                </option>
              ))}
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearCitaAdmin;
