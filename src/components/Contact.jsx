import Navbar from './Navbar'; 

const Contact = () => {
  return (
    <div className='bg-gradient-to-r from-sky-200 to-blue-100 pb-8'>
      <Navbar />
      <div className='bg-gradient-to-r from-sky-200 to-blue-100 min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-4xl px-4 py-8'>
        <div className='bg-white shadow-lg p-6 rounded-lg'>
          <h2 className='text-xl font-bold text-blue-800 text-center mb-6'>Información de Contacto</h2>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <p className='text-gray-800 text-lg text-center'>
              Si tienes alguna pregunta o necesitas asistencia, no dudes en ponerte en contacto con nosotros:
            </p>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-blue-700'>Teléfono</h3>
              <p className='text-gray-600'>+52 3171291534</p>
            </div>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-blue-700'>Correo Electrónico</h3>
              <p className='text-gray-600'>info@clinicaveterinariaguzman.com</p>
            </div>
            <p className='text-sm text-gray-500 text-center'>
              Estamos disponibles de lunes a viernes, de 10:00 am a 2:00 pm regresamos de 5:00 pm a 8:00 pm. <br></br>
              Los sabados de 10: am a 2:00 pm. <br />
              Los domingos estamos cerrados
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Contact;
