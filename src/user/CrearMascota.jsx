import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext'; 

function CrearMascota() {
  const { user } = useContext(UserAuthContext); // Destructure user directly
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      name: '',
      species: '',
      gender: '',
      age: '',
      weight: '',
      medical_history: ''
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

      // Check for positive values for age and weight
      if (parseInt(formData.age) <= 0 || parseInt(formData.weight) <= 0) {
          setError('La edad y el peso deben ser valores positivos.');
          return;
      }

      // Ensure user is defined before using its ID
      if (!user || !user.id) {
          setError('Usuario no definido.');
          return;
      }

      const { data: petData, error: petError } = await supabase
      .from('pets')
      .insert([{
        ...formData,
        owner_id: user.id // Now correctly using the user's ID from context
      }]);

      if (petError) {
          setError('Error al registrar la mascota: ' + petError.message);
      } else {
          setSuccess('Mascota registrada con éxito!');
          // Resetting form data
          setFormData({
              name: '',
              species: '',
              gender: '',
              age: '',
              weight: '',
              medical_history: ''
          });
      }
  };

  const handleVolver = () => {
    navigate("/");
  }

  const handleCita = () => {
    navigate("/crear-cita");
  }

  return (
  <div className='bg-sky-200'>
   <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la creación de su mascota</h2>
    </div>
    <section className=''>
      <div className='py-8 px-4 mx-6 max-w-2x1 lg:py-16'>
        <h2 className='mb-4 text-xl font-bold text-gray-900'>Registre su mascota</h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          {success && <div style={{ color: 'green' }}>{success}</div>}

          <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
            <div className='sm:col-span-2'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Nombre de la mascota</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Especie</label>
                <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' name="species" value={formData.species} onChange={handleChange} required>
                  <option value="">Selecciona una especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                </select>
            </div>

            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Género</label>
              <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Selecciona un género</option>
                <option value="Hembra">Hembra</option>
                <option value="Macho">Macho</option>
              </select>
            </div>
          
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Edad</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="age" value={formData.age} onChange={handleChange} placeholder='años' required/>
            </div>
          
            <div className='w-full'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Peso</label>
              <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder='kilogramos' required />
            </div>
          
            <div className='sm:col-span-2'>
              <label className='block mb-2 text-sm font-medium text-gray-900'>Historial Medico</label>
              <textarea rows="3" className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500' name="medical_history" value={formData.medical_history} onChange={handleChange} placeholder="Historia Medica" required ></textarea>
            </div>
          </div>
          
          <button onClick={handleSubmit} type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Registrar Mascota</button>
          <button onClick={handleVolver} className="ml-6 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Volver</button>
          <button onClick={handleCita} className="ml-6 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Ya tengo una mascota registrada</button>
        </form>
      </div>
    </section>
  </div>
  );
}

export default CrearMascota;