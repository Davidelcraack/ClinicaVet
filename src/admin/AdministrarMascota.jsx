import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

function AdministrarMascota() {
    const { user } = useContext(UserAuthContext);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate("/permission");
        } else {
            fetchPets();
        }
    }, [user, navigate]); 

    const fetchPets = async () => {
      const { data, error } = await supabase
          .from('pets')
          .select(`
              id,
              name,
              species,
              gender,
              age,
              weight,
              medical_history,
              owner_id,
              owner:users!owner_id (id, name, last_name, phone)
          `);
  
      if (error) {
          console.error('Error al cargar mascotas:', error);
          setError(error.message);
          return;
      }
  
      // Asumiendo que la información del propietario está correctamente cargada desde la tabla 'users'
      const petsWithOwnerInfo = data.map(pet => {
          const ownerInfo = pet.owner ? { name: pet.owner.name, last_name: pet.owner.last_name, phone: pet.owner.phone } : { name: 'Desconocido', phone: 'No disponible' };
          return {
              ...pet,
              owner: ownerInfo
          };
      });
  
      setPets(petsWithOwnerInfo);
  };
  

    return (
        <div className='bg-sky-200 w-screen h-screen'>
            <NavbarAdmin/>
            <div className='relative z-0 filter bg-sky-200'>
                <img src='/images/banner.jpg' className='w-full h-auto'></img>
                <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Gestión de mascotas</h2>
            </div>

            <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
                <h3 className='py-4 text-black font-bold'>Mascotas registradas</h3>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-sky-200'>
                    <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
                        <thead className='text-gray-800 uppercase bg-sky-400'>
                            <tr>
                                <th scope='col' className='px-6'>Nombre del dueño</th>
                                <th scope='col' className='px-6'>Teléfono</th>
                                <th scope='col' className='px-6'>Nombre de la mascota</th>
                                <th scope='col' className='px-6'>Especie</th>
                                <th scope='col' className='px-6'>Género</th>
                                <th scope='col' className='px-6'>Edad</th>
                                <th scope='col' className='px-6'>Peso</th>
                                <th scope='col' className='px-6'>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map((pet) => (
                                <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={pet.id}>
                                    <td>{pet.owner.name} {pet.owner.last_name}</td>
                                    <td>{pet.owner.phone}</td>
                                    <td className='px-6 py-4'>{pet.name}</td>  
                                    <td className='px-6 py-4'>{pet.species}</td>  
                                    <td className='px-6 py-4'>{pet.gender}</td>  
                                    <td className='px-6 py-4'>{pet.age}</td>  
                                    <td className='px-6 py-4'>{pet.weight}</td> 
                                    <td className='px-6 py-4'>{pet.medical_history}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default AdministrarMascota;
