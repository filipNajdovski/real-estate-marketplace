import React from 'react'
import { Link } from 'react-router-dom'
import {ReactComponent as DeleteIcon} from '../assets/svg/deleteIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function ListingItem({listing, id}) {
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
                    {listing.type === 'rent' && ' / Month'}
                </p>
                <div className="categoryListingInfoDiv">
                    <img src={bedIcon} alt="bed" />
                    <p className="categoryListingInfoText">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}
                    </p>
                    <img src={bathtubIcon} alt="bath" />
                    <p className="categoryListingInfoText">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bedrooms} bathroom`}
                    </p>
                </div>
            </div>
        </Link>
        <DeleteIcon 
        className='removeIcon' 
        fill='rgb(231, 76, 60)' 
        // onClick={() => onDelete(listing.id, listing.name)}
        />
    </li>
  )
}

export default ListingItem