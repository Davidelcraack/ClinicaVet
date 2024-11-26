import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // Librería para exportar a Excel
import { toast } from 'sonner';
import { supabase } from '../helpers/supabase';
import EditarCitaForm from './EditarCitaForm'; // Importa el componente EditarCitaForm

const CitasTable = ({ appoiments, loading, onUpdate }) => {
  const [selectedCita, setSelectedCita] = useState(null); // Estado para la cita seleccionada

  // Eliminar una cita
  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('appoiments').delete().eq('id', id);
      if (error) throw error;
      toast.success('Cita eliminada correctamente');
      if (onUpdate) onUpdate(); // Refrescar citas después de eliminar
    } catch (error) {
      toast.error('Error al eliminar la cita');
    }
  };

  // Exportar citas a Excel
  const exportToExcel = () => {
    const formattedData = appoiments.map((cita) => ({
      ID: cita.id,
      Dueño: `${cita.pets.owner.name} ${cita.pets.owner.last_name}`,
      Mascota: cita.pets.name,
      Servicio: cita.services.description,
      Fecha: `${cita.slot.date} ${cita.slot.start_time}`,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Citas');
    XLSX.writeFile(workbook, 'citas.xlsx');
  };

  if (loading) return <p className="py-4 text-center">Cargando citas...</p>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* Botón para exportar a Excel */}
      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </div>

      <table className="w-full text-sm text-center text-gray-500 border-collapse border-gray-200">
        <thead className="text-gray-800 uppercase bg-sky-400">
          <tr>
            <th className="px-6 py-3 border border-gray-300">ID</th>
            <th className="px-6 py-3 border border-gray-300">Dueño</th>
            <th className="px-6 py-3 border border-gray-300">Mascota</th>
            <th className="px-6 py-3 border border-gray-300">Servicio</th>
            <th className="px-6 py-3 border border-gray-300">Fecha y Hora</th>
            <th className="px-6 py-3 border border-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-sky-300">
          {appoiments.map((cita, index) => (
            <tr
              key={cita.id}
              className={`font-semibold text-gray-600 ${
                index % 2 === 0 ? 'bg-sky-300' : 'bg-sky-200'
              }`}
            >
              <td className="px-6 py-4 border border-gray-300">{cita.id.slice(-6)}</td>
              <td className="px-6 py-4 border border-gray-300">{`${cita.pets.owner.name} ${cita.pets.owner.last_name}`}</td>
              <td className="px-6 py-4 border border-gray-300">{cita.pets.name}</td>
              <td className="px-6 py-4 border border-gray-300">{cita.services.description}</td>
              <td className="px-6 py-4 border border-gray-300">
                {cita.slot
                  ? `${new Date(`${cita.slot.date}T${cita.slot.start_time}`).toLocaleString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                  : 'Sin horario definido'}
              </td>
              <td className="px-6 py-4 border border-gray-300">
                <button
                  className="px-2 py-1 mr-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => setSelectedCita(cita)} // Seleccionar cita para editar
                >
                  Editar
                </button>
                <button
                  className="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  onClick={() => handleDelete(cita.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mostrar el formulario de edición */}
      {selectedCita && (
        <EditarCitaForm
          cita={selectedCita}
          onClose={() => setSelectedCita(null)} // Cerrar el formulario
          onUpdate={onUpdate} // Refrescar las citas al guardar
        />
      )}
    </div>
  );
};

export default CitasTable;
