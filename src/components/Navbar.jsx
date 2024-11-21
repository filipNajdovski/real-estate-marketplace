import {useNavigate, useLocation} from 'react-router-dom'
import { useEffect, useState } from 'react'
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import {ReactComponent as OfferIcon} from '../assets/svg/localOfferIcon.svg'
import {ReactComponent as ExploreIcon} from '../assets/svg/exploreIcon.svg'
import {ReactComponent as PersonOutlineIcon} from '../assets/svg/personOutlineIcon.svg'
import  logo from '../assets/png/nedviznini-logo-horizontal.png'
import ukIcon from '../assets/lang/united-kingdom.png'
import mkIcon from '../assets/lang/republic-of-macedonia.png'

const languages = [
    { value: "en", text: "English" },
    { value: "mk", text: "Македонски" },
];

function Navbar() {
    // It is a hook imported from 'react-i18next'
    const { t } = useTranslation();
    const [lang, setLang] = useState("en");

    // This function put query that helps to
    // change the language
    const handleChange = (e) => {
        setLang(e.target.value);
        i18next.changeLanguage(e.target.value); // Change the language dynamically
    };

    // useEffect(() => {
    //     console.log("Current language:", i18next.language);
    //     console.log("Translations:", i18next.store.data);
    //   }, []);

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
                        <li>
                            <select value={lang} onChange={handleChange}>
                                {languages.map((item) => {
                                    return (
                                        <option
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.text}
                                        </option>
                                    );
                                })}
                            </select>
                        </li>
                        {/* <li>
                            <div id="select-container">
                                <ul>
                                    <li lang-selection="FR" tooltip="FR" flow="down">
                                    <img src={ukIcon} />
                                    </li>

                                    <li lang-selection="EN" tooltip="EN" flow="down" onclick="onSelect(this)">
                                    <img src={mkIcon} />
                                    </li>

                                </ul>
                            </div>
                        </li> */}
                    </ul>
                </nav>
            </div>
        )
    }

    
}


export default Navbar
