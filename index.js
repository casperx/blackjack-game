const readline = require('readline')

const readlineSync = () => {
  const rl = readline.createInterface(
    {
      input: process.stdin,
      output: process.stdout
    }
  )

  return {
    read(prom) {
      return new Promise(
        (res) => rl.question(prom, res)
      )
    },

    close() {
      rl.close()
    }
  }
}

const BlackjackValues = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,

  'Jack': 10,
  'King': 10,
  'Queen': 10,
  
  // Ace: 1 |  11
}

const BlackjackSum = (cards) => {
  let sum = 0
  let ace = 0

  for (const {face} of cards) {
    if (face === 'Ace') {
      sum += 11
      ace += 1
    } else {
      sum += BlackjackValues[face]
    }
  }

  while (sum > 21 && ace > 0) {
    sum -= 10
    ace -= 1
  }

  return sum
}

const {Deck} = require('./card')

const main = async () => {
  const lineReader = readlineSync()

  // game loop
  for (;;) {
    let gameUndetermine = true

    // get new deck and shuffle deck
    const deck = Deck(4)
    deck.shuffle()

    // draw 2 cards for dealer and player
    const dealerCards = deck.draw(2)
    const playerCards = deck.draw(2)

    // show first card in dealer's hand
    const [dealerFirstCard] = dealerCards
    console.log(`First card in dealer hand is ${dealerFirstCard}`)

    let playerSum
    let dealerSum

    for (;;) {
      // show card in player hand
      const playerCardsText = playerCards.join(', ')
      console.log(`Cards in your hand are ${playerCardsText}`)

      // calculate value of player
      playerSum = BlackjackSum(playerCards)
      dealerSum = BlackjackSum(dealerCards)

      // evaluate result
      if (playerSum > 21) {
        console.log('You bust')

        // game result determined
        gameUndetermine = false
        break
      }
      if (playerSum === 21) {
        // blackjack!
        if (dealerSum === 21) {
          console.log('Tie')
        } else {
          console.log('You win')
        }

        // game result determined
        gameUndetermine = false
        break
      }

      // ask for action
      const choice = await lineReader.read('What do you do (hit, stand): ')

      if (choice === 'stand') break
      if (choice === 'hit') {
        const [card] = deck.draw()
        playerCards.push(card)
      }
    }

    if (gameUndetermine) {
      console.log('Dealer proceed')

      // dealer draw until sum equal to or more than 17
      while (dealerSum < 17) {
        const [card] = deck.draw()
        dealerCards.push(card)
        dealerSum = BlackjackSum(dealerCards)
      }

      // show card in dealer hand
      const dealerCardsText = dealerCards.join(', ')
      console.log(`Cards in dealer hand are ${dealerCardsText}`)

      // evaluate result
      if (dealerSum > 21) {
        console.log('Dealer bust')
        console.log('You win')
      } else if (dealerSum > playerSum) {
        console.log('Dealer win')
      } else if (dealerSum < playerSum) {
        console.log('You win')
      } else {
        console.log('Tie')
      }
    }

    const choice = await lineReader.read('Type yes to play again: ')
    if (choice !== 'yes') break
  }

  lineReader.close()
}

main()
