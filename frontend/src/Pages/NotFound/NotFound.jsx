import React from 'react'
import PageNotFoundPic from '../../assets/page-not-found.svg'
import { Link as RouterLink } from 'react-router-dom'

import '../NotFound/NotFound.css'

const NotFound = () => {
  return (
    <div className='container'>
            <div className="content-container">
                <div className="image-container">
                <img src= { PageNotFoundPic } className='pic'></img>
                </div>
                <div className="text-container">
                <h1 className='h1'><span id="colored-404">404</span> Not Found</h1>
    
                <p className='description'>Seems Like the page you're trying to access, doesn't exist!</p>
                <RouterLink to ="/" className='cta'>Go Back Home</RouterLink>
                </div>
            </div>
    </div>
  )
}

export default NotFound
