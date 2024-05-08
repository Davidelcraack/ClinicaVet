import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../helpers/supabase';
import { UserAuthContext } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
       
      }}>
        <div className='pb-2'>
          <h2 className='pb-2 text-lg font-bold text-center'>Política de Privacidad</h2>
            <p className='text-md font-medium text-justify'>En la Clínica Veterinaria “Ciudad Guzmán”, valoramos la privacidad de nuestros clientes y sus mascotas. Esta política de privacidad explica cómo recopilamos y utilizamos la información personal para gestionar citas eficientemente.</p>
        </div>
        <div className='p-2 text-wrap'>
          <h3 className='text-md font-semibold'>Información Recopilada</h3>
            <p className='pb-2'>Recopilamos datos personales necesarios para agendar citas, incluyendo nombre, contacto y detalles de las mascotas.</p>

          <h3 className='text-md font-semibold'>Uso de la Información</h3>
            <p className='pb-2'>Utilizamos la información recopilada para programar citas, enviar recordatorios y mejorar nuestros servicios.</p>

          <h3 className='text-md font-semibold'>Seguridad</h3>
            <p>Nos comprometemos a proteger la seguridad de su información personal mediante medidas tecnológicas avanzadas.</p>
          </div>

        <button className='py-2 mt-4 border-2 border-gray-100 rounded-xl bg-[#0d6efd] text-white text-md active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all px-8 w-full' onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

const Register = () => {
  const navigate = useNavigate();
  const {signUp, data, user} = useContext(UserAuthContext);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isModalOpen, setModalOpen] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckboxChange = (e) => {
    setIsAgreed(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificación si los campos están vacíos
    if (!formData.email || !formData.password) {
      toast.warning("Todos los campos son obligatorios.");
      return;
    }
    if(!isAgreed){
      toast.warning("Debe aceptar la política de privacidad para continuar")
      return;
    }
    // Intentar registrar al usuario
    const { error } = await signUp(formData);
    if (!error) {
      navigate("/message");
    } else {
      console.error("Error de registro:", error.message);
      toast.error("Error al intentar crear un usuario: " + error.message);
    }
  }

  return (
  <>
   <Toaster position="top-right" richColors/>
    <div className="min-h-screen flex items-center justify-center bg-gray-50"> {/* Contenedor exterior para centrar vertical y horizontalmente */}
      <div className='bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 shadow-lg max-w-md w-full'> {/* Ajusta el tamaño máximo y ancho completo dentro del flex */}
        <h1 className='text-5xl font-semibold text-center'>Crear una cuenta</h1>
        <p className='font-medium text-lg text-gray-400 mt-3 text-center'>¡Regístrate para acceder a todos nuestros servicios!</p>
        <form onSubmit={handleSubmit} className='mt-8'>
          
          <div>
            <label className='text-lg font-medium'>Correo electrónico</label>
            <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su correo electrónico" name='email' onChange={handleChange} />
          </div>
  
          <div>
            <label className='text-lg font-medium'>Contraseña</label>
            <input className='w-full border-2 border-gray-100 rounded-px p-4 mt-1 bg-transparent' placeholder="Ingrese su contraseña" type="password" name='password' onChange={handleChange} />
          </div>
          
          <div className='mt-8 flex items-center mb-4'>
              <input type="checkbox" id='remember' checked={isAgreed} onChange={handleCheckboxChange} />
              <label className='ml-2 font-medium text-base'>He leído y estoy de acuerdo con la <span className='text-[#0d6efd] cursor-pointer' onClick={() => setModalOpen(true)}>política de privacidad</span></label>
            </div>
            <button type="submit" className='py-2 border-2 border-gray-100 rounded-xl bg-[#0d6efd] text-white text-md active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all px-8 w-full'>Crear cuenta</button>
          </form>
        <div className="mt-6 flex justify-center items-center">
          <p className="font-medium text-base">¿Ya tienes una cuenta?</p>
          <Link to='/login' className="text-[#0d6efd] text-base font-medium ml-2">Iniciar sesión</Link>
        </div>
      </div>
    </div>
    <PrivacyPolicyModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

    </>
  );  
};

export default Register;
