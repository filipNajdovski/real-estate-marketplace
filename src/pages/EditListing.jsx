import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { 
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL 
} from 'firebase/storage'
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Spinner from '../components/Spinner'
import {v4 as uuidv4} from 'uuid'
import { toast } from 'react-toastify'


function EditListing() {
    // eslint-disable-next-line no-unused-vars
    const [geolocationEnabled, setGeoLocationEnabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const [listing, setListing] = useState(null)
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: '1',
        bathrooms: '1',
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    })

    const { type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude } = formData

    const auth = getAuth()
    const navigate = useNavigate()
    const params = useParams()
    const isMounted = useRef(true)
    const {t} = useTranslation()

    // Redirect if listing it's not this user's
    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error(t('editListingError'))
            navigate('/')
        }
    }, [auth.currentUser.uid, listing, navigate])

    // Fetch listing to eddit
    useEffect(() => {
        setLoading(true)
        const fetchListing = async () => {
            const docRef = doc(db, 'listings', params.listingId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists) {
                setListing(docSnap.data())
                setFormData({...docSnap.data(), address: docSnap.data().location})
                setLoading(false)
            } else {
                navigate('/')
                toast.error(t('propertyExistError'))
            }
        }

        fetchListing()
    }, [params.listingId, navigate])

    // Sets userRef to logged in user
    useEffect(() => {
        if (isMounted){
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate('/sign-in')
                }
            })
        }

        return () => {
            isMounted.current = false
        }
        // esling-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const onSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        
        if(discountedPrice >= regularPrice){
            setLoading(false)
            toast.error(t('discountError'))
            return
        }

        if(images.length > 6) {
            setLoading(false)
            toast.error(t('imagesError'))
            return
        }

        let geolocation = {}
        let location

        if(geolocationEnabled) {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDcN0zgRp10f2eY0_DpHpZPIz5PmVHXSvI`)

            const data = response.json()

            geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
            geolocation.lng = data.results[0]?.geometry.location.lng ?? 0

            location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0].formatted_address

            if(location === undefined || location.includes('undefined')){
                setLoading(false)
                toast.error(t('addressError'))
                return
            }

            // console.log(data)
        } else {
            geolocation.lat = latitude
            geolocation.lng = longitude
            location = address
        }

        // Store images in firebase
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`

                const storageRef = ref(storage, 'images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)

                uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                    }
                }, 
                (error) => {
                    reject(error)
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                    });
                }
                );
            })
        }

        const imageUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch(() => {
            setLoading(false)
            toast.error(t('imagesUploadError'))
            return
        })

        const formDataCopy = {
            ...formData,
            imageUrls,
            geolocation,
            timestamp: serverTimestamp()
        }

        delete formDataCopy.images
        delete formDataCopy.address
        location && (formDataCopy.location = location)
        !formDataCopy.offer && delete formDataCopy.discountedPrice

        // Update listing
        const docRef = doc(db, 'listings', params.listingId)
        await updateDoc(docRef, formDataCopy)
        setLoading(false)

        toast.success('Listing saved')
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)
    }

    const onMutate = (e) => {
        let boolean = null

        if(e.target.value === 'true') {
            boolean = true
        } 
        if(e.target.value === 'false') {
            boolean = false
        }

        // Files
        if(e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files
            }))
        }

        if(!e.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value
            }))
        }




        // Text/Booleans/Numbers
    }

    if(loading) {
        return <Spinner />
    }

    return (
        <div className='profile'>
          <header>
            <p className='pageHeader'>{t('editListing')}</p>
          </header>
    
          <main>
            <form onSubmit={onSubmit}>
              <label className='formLabel'>{t('sellOrRentCreate')}</label>
              <div className='formButtons'>
                <button
                  type='button'
                  className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                  id='type'
                  value='sale'
                  onClick={onMutate}
                >
                  {t('sell')}
                </button>
                <button
                  type='button'
                  className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                  id='type'
                  value='rent'
                  onClick={onMutate}
                >
                  {t('rent')}
                </button>
              </div>
    
              <label className='formLabel'>{t('name')}</label>
              <input
                className='formInputName'
                type='text'
                id='name'
                value={name}
                onChange={onMutate}
                maxLength='32'
                minLength='10'
                required
              />
    
              <div className='formRooms flex'>
                <div>
                  <label className='formLabel'>{t('bedrooms')}</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='bedrooms'
                    value={bedrooms}
                    onChange={onMutate}
                    min='1'
                    max='50'
                    required
                  />
                </div>
                <div>
                  <label className='formLabel'>{t('bathrooms')}</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='bathrooms'
                    value={bathrooms}
                    onChange={onMutate}
                    min='1'
                    max='50'
                    required
                  />
                </div>
              </div>
    
              <label className='formLabel'>{t('parkingSpot')}</label>
              <div className='formButtons'>
                <button
                  className={parking ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='parking'
                  value={true}
                  onClick={onMutate}
                  min='1'
                  max='50'
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !parking && parking !== null ? 'formButtonActive' : 'formButton'
                  }
                  type='button'
                  id='parking'
                  value={false}
                  onClick={onMutate}
                >
                  {t('no')}
                </button>
              </div>
    
              <label className='formLabel'>{t('furnished')}</label>
              <div className='formButtons'>
                <button
                  className={furnished ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='furnished'
                  value={true}
                  onClick={onMutate}
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !furnished && furnished !== null
                      ? 'formButtonActive'
                      : 'formButton'
                  }
                  type='button'
                  id='furnished'
                  value={false}
                  onClick={onMutate}
                >
                  {t('no')}
                </button>
              </div>
    
              <label className='formLabel'>{t('address')}</label>
              <textarea
                className='formInputAddress'
                type='text'
                id='address'
                value={address}
                onChange={onMutate}
                required
              />
    
              {!geolocationEnabled && (
                <div className='formLatLng flex'>
                  <div>
                    <label className='formLabel'>Latitude</label>
                    <input
                      className='formInputSmall'
                      type='number'
                      id='latitude'
                      value={latitude}
                      onChange={onMutate}
                      required
                    />
                  </div>
                  <div>
                    <label className='formLabel'>Longitude</label>
                    <input
                      className='formInputSmall'
                      type='number'
                      id='longitude'
                      value={longitude}
                      onChange={onMutate}
                      required
                    />
                  </div>
                </div>
              )}
    
              <label className='formLabel'>{t('offer')}</label>
              <div className='formButtons'>
                <button
                  className={offer ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='offer'
                  value={true}
                  onClick={onMutate}
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !offer && offer !== null ? 'formButtonActive' : 'formButton'
                  }
                  type='button'
                  id='offer'
                  value={false}
                  onClick={onMutate}
                >
                  {t('no')}
                </button>
              </div>
    
              <label className='formLabel'>{t('regularPrice')}</label>
              <div className='formPriceDiv'>
                <input
                  className='formInputSmall'
                  type='number'
                  id='regularPrice'
                  value={regularPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required
                />
                {type === 'rent' && <p className='formPriceText'>€ / {t('month')}</p>}
              </div>
    
              {offer && (
                <>
                  <label className='formLabel'>{t('discountedPrice')}</label>
                  <input
                    className='formInputSmall'
                    type='number'
                    id='discountedPrice'
                    value={discountedPrice}
                    onChange={onMutate}
                    min='50'
                    max='750000000'
                    required={offer}
                  />
                </>
              )}
    
              <label className='formLabel'>{t('images')}</label>
              <p className='imagesInfo'>
                {t('imageLabel')}
              </p>
              <input
                className='formInputFile'
                type='file'
                id='images'
                onChange={onMutate}
                max='6'
                accept='.jpg,.png,.jpeg'
                multiple
                required
              />
              <button type='submit' className='primaryButton createListingButton'>
                {t('saveListing')}
              </button>
            </form>
          </main>
        </div>
    )
}

export default EditListing