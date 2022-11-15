import React from 'react';

import './Card.css'

const Card = ({image, code, value, suit, rotate}) => {
    
    return <div style={{ transform: `rotate(${rotate})` }} className="Card"><img src={image} alt={code} /></div>
}

export default Card;