import {useNavigate, useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'
import  logo from '../assets/png/nedviznini-logo-horizontal.png'

function Navbar() {
    const navigate = useNavigate()
    const location = useLocation()

    const pathMatchRoute = (route) => {
        if(route === location.pathname) {
            return true
        }
    }

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    
    if(screenWidth < 1024) {
        return (
            <footer className='navbar'>
                <nav className="navbarNav">
                    <ul className="navbarListItems">
                        <li className="navbarListItem" onClick={() => navigate('/')}>
                            <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
                        </li>
                        <li className="navbarListItem" onClick={() => navigate('/offers')}>
                            <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
                        </li>
                        <li className="navbarListItem" onClick={() => navigate('/profile')}>
                            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
                        </li>
                    </ul>
                </nav>
            </footer>
        )
    } else {
        return (
            <div className='navbar'>
                <nav className="navbarNav">
                    <div className="logo" onClick={() => navigate('/')}>
                        <img src={logo} alt="Nedviznini Logo" />
                    </div>
                    <ul className="navbarListItems">
                        <li className="navbarListItem" onClick={() => navigate('/')}>
                            <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
                        </li>
                        <li className="navbarListItem" onClick={() => navigate('/offers')}>
                            <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
                        </li>
                        <li className="navbarListItem" onClick={() => navigate('/profile')}>
                            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
                            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
                        </li>
                    </ul>
                </nav>
            </div>
        )
    }

    
}


export default Navbar
