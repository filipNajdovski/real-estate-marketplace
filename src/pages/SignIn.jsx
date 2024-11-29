import React from 'react'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const {email, password} = formData

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

    try {
      const auth = getAuth()

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if(userCredential.user) {
        navigate('/')
      }      
    } catch (error) {
      toast.error('Bad User Credentials')
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
          <input type="email" className="emailInput" placeholder='Email' id="email" value={email} onChange={onChange} />
          <div className="passwordInputDiv">
            <input type={showPassword ? 'text' : 'password'} className='passwordInput' id='password' value={password} onChange={onChange} />
            <img src={visibilityIcon} alt="Show Password" onClick={() => setShowPassword((prevState => !prevState))} className="showPassword" />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink' >
            {t('forgotPassword')}
          </Link>

          <div className="signInBar">
            <p className="signInText">
              {t('signIn')}
            </p>
            <button type='submit' className="signInButton">
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>

        <OAuth />

        <Link to='/sign-up' className='registerLink'>
          {t('signUp')}
        </Link>
      </div>
    </>
  )
}

export default SignIn