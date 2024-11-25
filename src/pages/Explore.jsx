// Explore.js
import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import HomeSlider from "../components/HomeSlider";
import LanguageSelect from "../components/LanguageSelect" 

function Explore() {
  const { t } = useTranslation();

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="explore">
      <header>
        <h3 className="pageHeader">{t("exploreTitle")}</h3>
        {screenWidth < 1024 && (
          <LanguageSelect />
        )}
        
      </header>

      <main>
        <HomeSlider />

        <h1 className="pageHeading">Дигитална Агенција за Недвижнини во Македонија</h1>

        <p className="primaryParagraph">Барате идеален дом, деловен простор или простор за забава? Недвижнини е вашата дестинација за лесно и брзо пронаоѓање и купување или изнајмување недвижности низ цела Македонија.</p>

        <p className="exploreCategoryHeading">{t("categories")}</p>
        <div className="exploreCategories">
          <Link to="/category/rent">
            <img
              src={rentCategoryImage}
              alt="rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">{t("forRent")}</p>
          </Link>
          <Link to="/category/sale">
            <img
              src={sellCategoryImage}
              alt="sell"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">{t("forSale")}</p>
          </Link>
        </div>
        <section className="about">
          <div className="ablotList">
            <p className="aboutListHeading">Што Нудиме?</p>
            <h3 className="aboutListItem">Станови и Куќи за Продажба и Изнајмување: Од урбани станови во центарот на градовите до мирни семејни куќи.</h3>
            <h3 className="aboutListItem">Деловни Простори: Најдете совршено место за вашата компанија или старт-ап</h3>
            <h3 className="aboutListItem">Простори за Забава: Локации за ресторани, кафулиња, или настани што ќе го остават вашиот печат</h3>
          </div>
          <div className="ablotList">
            <p className="aboutListHeading">Зошто да Изберете Недвижни?</p>
            <h3 className="aboutListItem">Богата Понуда: Илјадници огласи за продажба и изнајмување.</h3>
            <h3 className="aboutListItem">Прецизно Пребарување: Филтрирајте според локација, цена, тип на недвижност, и повеќе.</h3>
            <h3 className="aboutListItem">Лесно Поврзување: Контактирајте директно со сопствениците или агентите.</h3>
            <h3 className="aboutListItem">Локален Фокус: Секогаш ажурирана понуда низ сите региони на Македонија.</h3>
          </div>
          <div className="ablotList">
            <p className="aboutListHeading">Како Функционира?</p>
            <h3 className="aboutListItem">Пребарајте ја базата на недвижности.</h3>
            <h3 className="aboutListItem">Изберете недвижност што одговара на вашите потреби.</h3>
            <h3 className="aboutListItem">Поврзете се со сопствениците или агентите за дополнителни информации.</h3>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Explore;
