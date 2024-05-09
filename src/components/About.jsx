import Navbar from './Navbar';
import { FaHeart, FaCheck, FaStar   } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaHandshakeSimple, FaPeopleGroup  } from "react-icons/fa6";

const About = () => {
  return (
    <div className='bg-gradient-to-r from-sky-200 to-blue-100 pb-8'>
      <Navbar />
      <div className='relative z-0 filter'>
        <img src='/images/banner.jpg' className='w-full h-auto'></img>
        <h2 className='text-4xl pt-4 pb-6 font-bold text-center text-[#004f6f]'>Nosotros</h2>
      </div>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='grid  md:grid-cols-2  gap-4'>
        
        <div className='col-span-2 bg-white shadow-lg  p-6 rounded-lg'>
          <div className=''>
            <div className='text-center pt-2'>
              <h2 className='text-xl font-bold text-blue-800 mb-4'>Historia</h2>
            </div>
            <div className='text-gray-800 font-semibold'>
              Trabajando por más de 8 años
            </div>
            <p className='text-gray-800 pt-1 py-2'>
              La Clínica Veterinaria Ciudad Guzmán ha brindado atención veterinaria compasiva y de calidad en Ciudad Guzmán y las comunidades aledañas desde 2014. Cada año, nuestro equipo veterinario asiste a más de 150 horas de educación continua para brindar a sus animales la atención médica y quirúrgica más actualizada.
            </p>
            <p className='text-gray-800 pt-1 py-2'>
              La Clínica Veterinaria Ciudad Guzmán es única en el sentido de que brindamos atención médica a múltiples especies en el área de Zapotlán el Grande en Jalisco.
            </p>
            <p className='text-gray-800 pt-1 py-2'>
              Nuestros veterinarios se especializan en el cuidado de perros y gatos. Brindamos servicios que incluyen, entre otros: atención preventiva, cirugía, odontología, diagnóstico de laboratorio, radiografías y ultrasonido. Los servicios para animales grandes incluyen, entre otros: consulta general, vacunación, desparasitación, control de pulgas y garrapatas, limpieza dental, esterilizaciones, entre otros.
            </p>
          </div>
        </div>
       
          <div className='bg-white shadow-lg p-6 rounded-lg'>
            <h2 className='text-xl font-bold text-blue-800 mb-2'>Misión</h2>
            <p className='text-gray-600 text-balance'>
            Nuestra misión en la Clínica Veterinaria Ciudad Guzmán es ofrecer atención médica de la más alta calidad y compasión hacia cada animal que cruzan nuestras puertas. Nos comprometemos a mejorar la salud y el bienestar de las mascotas y otros animales a través de avanzados tratamientos veterinarios, educación continua y un servicio al cliente excepcional. Estamos dedicados a trabajar de manera colaborativa con los dueños de las mascotas para fomentar una vida larga, saludable y feliz para sus animales. Creemos en la importancia de la comunidad y el entorno, y nos esforzamos por contribuir positivamente a nuestra área local, promoviendo el bienestar animal y la responsabilidad social.
            </p>
          </div>

          <div className='m-auto'>
            <img src='/images/history.png' className='rounded-lg shadow-md' alt='Interior de la Clínica Veterinaria'/>
          </div>

          <div className='col-span-2 text-center bg-white shadow-lg p-6 rounded-lg'>
            <h2 className=' text-xl font-bold text-blue-800 mb-2'>Visión</h2>
            <p className='text-gray-600 py-4'>
            La Clinica Veterinaria Ciudad Guzman trabaja para ser el proveedor de cuidado de mascotas más confiable y respetado en nuestra comunidad al brindar la mejor atención médica posible a cada paciente y brindar un servicio excepcional a cada paciente y dueño de mascota.
            </p>
            <img src='/images/vision.png'/>
          </div>
          <div className='col-span-2 bg-white shadow-lg p-6 rounded-lg'>
            <h2 className='py-2 text-center text-xl font-bold text-blue-800 mb-2'>Valores Fundamentales</h2>
            <p className='text-center pb-4 '>Nuestros valores nos definen como empresa y guían cada aspecto de nuestra práctica en la Clínica Veterinaria Ciudad Guzmán. Estos principios son la base sobre la cual construimos nuestras relaciones con los clientes, tratamos a cada paciente y tomamos decisiones importantes tanto en el cuidado médico como en la administración de nuestro negocio.</p>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center'>
                <FaPeopleGroup className='text-4xl mx-auto mb-2'/>
                <p className='font-bold'>Integridad</p>
              </div>
              <div className='text-center'>
                <FaHeart className='text-4xl mx-auto mb-2 text-red-500'/>
                <p className='font-bold'>Tratamiento Especial</p>
              </div>
              <div className='text-center'>
                <FaCheck className='text-4xl mx-auto mb-2 text-green-500'/>
                <p className='font-bold'>Eficiencia</p>
              </div>
              <div className='text-center'>
                <BsGraphUpArrow className='text-4xl mx-auto mb-2 text-blue-500'/>
                <p className='font-bold'>Crecimiento</p>
              </div>
              <div className='text-center'>
                <FaStar className='text-4xl mx-auto mb-2 text-yellow-500'/>
                <p className='font-bold'>Excelencia</p>
              </div>
              <div className='text-center'>
                <FaHandshakeSimple className='text-4xl mx-auto mb-2'/>
                <p className='font-bold'>Compañerismo</p>
              </div>
            </div>
          </div>
          <div className='col-span-2 bg-white shadow-lg p-6 rounded-lg flex flex-col items-center justify-center'>
             <h2 className='py-4 text-xl font-bold text-blue-800 mb-2'>Ubicación</h2>
             <p className='text-gray-600 text-lg pb-2 text-pretty'>
                Visítanos en nuestra ubicación en: <a href='https://www.google.com/maps/place/Veterinaria+Ciudad+Guzm%C3%A1n/@19.6943991,-103.4660056,17z/data=!4m6!3m5!1s0x842f87614601f353:0xb5089a3df6476ce5!8m2!3d19.694682!4d-103.464128!16s%2Fg%2F11v6xyss6l?entry=ttu' className='text-sky-700'>Calle Gral. Ramón Corona Madrigal 467-A, Cd Guzmán Centro, 49000 Cdad. Guzmán, Jal.</a> Estamos convenientemente ubicados en el corazón del centro de Ciudad Guzmán, fácilmente accesibles desde cualquier parte de la ciudad. Nuestra clínica se encuentra cerca de importantes vías de comunicación y está rodeada de diversas opciones de estacionamiento.
              </p>
              <img className='rounded-xl shadow-lg w-3/4 h-auto' src="/images/ubicacion.png" alt="Ubicación de la Clínica"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
