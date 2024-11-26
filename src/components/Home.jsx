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
    </div>
  );
};

export default Home;
