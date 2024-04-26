import { createContext, useState, useEffect } from 'react';
import {supabase} from '../helpers/supabase';


export const UserAuthContext = createContext(null);

function UserAuthProvider({children}){

  const [user, setUser] = useState();

  useEffect(() => {
    checkUser().catch(error=>console.error(error));
  }, []);

  async function checkUser() {

      const session = await supabase.auth.getSession();
     
      if (session.data.session) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('roles(name)')
          .eq('id', session.data.session.user.id)
          .single()

        if (error) throw error;

        setUser({ ...session.data.session.user, role: userProfile.roles.name });
      }
    
  }


  const logIn = async(formData) => {
    const { data, error } =  await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    }); 
    if (error) {
      console.error('Error de inicio de sesión:', error.message);

      return false
    }
    if(data){
      const {user} = data
      setUser(user)
      return true
    }
      
  }
  
  const singUp = async(formData)=> {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name:formData.name,
          last_name:formData.last_name,
          phone: formData.phone
          
        }
      } 
    });


    const { data: publicUserData, error: publicUserError} = await supabase.from('users').insert({
      name: formData.name,
      last_name: formData.last_name,
      phone: formData.phone,
      email: formData.email
    }).eq('id', data.user.id).select()

  }


  useEffect(() => {
    supabase.auth.getUser().then(res => {
      const {data: {user}} = res
      setUser(user)
    }).catch(e => console.error(e))
    
  }, [])

  const logOut = async() => {
    await supabase.auth.signOut();
    setUser(null)
  }
  
  return(
    

    <UserAuthContext.Provider value={{user, logIn, logOut, singUp}}>
      {children}
    </UserAuthContext.Provider>
  );
}

export default UserAuthProvider;