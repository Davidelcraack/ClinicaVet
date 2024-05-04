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
              doctor_notes,
              owner_id,
              owner:users!owner_id (id, name, last_name, phone, email)
          `);
  
      if (error) {
          console.error('Error al cargar mascotas:', error);
          setError(error.message);
          return;
      }
  
      // Asumiendo que la información del propietario está correctamente cargada desde la tabla 'users'
      const petsWithOwnerInfo = data.map(pet => {
          const ownerInfo = pet.owner ? { name: pet.owner.name, last_name: pet.owner.last_name, phone: pet.owner.phone, email: pet.owner.email } : { name: 'Desconocido', phone: 'No disponible' };
          return {
              ...pet,
              owner: ownerInfo
          };
      });
  
      setPets(petsWithOwnerInfo);
  };

  const deletePet = async (petId) => {
    const { data, error } = await supabase
        .from('pets')
        .delete()
        .match({ id: petId });

        if (error) {
            setError('Error al eliminar la mascota: ' + error.message);
        } else {
            setPets(pets.filter(pet => pet.id !== petId)); // Actualizar el estado para remover la mascota eliminada
        }
    };

    const editPet = (petId) => {
        navigate(`/editar-mascota/${petId}`); // Navegar a la ruta de edición, asegúrate de crear esta ruta y componente
    };

    return (
        <div className='bg-sky-200'>
            <NavbarAdmin/>
            <div className='relative z-0 filter'>
                <img src='/images/banner.jpg' className='w-full h-auto'></img>
                <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Gestión de mascotas</h2>
            </div>

            <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
                <h3 className='py-4 text-black font-bold'>Mascotas registradas</h3>
                <div className='relative overflow-x-auto shadow-md sm:rounded-lg bg-sky-200'>
                    <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
                        <thead className='text-gray-800 uppercase bg-sky-400'>
                            <tr>
                                <th scope='col' className='px-6'>Dueño</th>
                                <th scope='col' className='px-10'>Correo electronico</th>
                                <th scope='col' className='px-6'>Teléfono</th>
                                <th scope='col' className='px-6'>Nombre de la mascota</th>
                                <th scope='col' className='px-6'>Especie</th>
                                <th scope='col' className='px-6'>Género</th>
                                <th scope='col' className='px-4'>Edad</th>
                                <th scope='col' className='px-4'>Peso</th>
                                <th scope='col' className='px-16'>Descripción</th>
                                <th scope='col' className='px-16'>Notas medicas</th>
                                <th scope='col' className='px-6'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map((pet) => (
                                <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={pet.id}>
                                    <td>{pet.owner.name} {pet.owner.last_name}</td>
                                    <td>{pet.owner.email}</td>
                                    <td>{pet.owner.phone}</td>
                                    <td className='px-6 py-4'>{pet.name}</td>  
                                    <td className='px-6 py-4'>{pet.species}</td>  
                                    <td className='px-6 py-4'>{pet.gender}</td>  
                                    <td className='px-6 py-4'>{pet.age}</td>  
                                    <td className='px-6 py-4'>{pet.weight}</td> 
                                    <td className='px-6 py-4'>{pet.medical_history}</td>
                                    <td className='px-6 py-4'>{pet.doctor_notes}</td>
                                    <td className='px-6 py-4'>
                                        <button onClick={() => editPet(pet.id)} className="text-blue-500 hover:text-blue-700">Editar</button>
                                        <button onClick={() => deletePet(pet.id)} className="text-red-500 hover:text-red-700 ml-4">Eliminar</button>
                                    </td>
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
