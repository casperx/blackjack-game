const CardSuits = [
  'Clubs',
  'Diamonds',
  'Hearts',
  'Spades',
]

const CardFaces = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',

  'Ace',
  'Jack',
  'King',
  'Queen',
]

const Card = (face, suit) => {
	return {
    get face() {
      return face
    }, 
    get suit() {
      return suit
    },
    toString() {
      return `${suit}:${face}`
    }
  }
}

const Deck = (n = 1) => {
  const cards = []
  // construct standard deck
  for (let i = 0; i < n; i += 1)
    for (const suit of CardSuits)
      for (const face of CardFaces) {
        const card = Card(face, suit)
        cards.push(card)
      }
  return {
    // number of cards remains in deck
    get remain() {
      return cards.length;
    },
    shuffle() {
      // traverse array linearly
      cards.forEach(
        (value, index) => {
          // pick random index
          const altIndex = Math.floor(Math.random() * cards.length)
          // swap value
          cards[index] = cards[altIndex]
          cards[altIndex] = value
        }
      )
    },
    draw(amount = 1) {
      return cards.splice(0, amount)
    }
  }
}

module.exports = {
  Card,
  Deck
}
