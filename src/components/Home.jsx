import Navbar from './Navbar';
import Hero from './Hero';
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const navigate = useNavigate();


  function handleLogout() {
    navigate('/');
  }


  return (
    <div>
      <Navbar />
      <Hero />
      {/* Aquí puedes añadir el resto*/}
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
