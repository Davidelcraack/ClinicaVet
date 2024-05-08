// Login.jsx
import { useState, useContext } from 'react';
import { supabase } from "../helpers/supabase";
import FormLogin from './FormLogin';
import { useNavigate } from 'react-router-dom';
import { UserAuthContext } from '../context/UserAuthContext';
import { Toaster, toast } from 'sonner';


const Login = () => {
  const navigate = useNavigate();
  const {logIn} = useContext(UserAuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
  }

  
  const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!formData.email || !formData.password) {
      toast.warning("Por favor ingrese todos los campos.");
      return; 
    }

    logIn(formData); 
    toast.success("Por favor diríjase a su correo electrónico para más instrucciones");
    navigate("/");
  }


  return (
    <>
     <Toaster position="top-right" richColors/>
    <FormLogin 
      handleSubmit={handleSubmit} 
      handleChange={handleChange}
    />
    </>
  );
};

export default Login;
