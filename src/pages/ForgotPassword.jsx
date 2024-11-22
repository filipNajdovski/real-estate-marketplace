import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const {t} = useTranslation()

  const onChange = (e) => {
    setEmail(e.target.value)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success(t('emailSent'))
    } catch (error) {
      toast.error(t('emailNotSent'))
    }
  }
  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">{t('forgotPassword')}</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={onChange} />
          <Link className='forgotPasswordLink' to='/sign-in'>{t('Sign In')}</Link>

          <div className="signInBar">
            <div className="signInText">{t('sendResetLink')}</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword