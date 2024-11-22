import React, { useState, useEffect } from "react";
import i18next from "i18next";
import ukIcon from "../assets/lang/united-kingdom.png";
import mkIcon from "../assets/lang/republic-of-macedonia.png";

const languages = [
  { value: "mk", label: "Македонски", icon: mkIcon },
  { value: "en", label: "English", icon: ukIcon },
];

const LanguageSelect = () => {
  const [lang, setLang] = useState("mk");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle visibility
  };

  const handleChange = (value) => {
    setLang(value);
    i18next.changeLanguage(value);
    setIsDropdownOpen(false); // Close the dropdown after selecting
  };


  return (
    <div style={{ position: "relative", width: 150 }}>
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
  );
};

export default LanguageSelect;
