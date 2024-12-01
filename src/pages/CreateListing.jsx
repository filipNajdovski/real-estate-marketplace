import React, { useState, useEffect, useRef } from "react";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";

function CreateListing() {
  const [geolocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    propertyType: "apartment", // New field
    name: "",
    bedrooms: "1",
    bathrooms: "1",
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    yard: false,
    rooms: "0",
    squareMeters: "100",
    yardSquareMeters: "50",
    balcony: true,
    elevator: false,
    floorNumber: "1",
  });

  const {
    type,
    propertyType,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
    yard,
    rooms,
    squareMeters,
    yardSquareMeters,
    balcony,
    elevator,
    floorNumber,
  } = formData;

  const navigate = useNavigate();
  const auth = getAuth();
  const isMounted = useRef(true);
  const {t} = useTranslation()

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [isMounted, auth, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than regular price.");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images allowed.");
      return;
    }

    let geolocation = {};
    let location = address;

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (!location) {
        setLoading(false);
        toast.error("Invalid address.");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const storeImage = async (image) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedImage = await imageCompression(image, options);
      const storage = getStorage();
      const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedImage);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          reject,
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(resolve);
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Image upload failed.");
      return;
    });

    const formDataCopy = {
      ...formData,
      geolocation,
      location,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created successfully!");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;
    if (e.target.value === "true") boolean = true;
    if (e.target.value === "false") boolean = false;

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) return <Spinner />;

    return (
        <div className='profile'>
          <header>
            <p className='pageHeader'>{t('createTitle')}</p>
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

              <label className="formLabel">Property Type</label>
              <select
                id="propertyType"
                value={propertyType}
                onChange={onMutate}
                className="formInput"
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="businessPlace">Business Place</option>
                <option value="holidayHome">Holiday Home</option>
              </select>
    
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

              <label className="formLabel">Square Meters</label>
              <input
              className="formInputSmall"
                type="number"
                id="squareMeters"
                value={squareMeters}
                onChange={onMutate}
                required
              />

              <label className='formLabel'>{t('yard')}</label>
              <div className='formButtons'>
                <button
                  className={yard ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='yard'
                  value={true}
                  onClick={onMutate}
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !yard && yard !== null
                      ? 'formButtonActive'
                      : 'formButton'
                  }
                  type='button'
                  id='yard'
                  value={false}
                  onClick={onMutate}
                >
                  {t('no')}
                </button>
              </div>

              <label className="formLabel">Yard Square Meters</label>
              <input
                type="number"
                id="yardSquareMeters"
                className="formInputSmall"
                value={yardSquareMeters}
                onChange={onMutate}
                required
              />

              <div>
                <label className='formLabel'>{t('rooms')}</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='rooms'
                  value={rooms}
                  onChange={onMutate}
                  min='1'
                  max='50'
                  required
                />
              </div>
    
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

              <label className='formLabel'>{t('balcony')}</label>
              <div className='formButtons'>
                <button
                  className={balcony ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='balcony'
                  value={true}
                  onClick={onMutate}
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !balcony && balcony !== null
                      ? 'formButtonActive'
                      : 'formButton'
                  }
                  type='button'
                  id='yard'
                  value={false}
                  onClick={onMutate}
                >
                  {t('no')}
                </button>
              </div>

              <div>
                <label className='formLabel'>{t('floorNumber')}</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='floorNumber'
                  value={floorNumber}
                  onChange={onMutate}
                  min='0'
                  max='150'
                  required
                />
              </div>

              <label className='formLabel'>{t('elevator')}</label>
              <div className='formButtons'>
                <button
                  className={elevator ? 'formButtonActive' : 'formButton'}
                  type='button'
                  id='elevator'
                  value={true}
                  onClick={onMutate}
                >
                  {t('yes')}
                </button>
                <button
                  className={
                    !elevator && elevator !== null
                      ? 'formButtonActive'
                      : 'formButton'
                  }
                  type='button'
                  id='elevator'
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
                {t('createTitle')}
              </button>
            </form>
          </main>
        </div>
    )
}

export default CreateListing