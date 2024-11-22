import React, { useState, useEffect } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import HomeSlider from "../components/HomeSlider";
import ukIcon from "../assets/lang/united-kingdom.png";
import mkIcon from "../assets/lang/republic-of-macedonia.png";

const languages = [
  { value: "en", label: "English", icon: ukIcon },
  { value: "mk", label: "Македонски", icon: mkIcon },
];

function Explore() {
  const { t } = useTranslation();
  const [lang, setLang] = useState("en");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle visibility
  };

  const handleChange = (value) => {
    setLang(value);
    i18next.changeLanguage(value);
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="explore">
      <header>
        <p className="pageHeader">{t("exploreTitle")}</p>
        {screenWidth < 1024 && (
          <div style={{ position: "relative", width: 200 }}>
            {/* Dropdown Trigger */}
            <div
              onClick={toggleDropdown}
              style={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={languages.find((l) => l.value === lang).icon}
                alt={languages.find((l) => l.value === lang).label}
                style={{ width: 20, marginRight: 10 }}
              />
              {languages.find((l) => l.value === lang).label}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul
                className="selectLangList"
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "4px",
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  zIndex: 1000,
                }}
              >
                {languages.map((language) => (
                  <li
                    key={language.value}
                    onClick={() => handleChange(language.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "8px",
                      cursor: "pointer",
                      backgroundColor: lang === language.value ? "#f0f0f0" : "white",
                    }}
                  >
                    <img
                      src={language.icon}
                      alt={language.label}
                      style={{ width: 20, marginRight: 10 }}
                    />
                    {language.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
