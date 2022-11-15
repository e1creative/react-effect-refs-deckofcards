import React, { useState, useEffect} from 'react';
import axios from 'axios';

import Card from './Card'

const Deck = () => {
    const INITIAL_STATE = []
    const [cards, setCards] = useState(INITIAL_STATE);
    const [deckID, setDeckID] = useState("");
    const [remainingCards, setRemainingCards] = useState(52)
    const [intervalID, setIntervalID] = useState();

    const handleClick = (e) => {
        if (intervalID) {
            clearInterval(intervalID)
        } else {
            // change our button text
            e.target.innerText = "Stop Drawing"

            // set the intervalID state.  make sure to the return the set interval function
            setIntervalID(() => {
                return setInterval(async () => {
                    const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`);
                    const { remaining } = res.data
                    const { code, image, value, suit } = res.data.cards[0]
                    const rotate = Math.floor(Math.random() * 15 - 10);
                    setCards(data => [...data, { code, image, value, suit, rotate: rotate+"deg" }])
                    setRemainingCards(remaining)    
                }, 1000)
            });
        }
        console.log(intervalID);
    }

    // run shuffle deck only once, on load!  since we only run once, we need to store the deck id in state!
    // we can then use the deckID (state) to make our draw card axios call
    useEffect(() => {
        async function shuffleDeck() {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`);
            const deck_id = res.data.deck_id
            setDeckID(deck_id)
        };
        shuffleDeck();
    }, [])



    let msg;
    if (deckID && remainingCards !== 0) { 
        msg = <button onClick={handleClick}>Start Drawing</button>
    } else if (deckID && remainingCards === 0) {
        clearInterval(intervalID)
        msg = <p>Error: no cards remaining!</p>
    } else {
        msg = <p>Loading...</p>
    };

    return (
        <div className="Deck">
            {msg}
            {cards.map(card => <Card key={card.code} suit={card.suit} value={card.value} image={card.image} rotate={card.rotate}/>)}
        </div>
    )
}

export default Deck;