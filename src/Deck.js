import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import Card from './Card'

const Deck = () => {
    const INITIAL_STATE = []
    const [cards, setCards] = useState(INITIAL_STATE);
    const [deckID, setDeckID] = useState(null)
    const [remainingCards, setRemainingCards] = useState(52)
    const [startDeal, setStartDeal] = useState(false);
    
    // store our persistent info that won't change on renders
    const intervalID = useRef();

    const handleClick = (e) => {
        if (!startDeal) {
            // set the intervalID state.  make sure to the return the set interval function
            intervalID.current = setInterval(async () => {
                const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
                const { remaining } = res.data
                const { code, image, value, suit } = res.data.cards[0]
                const rotate = Math.floor(Math.random() * 21 - 10);
                setCards(data => [...data, { code, image, value, suit, rotate: rotate+"deg" }])
                setRemainingCards(remaining)    
            }, 1000)
        } else {
            clearInterval(intervalID.current)
        }

        // set startDeal state to true or false depending on what the current val is
        setStartDeal(!startDeal)
    }

    // run shuffle deck only once, on load!
    useEffect(() => {
        async function shuffleDeck() {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
            setDeckID(res.data.deck_id)
        };
        shuffleDeck();
    }, [])


    let msg;

    if (deckID) {
        if (remainingCards === 0) { 
            clearInterval(intervalID.current)
            msg = <p>Error: no cards remaining!</p>
        } else { 
            msg = <button onClick={handleClick}>Start/Stop Drawing</button> 
        } 
    } else {
        msg = <p>Loading...</p>
    }

    return (
        <div className="Deck">
            {msg}
            {cards.map(card => <Card key={card.code} suit={card.suit} value={card.value} image={card.image} rotate={card.rotate}/>)}
        </div>
    )
}

export default Deck;