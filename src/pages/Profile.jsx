import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { getAuth , updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import {db} from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import {toast} from 'react-toastify'
import ListingItem from '../components/ListingItem'
import { Link } from 'react-router-dom'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth()
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [listings, setListings] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const {name, email} = formData

  const navigate = useNavigate()
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))


      const querySnap = await getDocs(q)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }

    fetchUserListings()
  }, [auth.currentUser.uid])

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if(auth.currentUser.displayName !== name){
        // Update display name in Firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // Update in Firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error(t('unableUpdateProfile'))
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onDelete = async (listingId) => {
    if(window.confirm(t('confirmDeleteProperty'))){
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)

      setListings(updatedListings)
      toast.success(t('succesDeletePropery'))
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">{t("myProfile")}</p>
      <button type='button' onClick={onLogout} className="logOut">{t('logout')}</button>
    </header>

    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">{t("personalDetails")}</p>
        <p className="changePersonalDetails" onClick={() => {
          changeDetails && onSubmit()
          setChangeDetails((prevState) => !prevState)
        }}>
          {changeDetails ? 'done' : t('change')}
        </p>
      </div>
      <div className="profileCard">
        <form action="">
          <input type="text" id="name" className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
          <input type="text" id="email" className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />
        </form>
      </div>

      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt="home" />
        <p>{t("sellOrRent")}</p>
        <img src={arrowRight} alt="arrow right" />
      </Link>

      {!loading && listings?.length > 0 && (
        <>
          <p className="listingText">{t('yourProperties')}</p>
          <ul className="listingsList">
            {listings.map((listing) => (
              <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
            ))}
          </ul>
        </>
      )}
    </main>
  </div>
}

export default Profile