import React from 'react'
import "../../Components/Homepage.css";
import {Link} from "react-router-dom"
import github from "../../assets/github.svg"

const Footer = () => {
  return (
   

    
      <footer className='footer'>
        <div className="footer-content-container">
      <div className="left-section">
          <h1 className=''>QR-Me</h1>
          <p>QR-Me is a web based QR Code Generator made by a student for his Diploma work, <br></br> with all of the code available on GitHub! </p>
            <div className="icons">
          <Link to ="https://www.github.com/lyusko-uni/QR-Me" ><img src={github} /></Link>
          </div>
         
          </div>
      
          <div className="right-section">
            <h1>Contact Me</h1>
            <p>If you have any questions, feel free to ask me!</p>
            <form>
            <input placeholder='E-mail'></input>
            <input placeholder='Subject'></input>
            <textarea placeholder='Message'></textarea>
            <button>Submit</button>
            </form>
          </div>
          </div>
        <div className="copyright-bar">
         <p> Copyright &#169; 2024 QR-Me. All rights reserved.</p>
       </div>
      </footer>


  )
}

export default Footer