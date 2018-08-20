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
  console.log('>>> dw card script init');

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
        reject('>>> fail to load json')
      })
  })
}

var game = {
  factionData: [],
  cardData: [],
  opponent: {
    hand: [1, 2, 3, 4],
    play: [5]
  },
  factionList : ['white','boy','nature'],
  opponentHandCards: [1, 2, 3, 4, 5],
  opponentPlayCards: [],
  playerHandCards: [1, 2, 3, 4, 5],
  playerPlayCards: [6],
  init: () => {
    _loadJsonData().then((res) => {
      console.log('>>> card load success!');
      game.cardData = res[0].cardData
      game.factionData = res[0].factionData
      game.initGame()
    },
      (err) => {
        console.log('card load error :'+err);
      })
  },
  initGame: () => {
    // console.log(game.cardData);
    // console.log(game.factionData);
    
    game.faction.init()

    game.shuffle(game.opponentHandCards);
    game.assignCard('opponent', game.opponentHandCards);

    game.shuffle(game.playerHandCards);
    game.createCardHtml('player',game.playerHandCards);
    
    // event handler
    $('.card').on('click', (e) => {
      game.moveCard(e.currentTarget)
    })
    .on('mousemove', (e) => {
      var tooltip = $('.tooltip');
      var card = e.currentTarget;
      var cardImg = card.style.backgroundImage;
      
      for (var i=tooltip.length; i--;) {
        var desc = tooltip[i];
        
        desc.style.display = 'block';
        desc.style.left = e.pageX + 'px';
        desc.style.top = e.pageY + 'px';
  
        var dt = $(desc).find('.detail')[0];
        dt.style.backgroundImage = cardImg;
      }
    })
    .on('mouseleave', (e) => {
      var tooltip = $('.tooltip');
      for (var i=tooltip.length; i--;) {
        tooltip[i].style.display = 'none';
      }
    })
    
  },
  faction : {
    init : () => {
      game.faction.setOpponent()
      game.faction.setPlayer()
    },
    setOpponent: () => {
      var randNum = Math.round(Math.random() * 2);
      var imgUrl = 'img/faction-cover/min/'+game.factionList[randNum]+'-faction.png';
      $('#opponent .card-hand .card').css({
                                  "background": "url(" + imgUrl + ")",
                                  "background-size": "100% 100%"
                                })
      
    },
      
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
  moveCard: (target) => {
    var card = $(target);
    var playLine = $('.player-board .card-play');
    
    var oldOffset = card.offset();
    card.appendTo(playLine);
    var newOffset = card.offset(); 
    
    var temp = card.clone().appendTo('body');
    temp.css({
      'position': 'absolute',
      'left': oldOffset.left,
      'top': oldOffset.top,
      'z-index': 1000
    });
    card.hide();
    temp.animate({'top': newOffset.top, 'left': newOffset.left}, 'slow', function(){
      card.show();
      temp.remove();
   });

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
  // card 데이터를 html로 생성
  createCardHtml: (owner, cards) => {
    console.log('>>> create card html');
    
    $.each(cards, (idx, cardId) => {
      var $card = $('<div class="card"></div>');
      $card.addClass(owner + '-faction');
      $card.data('cardId', cardId);

      game._setCardInfo($card);

      // card-line에 배치
      $('.' + owner + '-area .card-hand').append($card);  
    });
  },
  _setCardInfo: ($card) => {
    const cardId = $card.data('cardId');
    const cardInfo = game.cardData[cardId-1];
    
    // set point info
    const point = cardInfo.point;
    $card.data('point',point);
    var $point = $('<div class="point"></div>');
    $point.text(point);
    $card.append($point);
    
    // set tier info
    const tier = cardInfo.tier;
    $card.data('tier',tier);
    (tier === 'gold') ? $card.addClass('tier-gold') : $card.addClass('tier-normal')

    game.setCardImage($card)
  },
  setCardImage: (card) => {
    const imgUrl = 'img/card/min/' + card.data('cardId') + '.png';
    card.css({
      "background": "url(" + imgUrl + ")",
      "background-size": "100% 100%",
    });
  }
}
