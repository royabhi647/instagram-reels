import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import ProfileComp from '../components/ProfileComp'
import { AuthContext } from '../context/auth';

function profile() {

  const {user} = useContext(AuthContext);

  const Redirect = () => {
    const router = useRouter()
    router.push('/login');
    return null;
  }

  return (

    <>
      {
        user?.uid ? <ProfileComp /> : <Redirect />
      }
    </>
    
  )
}

export default profile