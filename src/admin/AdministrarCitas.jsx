import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import NavbarAdmin from './NavbarAdmin';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from "../context/UserAuthContext";
import { Toaster, toast } from "sonner";

const AdministrarCita = () => {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const [appoiments, setCitas] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Formato YYYY-MM-DD
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/permission");
    } else {
      fetchCitas(selectedDate);
    }
  }, [user, navigate, selectedDate]);

  const fetchCitas = async (date) => {
    setLoading(true);
    setError('');
    try {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(startDate.getDate() + 1); // Añadir un día
  
      let { data, error } = await supabase
        .from('appoiments')
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
        .gte('slot.date', startDate.toISOString().slice(0, 10))
        .lt('slot.date', endDate.toISOString().slice(0, 10));
  
      if (error) throw error;
  
      const citasConSlot = data.filter(appoiment => appoiment.slot && appoiment.slot.date && appoiment.slot.start_time)
        .sort((a, b) => {
          try {
            const dateA = new Date(`${a.slot.date}T${a.slot.start_time}`);
            const dateB = new Date(`${b.slot.date}T${b.slot.start_time}`);
            return dateA - dateB;
          } catch (e) {
            console.error('Error al procesar las fechas:', e);
            setError('Algunas fechas no se pudieron procesar correctamente.');
            return 0;
          }
        });
  
      setCitas(citasConSlot);
    } catch (error) {
      setError('Error al cargar las citas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleClick = () => {
    navigate("/")
  };

  const handlePrint = () => {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: "landscape",
        });
  
        // Calcular el tamaño deseado para la tabla en el PDF
        const imgWidth = 280;  // Ajusta este valor según sea necesario
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Agregar la imagen al PDF con la escala adecuada
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save("tabla_citas.pdf");
      });
  };

  const handleDeleteCita = async (appoimentId) => {
    const {data, error} = await supabase
    .from('appoiments')
    .delete()
    .match({id: appoimentId});
  
    if(error){
      toast.error("Error al intentar eliminar la cita")
      return;
    }
    setCitas(appoiments.filter(cita => cita.id !== appoimentId));
    toast.success("Cita eliminada correctamente");
  }



  return (
    <div className='bg-sky-200 pb-20'>
      <Toaster position="top-right" richColors/>
      <NavbarAdmin/>
      <div className='relative z-0 filter pb-4'>
        <img src='/images/banner.jpg' className='w-full h-auto '></img>
        <h2 className='text-3xl font-bold text-center pb-4 pt-4 text-[#004f6f]'>Gestión de Citas</h2>
        {/* Selector de fecha */}
        <div className='text-center'>
          <input
            type='date'
            value={selectedDate}
            onChange={handleDateChange}
            className='p-2 border-2 border-gray-300 rounded-md'
          />
        </div>
        {/* Resto del componente... */}
      </div>
  
      {/* Tabla de citas */}
      <div id="divToPrint" className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
        <h3 className='py-4 text-black font-bold'>Citas del dia</h3>
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
            <thead className='text-gray-800 uppercase bg-sky-400'>
              <tr>
                <th scope='col' className='px-8 py-2'>Dueño</th>
                <th scope='col' className='px-8 '>Email</th>
                <th scope='col' className='px-8'>Teléfono</th>
                <th scope='col' className='px-8'>Mascota</th>
                <th scope='col' className='px-8'>Especie</th>
                <th scope='col' className='px-8'>Servicios</th>
                <th scope='col' className='px-8'>Fecha y hora</th>
                <th scope='col' className='px-8'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appoiments.map((appoiment) => (
                <tr  key={appoiment.id} className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600'>
                  <td className="py-4 px-6">{appoiment.pets.owner.name} {appoiment.pets.owner.last_name}</td>
                  <td>{appoiment.pets.owner.email}</td>
                  <td>{appoiment.pets.owner.phone}</td>
                  <td>{appoiment.pets.name}</td>
                  <td>{appoiment.pets.species}</td>
                  <td>{appoiment.services.description}</td>
                  <td>
                    {appoiment.slot
                      ? `${new Date(appoiment.slot.date + 'T' + appoiment.slot.start_time).toLocaleString()}`
                      : 'Sin horario definido'}
                  </td>
                  <td className='px-6 py-4'>
                    <button className='font-medium text-red-600 hover:underline px-1' onClick={() => handleDeleteCita(appoiment.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-row">
        <button onClick={handlePrint} className='mr-4 py-2 mt-4 rounded-lg bg-[#0d6efd] text-white text-sm w-[150px] font-medium'>Imprimir PDF</button>
        <button onClick={handleClick} className='py-2 mt-4 rounded-lg bg-[#0d6efd] text-white text-sm w-[150px] font-medium'>Volver al inicio</button>
        </div>
      </div>
    </div>
  );
  
};
export default AdministrarCita;