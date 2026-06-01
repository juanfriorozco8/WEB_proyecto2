# Not-Balatro

This is my small Balatro-style card game for Sistemas y Tecnologias Web. The player starts with an 8-card hand, plays poker combinations, tries to beat a growing target score, and picks jokers that change future scores.

## Run

```sh
npm install
npm run dev
```

## Test

```sh
npm test
```

For a quick logic-only check:

```sh
node scripts/logic-check.mjs
```

That script checks the 52-card deck, draw behavior, every poker hand, ace-low and ace-high straights, joker scoring order, target progression, and joker reward filtering.

## Core Rules

- Use a normal 52-card deck with A through K in four suits.
- Deal 8 cards to the player.
- Submitted cards score as high card, pair, two pair, three of a kind, straight, flush, full house, four of a kind, or straight flush.
- Score = combination base score + card values.
- Jokers apply in this order: fixed bonuses, conditional bonuses or multipliers, then final total multipliers.
- Ace works low in A-2-3-4-5 and high in 10-J-Q-K-A.
- Round 1 target is 100. Next target is previous target + 75 + round * 25.
- After a successful round, show up to two new joker options and do not offer jokers already owned.
- Failed attempts replace submitted cards from the deck. If there are not enough cards, the run ends.

# Video Link
https://youtu.be/t-v96e7wTx0