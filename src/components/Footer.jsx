import logo from '../assets/png/nedviznini-logo.png'
import { useNavigate } from 'react-router-dom'

function Footer() {
    const navigate = useNavigate()
    return (
        <footer>
            <div className="footerContainer">
                <div className="footerLogo" onClick={() => navigate('/')}>
                    <img src={logo} alt="Nedvinini Logo" />
                </div>
                <p className="copyright">
                    Website Developed by <a href="https://www.najdovski.tech/">Filip Najdovski</a>
                </p>
            </div>
        </footer>
    )
}
export default Footer