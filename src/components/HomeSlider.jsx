import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from './Spinner'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


function HomeSlider() {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
            const querySnap = await getDocs(q)
    
            let listings = []
    
            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
    
            console.log(listings)
            setListings(listings)
            setLoading(false)            
        }

        fetchListings()
    }, [])

    if(loading) {
        return(
            <Spinner />
        )
    }

    if(listings.length === 0){
        return <></>
    }

    return listings && (
        <>
            <p className="exploreHeading">{t('recommended')}</p>

            <Swiper className='homeSlider' modules={[Navigation, Pagination, Scrollbar, A11y]} slidesPerView={1} pagination={{clickable: true}}>
                {listings.map(({data, id}) => (
                    <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div style={{backgroundImage: `url(${data.imageUrls[0]})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center'}} className="swiperSlideDiv">
                            <p className="swiperSlideText">{data.name}</p>
                            <p className="swiperSlidePrice">
                                {data.discountedPrice ?? data.regularPrice}€
                                {data.type === 'rent' && '/ ' + t('month')}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
export default HomeSlider