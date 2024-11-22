import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function ListingItem({listing, id, onDelete, onEdit}) {
    const {t} = useTranslation()
  return (
    <li className="categoryListing">
        <Link to={`/category/${listing.type}/${id}`} className='categoryListingLink'>
            <img src={listing.imageUrls[0]} alt={listing.name} className='categoryListingImg' />
            <div className="categoryListingDetails">
                <p className="categoryListingLocation">
                    {listing.location}
                </p>
                <p className="categoryListingName">
                    {listing.name}
                </p>
                <p className="categoryListingPrice">
                    {listing.offer ? listing.discountedPrice : listing.regularPrice}€
                    {listing.type === 'rent' && ' / ' + t('month')}
                </p>
                <div className="categoryListingInfoDiv">
                    <img src={bedIcon} alt="bed" />
                    <p className="categoryListingInfoText">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} ${t('bedrooms')}` : `${listing.bedrooms} ${t('bedroom')}`}
                    </p>
                    <img src={bathtubIcon} alt="bath" />
                    <p className="categoryListingInfoText">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} ${t('bathrooms')}` : `${listing.bedrooms} ${t('bathroom')}`}
                    </p>
                </div>
            </div>
        </Link>
        {onDelete && (
            <DeleteIcon 
            className='removeIcon' 
            fill='rgb(231, 76, 60)' 
            onClick={() => onDelete(listing.id, listing.name)}
            />
        )}
        {onEdit && <EditIcon
        className='editIcon'
        onClick={() => onEdit(id)}
        />}
    </li>
  )
}

export default ListingItem