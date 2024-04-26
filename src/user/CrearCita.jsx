import { useState } from 'react';
import { supabase } from '../helpers/supabase';
import { useNavigate } from 'react-router-dom';

function CrearCita() {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    pet_name: '',
    species: '',
    gender: '',
    age: '',
    weight: '',
    medical_history: '',
    problem_description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (formData.age <= 0 || formData.weight <= 0) {
      setError('La edad y el peso deben ser valores positivos.');
      return;
    }

    const { data, error } = await supabase
      .from('pets')
      .insert([formData]);

    if (error) {
      setError('Error al registrar la mascota: ' + error.message);
    } else {
      setSuccess('Mascota registrada con éxito!');
      setFormData({
        pet_name: '',
        species: '',
        gender: '',
        age: '',
        weight: '',
        medical_history: '',
        problem_description: ''
      }); // Limpiar el formulario
    }
  };

  return (
    <section className='bg-white'>
      <div className='py-8 px-4 mx-6 max-w-2x1 lg:py-16'>
        <h2 className='mb-4 text-xl font-bold text-gray-900'>Agendar Nueva cita</h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}
          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
            <div className='sm:col-span-2'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Nombre de la mascota</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="pet_name" value={formData.pet_name} onChange={handleChange} required />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Especie</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="species" value={formData.species} onChange={handleChange} required />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Genero</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="gender" value={formData.gender} onChange={handleChange} required />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Edad</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="age" value={formData.age} onChange={handleChange} placeholder='años' required />
            </div>
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Peso</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder='kilogramos' required />
            </div>
            <div className='sm:col-span-2'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Historial Medico</label>
              <textarea rows="3" className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500' name="medical_history" value={formData.medical_history} onChange={handleChange} placeholder="Historia Medica" required ></textarea>
            </div>
            <div className='sm:col-span-2'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Descripción</label>
              <textarea rows="3" className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500' name="problem_description" value={formData.problem_description} onChange={handleChange} placeholder="Descripcion del problema" required ></textarea>
            </div>
          </div>
          <button type="submit" class="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Registrar Cita</button>
        </form>
      </div>
    </section>
  );
}

export default CrearCita;