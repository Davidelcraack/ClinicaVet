import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';


function AdministrarMascota() {

    const { user } = useContext(UserAuthContext);
    const [pets, setPets] = useState([]);
    const [userMetadata, setUserMetadata] = useState({});
    const [error, setError] = useState('');
    const navigate = useNavigate();


     useEffect(() => {
       if (!user || user.role !== 'admin') {
         navigate("/permission");
       } else{
        fetchPets();
        fetchUserData();
       }
     }, [user, navigate]); 

     const fetchUserData = async () => {
      if (!user) return;  
      const { data, error } = await supabase.auth.getUser();
    
      if (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setError(error.message);
        return;
      }
    
      if (data && data.user) {
        setUserMetadata(data.user.user_metadata);
      } else {
        console.error('No se encontraron datos del usuario.');
      }
    };
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          name,
          species,
          gender,
          age,
          weight,
          medical_history,
          owner_id
        `);
      
      if (error) throw error;
      else {
    const petsWithOwnerInfo = await Promise.all(data.map(async pet => {
      // Aquí asumimos que tienes una tabla de usuarios o similar donde puedes obtener más datos
      const { data: ownerData, error: ownerError } = await supabase
        .from('users') // Asegúrate de que esta es la tabla correcta
        .select('name, phone')  // Selecciona los campos que necesitas
        .eq('id', pet.owner_id)
        .single();

      if (ownerError) {
        console.error('Error al obtener datos del dueño:', ownerError);
        return pet; // Devuelve la mascota sin información del dueño si hay error
      }

      return { ...pet, owner: ownerData };
    }));

    setPets(petsWithOwnerInfo);
  }
};
    

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
      const loadData = async () => {
        if (user) {  // Asegúrate de que el usuario esté cargado y autenticado.
          const userData = await fetchUserData();
          if (userData) {
            setUserMetadata(userData);
          }
        }
      };
  
      loadData();
  }, [user]); // Dependencia 'user' para asegurar que el usuario esté cargado.

    return (
      <div  className='bg-sky-200 w-screen h-screen'>
      <NavbarAdmin/>
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto '></img>
        <h2 className='text-3xl font-bold text-center text-[#004f6f]'>Gestión de mascotas</h2>
    
      </div>

      {/* Tabla de mascotas */}
      
      <div className='max-w-7xl mx-auto sm:px-4 lg:px-6 overflow-hidden shadow-sm sm:rounded-lg bg-sky-300 pb-6'>
          <h3 className='py-4 text-black font-bold'>Mascotas registradas</h3>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-center rtl:text-right text-gray-500'>
          <thead className='text-gray-800 uppercase bg-sky-400'>
            <tr>
              <th scope='col' className='px-6'>Nombre del dueño</th>
              <th scope='col' className='px-6'>Telefono</th>
              <th scope='col' className='px-6'>Nombre de la mascota</th>
              <th scope='col' className='px-6'>Especie</th>
              <th scope='col' className='px-6'>Genero</th>
              <th scope='col' className='px-6'>edad</th>
              <th scope='col' className='px-6'>Peso</th>
              <th scope='col' className='px-6'>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr className='odd:bg-sky-300 font-semibold even:bg-sky-200 border-b text-gray-600' key={pet.id}>
                <td>{userMetadata.name}</td>
                <td>{userMetadata.phone}</td>
                <td className='px-6 py-4'>{pet.name}</td>  
                <td className='px-6 py-4'>{pet.species}</td>  
                <td className='px-6 py-4'>{pet.gender}</td>  
                <td className='px-6 py-4'>{pet.age}</td>  
                <td className='px-6 py-4'>{pet.weight}</td> 
                <td className='px-6 py-4'>{pet.medical_history}</td>   
                <td className='px-6 py-4'>
                  <button className='font-medium text-red-600 hover:underline px-1'  onClick={() => handleDeleteCita(appoiment.id)}>
                    Eliminar
                  </button>
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
