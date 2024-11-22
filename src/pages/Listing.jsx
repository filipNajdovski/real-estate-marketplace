import React from 'react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()
  const {t} = useTranslation()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()) {
        // console.log(docSnap.data())
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])

  if(loading) {
    return <Spinner />
  }

  return (
    <main>
      {console.log(listing.imageUrls[1])}      
      {listing?.imageUrls?.length > 0 ? (
        <Swiper style={{height: '33vh'}} modules={[Navigation, Pagination, Scrollbar, A11y]} slidesPerView={1} pagination={{ clickable: true }}>
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  backgroundImage: `url(${listing.imageUrls[index]})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover'
                }}
                className="swiperSlideDiv"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>{t('noImages')}</p> // Placeholder if imgUrls is undefined or empty
      )}

      <div className="shareIconDiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(() => {
          setShareLinkCopied(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="share icon" />
      </div>

      {shareLinkCopied && <p className='linkCopied'>{t('linkCopy')}</p>}

      <div className="listingDetails">
        <p className="listingName">{listing.name} - {listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}€</p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          {listing.type === 'rent' ? t('forRent') : t('forSale')}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            {listing.regularPrice - listing.discountedPrice}€ {t('discount')}
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} ${t('bedrooms')}` : `1 ${t('bedroom')}`}
          </li>

          <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms} ${t('bathrooms')}` : `1 ${t('bathroom')}`}
          </li>

          <li>{listing.parking && t('parkingSpot')}</li>

          <li>{listing.furnished && t('furnished')}</li>
        </ul>

        <p className="listingLocationTitle">{t('location')}</p>

        {/* MAP */}
        <div className="leafletContainer">
          <MapContainer style={{height: '100%', width: '100%'}} center={[listing.geolocation.lat, listing.geolocation.lng]} zoom={13} scrollWheelZoom={false}>
            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
            {t('contactLandlord')}
          </Link>
        )}

      </div>
    </main>
  )
}

export default Listing