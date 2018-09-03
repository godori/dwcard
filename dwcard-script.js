
$(document).ready(function () {
  console.log('>>> dw card script init');
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
    game.createCardHtml('opponent','death',game.opponentHandCards);

    game.shuffle(game.playerHandCards);
    game.createCardHtml('player','tribe',game.playerHandCards);
    
    // event handler
    $('.card').on('click', (e) => {
      game.moveCard(e.currentTarget);
      game.setRoundScore();
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
    // [button]
    $('.menuBtn').on('click', (e) => {
      if(confirm('게임을 종료하고 메뉴로 돌아가시겠습니까?')){
        location.href = '/';
      }
    })
  },
  setRoundScore: () => {
    game._calculateScore('player');
    // game._calculateScore('opponent');
  },
  _calculateScore: (owner) => {
    console.log('>>> calculate score after action');
    var cards = $('.'+owner+'-area .card-play .card');
    var sum = 0;
    $.each(cards, function(i,card) {
        const point = $(card).data('point');
        if(point && point > 0){
          sum += point;
        }
        console.log(sum);
    });

    $('.'+owner+'-board .set-score').text(sum);

    
  },
  faction : {
    init : () => {
      game.faction.setOpponent()
      // game.faction.setPlayer()
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
  createCardHtml: (owner,faction, cards) => {
    console.log('>>> create card html');

    $.each(cards, (idx, cardId) => {
      var $card = $('<div class="card"></div>');
      $card.addClass(owner + '-faction');
      $card.data('faction',faction);
      $card.data('cardId', cardId);

      // 카드 위치별 close/open
      (owner === 'opponent') ? $card.data('isOpen', false) : $card.data('isOpen',true);

      game._setCardInfo($card);
      game._setCardImage($card)
      
      // card-line에 배치
      $('.' + owner + '-area .card-hand').append($card);  
    });
  },
  _setCardInfo: ($card) => {
    if(!$card.data('isOpen'))
      return;

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
    
    // set card border by tier
    (tier === 'gold') ? $card.addClass('tier-gold') : $card.addClass('tier-normal')
  },
  _setCardImage: (card) => {
    const cardImg = 'img/card/min/' + card.data('cardId') + '.png';
    const coverImg = 'img/faction-cover/min/' + card.data('faction') + '-faction.png';
    const imgUrl = (card.data('isOpen')) ? cardImg : coverImg;

    card.css({
      "background": "url(" + imgUrl + ")",
      "background-size": "100% 100%",
    });
  }
}
