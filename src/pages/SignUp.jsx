import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
import {db} from '../firebase.config'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const {name, email, password} = formData

  const navigate = useNavigate()
  const {t} = useTranslation()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try{
      const auth = getAuth()

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)  
      const user = userCredential.user

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    }catch (error){
      toast.error(t('somethingWrong'))
    }
  }

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            {t('welcome')}
          </p>
        </header>
        
        <form onSubmit={onSubmit}>
        <input type="text" className="nameInput" placeholder='Name' id="name" value={name} onChange={onChange} />
          <input type="email" className="emailInput" placeholder='Email' id="email" value={email} onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' id='password' value={password} onChange={onChange} />
            <img src={visibilityIcon} alt="Show Password" onClick={() => setShowPassword((prevState => !prevState))} className="showPassword" />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink' >
            {t('forgotPassword')}
          </Link>

          <div className="signUpBar">
            <p className="signUpText">
              {t('signUp')}
            </p>
            <button type='submit' className="signUpButton">
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to='/sign-in' className='registerLink'>
          {t('alreadyAUser')}
        </Link>
      </div>
    </>
  )
}

export default SignUp