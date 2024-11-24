import logo from '../assets/png/nedviznini-logo.png'
import filipLogo from '../assets/png/filip-logo1.png'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Footer() {
    const navigate = useNavigate()
    const {t} = useTranslation()
    return (
        <footer>
            <div className="footerContainer">
                <div className="footerLogo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Nedvinini Logo" />
                </div>
                <p className="copyright">
                    {t('developed')} <a href="https://www.najdovski.tech/"><img src={filipLogo} alt='Filip Najdovski' /> Filip Najdovski</a>
                </p>
            </div>
        </footer>
    )
}
export default Footer