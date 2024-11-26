import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { supabase } from "../helpers/supabase";
import NavbarAdmin from "./NavbarAdmin";
import CrearCitaAdmin from "./CrearCitaAdmin";
import CitasTable from "./CitasTable";

const AdministrarCita = () => {
  const navigate = useNavigate();
  const [appoiments, setAppoiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCrearCita, setShowCrearCita] = useState(false);

  // Cargar citas al iniciar y cuando cambian las fechas
  useEffect(() => {
    if (startDate && endDate) {
      fetchCitasByRange(startDate, endDate);
    } else {
      fetchCitas();
    }
  }, [startDate, endDate]);

  // Obtener citas de Supabase
  const fetchCitas = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("appoiments")
        .select(`
          id,
          pets: pets_id (
            name,
            species,
            owner: users!owner_id (id, name, last_name, phone, email)
          ),
          services: services_id (description),
          slot: slot_id (date, start_time)
        `);

      if (error) throw error;

      const citasOrdenadas = data
        .filter((appoiment) => appoiment.slot && appoiment.slot.date && appoiment.slot.start_time)
        .sort((a, b) => new Date(`${a.slot.date}T${a.slot.start_time}`) - new Date(`${b.slot.date}T${b.slot.start_time}`));

      setAppoiments(citasOrdenadas);
    } catch (error) {
      setError(`Error al cargar citas: ${error.message}`);
      toast.error("Error al cargar citas.");
    } finally {
      setLoading(false);
    }
  };

  // Obtener citas por rango de fechas
  const fetchCitasByRange = async (start, end) => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("appoiments")
        .select(`
          id,
          pets: pets_id (
            name,
            species,
            owner: users!owner_id (id, name, last_name, phone, email)
          ),
          services: services_id (description),
          slot: slot_id (date, start_time)
        `)
        .gte("slot.date", start)
        .lte("slot.date", end);

      if (error) throw error;

      const citasOrdenadas = data
        .filter((appoiment) => appoiment.slot && appoiment.slot.date && appoiment.slot.start_time)
        .sort((a, b) => new Date(`${a.slot.date}T${a.slot.start_time}`) - new Date(`${b.slot.date}T${b.slot.start_time}`));

      setAppoiments(citasOrdenadas);
    } catch (error) {
      setError(`Error al cargar citas: ${error.message}`);
      toast.error("Error al cargar citas.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de fechas
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="pb-20 bg-sky-200">
      <Toaster position="top-right" richColors />
      <NavbarAdmin />

      <div className="relative z-0 pb-4 filter">
        <img src="/images/banner.jpg" className="w-full h-auto" alt="Banner" />
        <h2 className="text-3xl font-bold text-center pb-4 pt-4 text-[#004f6f]">
          Gestión de Citas
        </h2>

        {/* Filtros de rango de fechas */}
        <div className="my-4 text-center">
          <label>Fecha de inicio: </label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="p-2 border-2 border-gray-300 rounded-md"
          />
          <label className="ml-4">Fecha de fin: </label>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="p-2 border-2 border-gray-300 rounded-md"
          />
        </div>

        {/* Botón para crear cita */}
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={() => setShowCrearCita(true)}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
          >
            Crear Cita
          </button>
        </div>

        {/* Mostrar el formulario de creación de citas */}
        {showCrearCita && (
          <CrearCitaAdmin onClose={() => setShowCrearCita(false)} />
        )}

        {/* Tabla de citas */}
        <CitasTable appoiments={appoiments} loading={loading} />
      </div>
    </div>
  );
};

export default AdministrarCita;
