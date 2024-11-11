import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='header-container'>
     
        <ul>
         <li> <Link>Home</Link> </li>
          <Link>About</Link>
          <Link>Project</Link>
          <Link>Contact</Link>

        </ul>

    </div>
  )
}
