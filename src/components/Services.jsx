import Navbar from './Navbar';

const Services = () => {
  return (
    <>
      <Navbar />
      <div className='bg-gradient-to-r from-sky-200 to-blue-100 min-h-screen flex flex-col items-center justify-center'>
        <div className='w-full max-w-6xl p-6'>
          <h1 className='text-4xl font-bold text-center text-[#004f6f] mb-4 leading-tight drop-shadow-lg'>Servicios Veterinarios</h1>
          <p className='text-xl text-gray-700 text-center mb-6 italic font-semibold shadow-sm'>Especializados en el cuidado y bienestar de perros y gatos.</p>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <ServiceCard title="Consulta General" description="Evaluación completa del estado de salud de tu mascota con opciones de seguimiento personalizado." image="/public/images/services/consulta.png" />
            <ServiceCard title="Vacunación" description="Programas de vacunación esenciales para proteger a tus perros y gatos contra enfermedades." image="/public/images/services/vacunacion.png" />
            <ServiceCard title="Desparasitación" description="Tratamientos efectivos para mantener a tus mascotas libres de parásitos internos y externos." image="/public/images/services/desparacitacion.png" />
            <ServiceCard title="Control de Pulgas y Garrapatas" description="Soluciones avanzadas para proteger a tus mascotas de pulgas, garrapatas y otros parásitos." image="/public/images/services/pulgas.png" />
            <ServiceCard title="Limpieza Dental" description="Servicios de higiene oral para prevenir enfermedades dentales y mantener la salud bucal de tus mascotas." image="/public/images/services/dental.png" />
            <ServiceCard title="Esterilizaciones" description="Procedimientos seguros y eficaces para ayudar a controlar la población de mascotas y mejorar su salud a largo plazo." image="/public/images/services/esterilizacion.png" />
            <ServiceCard title="Cremación" description="Servicios de cremación respetuosos para despedirte de tu mascota con dignidad." image="/public/images/services/cremacion.png" />
            <ServiceCard title="Certificado de Salud" description="Certificados de salud necesarios para viajes y otros requisitos legales o personales." image="/public/images/services/certificados.png" />
          </div>
        </div>
      </div>
    </>
  );
};

const ServiceCard = ({ title, description, image }) => (
  <div className='bg-white rounded-lg shadow-lg p-4 flex flex-col items-center text-center'>
    <img src={image} alt={title} className='w-full h-32 object-cover rounded-t-lg mb-2' />
    <h2 className='text-xl font-bold text-blue-800 mb-2'>{title}</h2>
    <p className='text-gray-600'>{description}</p>
  </div>
);

export default Services;
