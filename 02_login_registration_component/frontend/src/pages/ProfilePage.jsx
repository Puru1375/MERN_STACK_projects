import React from 'react'
import LogoutButton from '../components/LogoutButton'

const ProfilePage = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <div>welcome, this is profile</div>
        <LogoutButton/>
    </div>
  )
}

export default ProfilePage