import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense
      fallback={
        <>
          <div className="ablotList">
            <p className="aboutListHeading">Што Нудиме?</p>
            <h3 className="aboutListItem">
              Станови и Куќи за Продажба и Изнајмување: Од урбани станови во центарот на градовите до мирни семејни куќи.
            </h3>
            <h3 className="aboutListItem">
              Деловни Простори: Најдете совршено место за вашата компанија или старт-ап
            </h3>
            <h3 className="aboutListItem">
              Простори за Забава: Локации за ресторани, кафулиња, или настани што ќе го остават вашиот печат
            </h3>
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
        </>
      }
    >
      <App />
    </Suspense>
  </React.StrictMode>
);

reportWebVitals();
