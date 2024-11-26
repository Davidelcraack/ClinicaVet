import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { Toaster, toast } from 'sonner';
import { Link } from 'react-router-dom';


function EditarMascota() {
    const { user } = useContext(UserAuthContext);
    const { petId } = useParams(); 
    const navigate = useNavigate();
    const [pet, setPet] = useState({
        name: '',
        species: '',
        gender: '',
        age: '',
        weight: '',
        medical_history: '',
        doctor_notes: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!user || user.role !== 'admin') {
          navigate("/permission");
      } else {
        fetchPetDetails();
      }
    }, [user, navigate, petId]); 

    const fetchPetDetails = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .single();

        if (error) {
            setError(error.message);
        } else if (data) {
            setPet(data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setPet({ ...pet, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        // Validar que todos los campos estén completos
        if (!pet.name || !pet.species || !pet.gender || !pet.age || !pet.weight || !pet.medical_history || !pet.doctor_notes) {
            setLoading(false);
            toast.warning('Por favor, completa todos los campos.');
            return;
        }
    
        const { data, error } = await supabase
            .from('pets')
            .update({
                name: pet.name,
                species: pet.species,
                gender: pet.gender,
                age: pet.age,
                weight: pet.weight,
                medical_history: pet.medical_history,
                doctor_notes: pet.doctor_notes
            })
            .eq('id', petId);
    
        setLoading(false);
    
        if (error) {
            setError(error.message);
            toast.error('Un error ha ocurrido: ' + error.message);
        } else {
            navigate('/administrar-mascota');          
        }
    };
    

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
    <>
    <Toaster position="top-right" richColors/>
      <div className='bg-sky-200'>
        <div className='relative z-0 filter'>
          <img src='/images/banner.jpg' className='w-full h-auto'></img>
          <h2 className='text-2xl font-bold text-center text-[#004f6f]'>Por favor rellena el siguiente formulario para la actualizacion de la información de la mascota</h2>
        </div>
        <div className='pb-6 mx-auto overflow-hidden shadow-sm max-w-7xl sm:px-4 lg:px-6 sm:rounded-lg bg-sky-300'>
                <h3 className='py-4 font-bold text-black'>Mascotas registradas</h3>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-sky-200'>
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Nombre:
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' type="text" name="name" value={pet.name} onChange={handleChange} />
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Especie:
                <select 
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                name="species"
                value={pet.species}
                onChange={handleChange}
                >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                </select>
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Género:
                <select 
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                name="gender"
                value={pet.gender}
                onChange={handleChange}
                >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
                </select>
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Edad:
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' type="number" name="age" value={pet.age} onChange={handleChange} />
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Peso:
                <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' type="number" name="weight" value={pet.weight} onChange={handleChange} />
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Descripcion:
                <textarea className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' name="medical_history" value={pet.medical_history} onChange={handleChange} />
            </label>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
                Notas medicas:
                <textarea className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5' name="doctor_notes" value={pet.doctor_notes} onChange={handleChange} />
            </label>
            <button className="px-6 py-2 mt-4 ml-4 text-white bg-blue-600 rounded-md" type="submit">Guardar Cambios</button>
            <Link to="/administrar-mascota" className="flex-1 px-6 py-2 mx-2 text-white transition duration-150 ease-in-out bg-green-800 rounded-md hover:bg-green-700">Volver</Link>
        </form>
      </div>
      </div>
      </div>
      </>
    );
}

export default EditarMascota;
