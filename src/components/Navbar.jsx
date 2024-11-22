// Navbar.js
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';
import logo from '../assets/png/nedviznini-logo-horizontal.png';
import LanguageSelect from './LanguageSelect'; // Import the existing LanguageSelect component

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const pathMatchRoute = (route) => {
    return route === location.pathname;
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For small screens, use the footer style navigation
  if (screenWidth < 1024) {
    return (
      <footer className='navbar'>
        <nav className="navbarNav">
          <ul className="navbarListItems">
            <li className="navbarListItem" onClick={() => navigate('/')}>
              <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("exploreTitle")}</p>
            </li>
            <li className="navbarListItem" onClick={() => navigate('/offers')}>
              <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("offersTitle")}</p>
            </li>
            <li className="navbarListItem" onClick={() => navigate('/profile')}>
              <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("profile")}</p>
            </li>
          </ul>
        </nav>
      </footer>
    );
  } else {
    // For larger screens, use the full navbar
    return (
      <div className='navbar'>
        <nav className="navbarNav">
          <div className="logo" onClick={() => navigate('/')}>
            <img src={logo} alt="Nedviznini Logo" />
          </div>
          <ul className="navbarListItems">
            <li className="navbarListItem" onClick={() => navigate('/')}>
              <ExploreIcon fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("exploreTitle")}</p>
            </li>
            <li className="navbarListItem" onClick={() => navigate('/offers')}>
              <OfferIcon fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("offersTitle")}</p>
            </li>
            <li className="navbarListItem" onClick={() => navigate('/profile')}>
              <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'} width='36px' height='36px' />
              <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>{t("profile")}</p>
            </li>
            <li className="navbarListItem select">
              <LanguageSelect />
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;
