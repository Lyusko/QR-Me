import React from 'react'
import "../../Components/Homepage.css";
import devimage from '../../assets/Header_right.svg'
import { Link as ScrollLink } from 'react-scroll';
const Header = () => {
  return (
   

      <section id="header">
      
                <div className="text-wrap">
                <h3>Hello,</h3>
          {/* <h1>I'm <span id="colored-h1">Lyudmil Borisov</span></h1>
              <p>I'm a student in The University of Angel Kanchev &
               this is my QR Code Generator <span id="underline-keyword">built with React </span>for my Diploma Work.
              </p> */}

              <h1>Welcome to <span id="colored-h1"> QR-Me</span></h1>
              <p>The Open Source Dynamic QR Code Generator <span id="underline-keyword">built with React</span> by a student for his diploma work.</p>
              <div className="cta-wrap">
               <ScrollLink to='about' spy={true} smooth={true} offset={0} duration = {500}><button>Learn More?</button></ScrollLink>
              </div>
                </div>
                {/* <div className="image-wrap"> */}
                  <img src={ devimage }></img>
                {/* </div> */}
      
      
               </section>

          
  )
}

export default Header