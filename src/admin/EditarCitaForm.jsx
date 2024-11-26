import React, { useState, useEffect } from 'react';
import { supabase } from '../helpers/supabase';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
import { toast } from 'sonner';

// Registrar el idioma español para el DatePicker
registerLocale('es', es);

const EditarCitaForm = ({ cita, onClose, onUpdate }) => {
  const [pets, setPets] = useState([]);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(cita.slot.date));
  const [formData, setFormData] = useState({
    pet: cita.pets.id,
    service: cita.services.id,
    slot: cita.slot.id,
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar mascotas del dueño
        const { data: petsData, error: petsError } = await supabase
          .from('pets')
          .select('id, name')
          .eq('owner_id', cita.pets.owner.id);
        if (petsError) throw petsError;
        setPets(petsData);

        // Cargar servicios
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, description');
        if (servicesError) throw servicesError;
        setServices(servicesData);

        // Cargar horarios disponibles
        fetchSlots(cita.slot.date);
      } catch (error) {
        toast.error('Error al cargar los datos iniciales.');
      }
    };

    fetchInitialData();
  }, [cita]);

  // Cargar horarios disponibles para una fecha específica
  const fetchSlots = async (date) => {
    try {
      const { data: slotsData, error } = await supabase
        .from('available_slots')
        .select('id, date, start_time')
        .eq('is_available', true)
        .eq('date', date)
        .order('start_time', { ascending: true });
      if (error) throw error;
      setSlots(slotsData);
    } catch {
      toast.error('Error al cargar horarios disponibles.');
    }
  };

  // Manejar cambio de fecha
  const handleDateChange = (date) => {
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0]
  setSelectedDate(date)
  fetchSlots(formattedDate)
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        pets_id: formData.pet,
        services_id: formData.service,
        slot_id: formData.slot,
      };

      const { error } = await supabase
        .from('appoiments')
        .update(updatedData)
        .eq('id', cita.id);

      if (error) throw error;

      toast.success('Cita actualizada exitosamente.');
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      toast.error('Error al actualizar la cita.');
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg">
      <div className="w-full max-w-lg p-6 rounded-lg bg-sky-300">
        <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">
          Editar Cita {cita.id.slice(-6)}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mascota */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Mascota
            </label>
            <select
              name="pet"
              value={formData.pet}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              <option value="">Seleccione una mascota</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {/* Servicio */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Servicio
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50"
            >
              <option value="">Seleccione un servicio</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.description}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Fecha
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              locale="es"
              className="w-full p-2 border rounded-lg bg-gray-50"
              minDate={new Date()}
            />
          </div>

          {/* Horario */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">
              Horario
            </label>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50"
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
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCitaForm;
