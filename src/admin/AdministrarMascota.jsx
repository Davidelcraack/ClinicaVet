import { useState, useEffect, useContext } from 'react';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';


function AdministrarMascota() {

    const {token, user} = useContext(UserAuthContext);
    const [pets, setPets] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
      if (!user || !token || user.role !== 'admin') {
        navigate("/permission");
      }
    }, [user, token, navigate]); 

// Recupera mascotas y el nombre de su dueño desde el backend
    const fetchPets = async () => {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          name,
          species,
          users (
            name
          )
        `);
      console.log(data)
      if (error) {
        console.log("Error fetching pets:", error);
      } else {
        setPets(data);
      }
    };
    

    useEffect(() => {
        fetchPets();
    }, []);

    return (
      <div>
          <NavbarAdmin/>
          <h1>Pets Dashboard</h1>
          <table>
              <thead>
                  <tr>
                      <th>Pet Name</th>
                      <th>Species</th>
                      <th>Owner's Name</th>
                  </tr>
              </thead>
              <tbody>
                  {pets.map((pet, index) => (
                      <tr key={index}>
                          <td>{pet.name}</td>
                          <td>{pet.species}</td>
                          <td>{pet.users.name}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
  
}

export default AdministrarMascota;
