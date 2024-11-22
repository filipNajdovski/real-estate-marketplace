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
        <p className="pageHeader">{t("exploreTitle")}</p>
        {screenWidth < 1024 && (
          <LanguageSelect />
        )}
        
      </header>

      <main>
        <HomeSlider />

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
      </main>
    </div>
  );
}

export default Explore;
