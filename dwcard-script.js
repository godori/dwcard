var cardInfoList = {};
var addCardInfo = function (id, point, tier, name, desc) {
  cardInfoList[id] = { id: id, point: point, tier: tier, name: name, desc: desc };
};
addCardInfo(1, 3, 'gold', '다이나', '마을 최고의 샤먼. 화이트의 엄마');
addCardInfo(2, 3, 'gold', '화이트', '주인공');
addCardInfo(3, 2, 'silver', '소년', '어리다');
addCardInfo(4, 2, 'silver', '3번', '설명');
addCardInfo(5, 1, 'bronze', '여우', '파이어폭스');

$(document).ready(function () {
  console.log('dw card script init');


  $('.card .point').hide();
  $('.card .desc').hide();
  $('.game-board .card').hover(function () {
    if ($(this).hasClass('close')) {
      return;
    }
    var idx = $(this).data('cardValue');
    console.log(cardInfoList[idx]);
    var cardInfo = cardInfoList[idx];
    var descdiv = $(this).children('.desc');

    descdiv.html('<strong>' + cardInfo.name + '</strong><br>' + cardInfo.desc + '<br>포인트 : ' + cardInfo.point);
    $(this).children('.desc').show();
  }, function () {
    $(this).children('.desc').hide();
  });

  game.init();
});

_loadJsonData = () => {
  return new Promise(function (resolve, reject) {
    var json = $.getJSON('dwcard-data.json', () => {
    }).done(() => {
      resolve(json)
    })
      .fail(() => {
        reject('fail to load json')
      })
  })
}

var game = {
  cardData: [],
  opponent: {
    hand: [1, 2, 3, 4],
    play: [5]
  },
  opponentHandCards: [1, 2, 3, 4, 5],
  opponentPlayCards: [],
  playerHandCards: [1, 2, 3, 4, 5],
  playerPlayCards: [],
  init: () => {
    _loadJsonData().then((res) => {
      console.log('success!');
      game.cardData = res
      game.initGame()
    },
      (err) => {
        console.log(err);
      })
  },
  initGame: () => {

    console.log(game.cardData);

    game.shuffle(game.opponentHandCards);
    game.assignCard('opponent', game.opponentHandCards);

    game.shuffle(game.playerHandCards);
    game.assignCard('player', game.playerHandCards);
  },
  showFactionDesc: (target) => {
    $(target).hover(() => {
      var faction = $(target).data('factionValue')

      $('.select-faction-layer .desc').text(faction)

    })
    $(target).click(() => {
      console.log('select faction:');

      game.selectFaction()
    })

  },
  selectFaction: () => {
    $('.select-faction-layer').on('click', () => {
      $('.select-faction-layer').fadeOut('fast');
    });
  },
  shuffle: function (cards) {
    var random = 0;
    var temp = 1;
    for (i = 1; i < cards.length; i++) {
      random = Math.round(Math.random() * i);
      temp = cards[i];
      cards[i] = cards[random];
      cards[random] = temp;
    }
  },
  assignCard: (owner, cards) => {
    $('.' + owner + '-area .card').each(function (index) {
      $(this).attr('data-card-value', cards[index])

      if (owner === 'player' || $(this).closest('.card-line').hasClass('card-play')) {
        game.setCardImage($(this))
      }
    })

    game.moveCardHandlers();
  },
  flipCard: () => {

  },
  moveCardHandlers: function () {
    $('.card').on('click', function () {

    });
  },
  setCardImage: (card) => {
    var cardValue = card.data('cardValue');
    var imgUrl = 'img/card/' + cardValue + '.png';
    card.css({
      "background": "url(" + imgUrl + ")",
      "background-size": "100% 100%",
    }).addClass('selected');

    var cardInfo = cardInfoList[cardValue];
    var pointLabel = card.children('.point');
    pointLabel.text(cardInfo.point);
    pointLabel.show();
    if (cardInfo.tier == 'gold') {
      card.addClass('tier-gold');
    } else if (cardInfo.tier == 'silver') {
      card.addClass('tier-silver');
    } else {
      card.addClass('tier-bronze');
    }
  },
  checkWin: function () { // no use
    // console.log('checkwin');
    // if($('.unmatched').length === 0){
    //   $('.container').html('<h1>YOU WON!</h1>');
    // }
  }
}
