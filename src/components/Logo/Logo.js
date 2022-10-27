import React from 'react';
import Tilt from 'react-parallax-tilt';
import eye from './eye.png';
import './Logo.css'; 

const Logo=()=>{
    return(
        <div className='ma4 mt0'>
            <Tilt className='Tilt br2 shadow-2' style={{ height: '50'}}>
            <div className='Tilt-inner pa2' >
                <img  alt='logo' src={eye}/>
            </div>
            </Tilt>

        </div>
    );
    
}

export default Logo;