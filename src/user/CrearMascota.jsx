import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import NavbarUser from './NavbarUser';
import { Toaster, toast } from 'sonner';

function CrearMascota() {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/permission");
    }
  }, [user, navigate]);

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

    // Validar que el usuario está definido y tiene un ID
    if (!user || !user.id) {
      setError('Usuario no definido.');
      return;
    }

    // Validar que los campos requeridos no estén vacíos
    if (!formData.name || !formData.species || !formData.gender) {
      toast.error('Por favor complete todos los campos requeridos.');
      return;
    }

    // Intento de registro de la mascota
    const { data: petData, error: petError } = await supabase
      .from('pets')
      .insert({
        name: formData.name,
        species: formData.species,
        gender: formData.gender,
        age: formData.age || null, // Si está vacío, asigna null
        weight: formData.weight || null, // Si está vacío, asigna null
        medical_history: formData.medical_history || '', // Si está vacío, asigna una cadena vacía
        owner_id: user.id
      });

    if (petError) {
      toast.error("Ha ocurrido un error inesperado, por favor vuelve a intentarlo más tarde")
      setError('Error al registrar la mascota: ' + petError.message);
    } else {
      toast.success("Mascota registrada con éxito")
      // Reseteo de los datos del formulario
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

  return (
    <div className='bg-sky-200'>
      <Toaster position="top-right" richColors />
      <NavbarUser />
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto' alt="banner" />
        <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la creación de su mascota</h2>
      </div>
      <section className='py-4'>
        <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
          <h2 className='py-4 text-black font-bold'>Registre su mascota</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>{success}</div>}

            <div className='grid gap-4 sm:grid-cols-2 sm:gap-6'>
              <div className='sm:col-span-2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Nombre de la mascota <strong>*</strong></label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className='w-full'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Especie <strong>*</strong></label>
                <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' name="species" value={formData.species} onChange={handleChange} required>
                  <option value="">Selecciona una especie</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>

              <div className='w-full'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Género <strong>*</strong></label>
                <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Selecciona un género</option>
                  <option value="Hembra">Hembra</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>

              <div className='w-full'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Edad</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="age" value={formData.age} onChange={handleChange} placeholder='años' />
              </div>

              <div className='w-full'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Peso</label>
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder='kilogramos' />
              </div>

              <div className='sm:col-span-2'>
                <label className='block mb-2 text-sm font-medium text-gray-900'>Descripción</label>
                <textarea rows="3" className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500' name="medical_history" value={formData.medical_history} onChange={handleChange} placeholder="añade una breve descripción de tu mascota"></textarea>
              </div>
            </div>

            <button type="submit" className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Registrar Mascota</button>
            <Link to="/dashboard" className="ml-6 inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-primary-200">Ya tengo una mascota registrada</Link>
          </form>
        </div>
      </section>
    </div>
  );
}

export default CrearMascota;
