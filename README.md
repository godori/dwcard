## Information
This is simple card game as a side project of [Deer.White](https://www.instagram.com/project_deerwhite)

[Demo](https://godori.github.io/dwcard/gwent.html)


## How to Start
 ```python3 -m http.server [port-num-to-use]```
 
## Rules
1. Deck building
- Single Deck include 10 cards
- For Normal tier cards, a maximum of three copies of a card
- For Gold tier cards, deck has only one card

2. Card Play
- Best 2 out of 3
- At the start of a match, each player draws 5 cards from their deck
- Round 1, player can swap 2 cards
- Round 2 and 3, each player draws 1 card from the deck
- Each turns, player can play one card or pass the turn
- If all player passed the turn or there is no card to play, round finish

 ---
 
## TDL

__Common__
- [x] card rule
- [ ] write korean readme
- [ ] card description (drobox paper)

__Card Play__
- [x] load card data from json
- [x] set card images
- [x] select factions
- [x] game board layout
- [x] display card details
- [x] card picking animation
- [ ] calculate card points
- [ ] draw card
- [ ] pass turn
- [ ] displaying round status
- [ ] card drag & drop
- [ ] load decks from the Deck Builder

__Deck Buildig__
- [x] done
- [ ] to do

---
## License
Except codes, other resources cannot be modified or used for any reasons.

© 2018 Team Deer.White All Rights Reserved.
