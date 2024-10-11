import React, { useState } from 'react'
import "../../Components/Homepage.css";
import QRCode from 'react-qr-code'
import createImg from '../../assets/create.svg'



const Services = () => {
    const [text, setText] = useState("")

   

    function generateQR(e){

      setText()
    }

    function handleChange(e){
      setText(e.target.value);
    };

    const download = () => {
      const svg = document.getElementById("QRCode");
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");

        //name of image
        downloadLink.download = "QR-Code";
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
      };
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };


  return (
    
    
      <section id="services">
          <div className="services-content">
            <div className="qr-card">
              <div className="left">
                <label htmlFor='qr-prompt'>Enter Text or URL</label>
              <input  maxLength="255" className='qr-prompt' placeholder='Start typing...' value={ text }  onChange={(e)=>{handleChange(e)}} />
              <div className="output-box">{!text && <p>QR Code shows here</p>}{text && <QRCode className='qr-output' value={text} id="QRCode" fgColor='#183d3d' ></QRCode> }</div>
      
              {text && <input id='cta-download' type="button" onClick={download} value="Download"></input> }
      
              </div>
              <div className="right">
                <img src={createImg}></img>
                <div className="right-text">
                <h1>Static QR Code Generation</h1>
                <p>Check out our static QR Code Generator, no registration required!</p>
                </div>
              </div>
            </div>
          </div>
      </section>
    
        
  )
}

export default Services