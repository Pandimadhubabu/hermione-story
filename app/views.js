var Controls, Current, Menu, Page, Preview,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Controls = function(target, click) {
  var $, _ref;
  if (click == null) {
    click = false;
  }
  _ref = [document.querySelector(target), this], this.element = _ref[0], $ = _ref[1];
  if (this.element == null) {
    return false;
  }
  this.tilt = function(direction) {
    if (direction == null) {
      direction = false;
    }
    return this.tile.setAttribute('class', 'controls-tile controls-tile-' + (direction ? 'right' : 'left'));
  };
  this.init = function() {
    this.element.innerHTML = "<div class=\"controls\">\n  <svg class=\"controls-left\" width=\"68px\" height=\"68px\" viewBox=\"0 0 68 68\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <circle fill=\"#000000\" cx=\"34\" cy=\"34\" r=\"34\"></circle>\n    <path d=\"M20.4345414,17.0146985 C20.5335111,17.0048995 20.6354204,17 20.7412494,17 L44.2930903,17 C46.3655739,17 48.0421788,18.6775848 48.0431587,20.7490886 C48.0421788,22.8176526 46.3636141,24.4962173 44.29603,24.4962173 L29.7964839,24.4962173 L49.9020246,44.5997983 C51.3659918,46.0647453 51.3659918,48.4390374 49.9020246,49.9020246 C48.4400173,51.3650119 46.0657252,51.3650119 44.6007782,49.9000648 L24.4962173,29.7964839 L24.4962173,44.29603 C24.4971972,46.364594 22.8176526,48.0441386 20.7471288,48.0451185 C18.6785647,48.0431587 17.0019598,46.3655739 17,44.2979898 L17.0009799,20.7500684 C17,20.6373802 17.0048995,20.5325312 17.0176382,20.428662 C17.019598,20.3845666 17.0254773,20.3404712 17.0303768,20.2973557 C17.0342964,20.2630593 17.0391959,20.2258232 17.0489949,20.1944665 C17.1607032,19.4281865 17.5085669,18.6913034 18.0974854,18.0984653 C18.6913034,17.5066071 19.4281865,17.1597233 20.1983861,17.0450753 C20.3257728,17.028417 20.3786872,17.0186181 20.4345414,17.0146985 Z\" fill=\"#FFFFFF\"></path>\n  </svg>\n  <svg class=\"controls-right\" width=\"68px\" height=\"68px\" viewBox=\"0 0 68 68\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <circle fill=\"#000000\" cx=\"34\" cy=\"34\" r=\"34\"></circle>\n    <path d=\"M20.4345414,17.0146985 C20.5335111,17.0048995 20.6354204,17 20.7412494,17 L44.2930903,17 C46.3655739,17 48.0421788,18.6775848 48.0431587,20.7490886 C48.0421788,22.8176526 46.3636141,24.4962173 44.29603,24.4962173 L29.7964839,24.4962173 L49.9020246,44.5997983 C51.3659918,46.0647453 51.3659918,48.4390374 49.9020246,49.9020246 C48.4400173,51.3650119 46.0657252,51.3650119 44.6007782,49.9000648 L24.4962173,29.7964839 L24.4962173,44.29603 C24.4971972,46.364594 22.8176526,48.0441386 20.7471288,48.0451185 C18.6785647,48.0431587 17.0019598,46.3655739 17,44.2979898 L17.0009799,20.7500684 C17,20.6373802 17.0048995,20.5325312 17.0176382,20.428662 C17.019598,20.3845666 17.0254773,20.3404712 17.0303768,20.2973557 C17.0342964,20.2630593 17.0391959,20.2258232 17.0489949,20.1944665 C17.1607032,19.4281865 17.5085669,18.6913034 18.0974854,18.0984653 C18.6913034,17.5066071 19.4281865,17.1597233 20.1983861,17.0450753 C20.3257728,17.028417 20.3786872,17.0186181 20.4345414,17.0146985 Z\" id=\"Path\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\" transform=\"translate(34.000000, 33.999510) scale(-1, 1) translate(-34.000000, -33.999510) \"></path>\n  </svg>\n  <svg class=\"controls-tile\" width=\"130px\" height=\"150px\" viewBox=\"0 0 260 300\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <polygon fill=\"#32394B\" points=\"130 0 259.903811 75 259.903811 225 130 300 0.0961894323 225 0.0961894323 75 \"></polygon>\n  </svg>\n</div>";
    this.tile = document.querySelector('.controls-tile');
    document.querySelector('.controls-left').addEventListener('click', function() {
      if (click.call != null) {
        return click(true);
      }
    });
    return document.querySelector('.controls-right').addEventListener('click', function() {
      if (click.call != null) {
        return click(false);
      }
    });
  };
  this.init();
  return this;
};

Preview = function(target) {
  var $, _ref;
  _ref = [document.querySelector(target), this], this.element = _ref[0], $ = _ref[1];
  if (this.element == null) {
    return false;
  }
  this.tpl = "<header class=\"preview-header\">\n  <small class=\"preview-context\">{{contextFull}}</small>\n  <h1 class=\"preview-title\">{{title}}</h1>\n  {{#date}}<time class=\"preview-date\" date=\"{{date}}\">{{dateFormat}}</time>{{/date}}\n  <span class=\"preview-icon\"><span class=\"icon-{{icon}}\"></span></span>\n</header>";
  this.init = function() {
    this.element.innerHTML = '<article class="preview"></article>';
    return this.box = this.element.querySelector('.preview');
  };
  this.show = function(data) {
    return requestAnimFrame(function() {
      $.element.className = 'preview-' + data.context;
      $.box.classList.add('preview-show');
      return $.box.innerHTML = Mustache.render($.tpl, extend(data, {
        icon: (data.text ? 'text' : data.video ? 'film' : 'idea')
      }));
    });
  };
  this.hide = function() {
    return requestAnimFrame(function() {
      return $.box.classList.remove('preview-show');
    });
  };
  this.open = function() {
    return this.box.classList.contains('preview-show');
  };
  this.init();
  return this;
};

Current = function(target, callback) {
  var $, _ref;
  if (callback == null) {
    callback = false;
  }
  _ref = [document.querySelector(target), callback, this], this.element = _ref[0], this.callback = _ref[1], $ = _ref[2];
  if (this.element == null) {
    return false;
  }
  this.tpl = "<article class=\"current-wrap\">\n  <h1 class=\"current-title{{^date}} current-title-style{{/date}}\">{{title}}</h1>\n  {{#date}}<time class=\"current-date\" date=\"{{date}}\">{{dateFormat}}</time>{{/date}}\n  <div class=\"current-excerpt\"><p>{{{excerpt}}}</p></div>\n  {{#text}}<label for=\"page-token\" class=\"current-btn js-open js-page\" title=\"touche ENTRÉE du clavier\">Consulter la fiche</label>{{/text}}\n  {{#more}}<label for=\"page-token\" class=\"current-btn js-page\" title=\"touche ENTRÉE du clavier\">Lire la suite</label>{{/more}}\n  {{#video}}<label for=\"page-token\" class=\"current-btn js-open js-page\" title=\"touche ENTRÉE du clavier\">Voir la vidéo</label>{{/video}}\n  {{#skip}}<button class=\"current-btn js-skip\" title=\"touche ENTRÉE du clavier\">Passer le tutoriel</label>{{/skip}}\n  {{#end}}<label for=\"menu-token\" class=\"current-btn\" title=\"touche ESPACE du clavier\">Ouvrir le tableau de bord</label>{{/end}}\n</article>";
  this.init = function() {
    this.element.innerHTML = "<section class=\"current\"></section><div class=\"current-bg\"></div>";
    return this.box = this.element.querySelector('.current');
  };
  this.update = function(data, skip) {
    if (skip == null) {
      skip = false;
    }
    return requestAnimFrame(function() {
      var btn;
      $.box.innerHTML = Mustache.render($.tpl, extend(data, {
        skip: skip.call != null,
        end: data.context === 'fin'
      }));
      if (btn = $.box.querySelector('.js-open')) {
        btn.addEventListener('click', function() {
          var _ref1;
          if (_ref1 = data.id, __indexOf.call(STATS.open, _ref1) < 0) {
            return STATS.open.push(data.id);
          }
        });
      }
      if (skip.call != null) {
        if (sessionStorage.skip) {
          skip();
        } else {
          $.box.querySelector('.js-skip').addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.skip = true;
            return skip();
          });
        }
      }
      if ($.callback.call != null) {
        return $.callback.call($, data);
      }
    });
  };
  this.isPage = function() {
    return this.box.querySelector('.js-page') != null;
  };
  this.init();
  return this;
};

Page = function(target, token) {
  var $, _ref;
  _ref = [document.querySelector(target), document.querySelector(token), false, this], this.element = _ref[0], this.token = _ref[1], this.id = _ref[2], $ = _ref[3];
  if (this.element == null) {
    return false;
  }
  this.tpl = "<label for=\"page-token\" class=\"page-exit\" title=\"touche ECHAP du clavier\"></label>\n<article class=\"page-wrap{{#image}} page-full{{/image}}\">\n  <div class=\"page-content\">\n    <div class=\"page-content-wrap\">\n      {{#video}}\n      <div class=\"page-video\">\n        <iframe class=\"page-video-frame\" src=\"https://player.vimeo.com/video/{{video}}\" width=\"500\" height=\"281\" frameborder=\"0\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n      </div>\n      {{/video}}\n      <header class=\"page-header\">\n        <h1 class=\"page-title{{^date}} page-title-style{{/date}}\">{{title}}</h1>\n        {{#date}}<time class=\"page-date\" date=\"{{date}}\">{{dateFormat}}</time>{{/date}}\n        {{#text}}<div class=\"page-excerpt\">{{{excerptFull}}}</div>{{/text}}\n      </header>\n      {{#text}}\n      <a href=\"http://flottillenumerique.com\" target=\"_blank\" class=\"page-app\">\n        <img src=\"public/images/app.png\" width=\"64\" height=\"64\" class=\"page-app-img\">\n        <p class=\"page-app-text\">Plus d'informations à ce sujet sur l'application PC et tablettes <b>L'Hermione, la Traversée des Lumières</b>.\n        <br><small>Télécharger sur flottillenumerique.com</small></p>\n      </a>\n      {{/text}}\n      <div class=\"page-text\">{{#text}}{{{text}}}{{/text}}{{^text}}{{{excerptFull}}}{{/text}}</div>\n    </div>\n  </div>\n  {{#image}}\n  <aside class=\"page-cover\">\n    <figure class=\"page-cover-img\" style=\"background-image:url({{image}})\"></figure>\n  </aside>\n  {{/image}}\n</article>\n<footer class=\"page-context\">{{contextFull}}</footer>";
  this.init = function() {
    this.element.innerHTML = "<section class=\"page\"></section>";
    return this.box = this.element.querySelector('.page');
  };
  this.update = function(data) {
    return requestAnimFrame(function() {
      $.box.dataset.id = data.id;
      if (data.text || data.video) {
        $.box.dataset.open = true;
      }
      $.box.className = 'page page-' + data.context;
      return $.box.innerHTML = Mustache.render($.tpl, data);
    });
  };
  this.open = function() {
    var id;
    this.token.checked = true;
    id = parseInt($.box.dataset.id);
    if (__indexOf.call(STATS.open, id) < 0 && $.box.dataset.open) {
      return STATS.open.push(id);
    }
  };
  this.close = function() {
    return this.token.checked = false;
  };
  this.isOpen = function() {
    return this.token.checked;
  };
  this.init();
  return this;
};

Menu = function(target, token, data, callback) {
  var $, _ref;
  if (data == null) {
    data = [];
  }
  if (callback == null) {
    callback = false;
  }
  _ref = [
    data.sort(function(a, b) {
      return a.date.toString().localeCompare(b.date.toString());
    }), document.querySelector(target), document.querySelector(token), callback, this
  ], this.data = _ref[0], this.element = _ref[1], this.token = _ref[2], this.callback = _ref[3], $ = _ref[4];
  this.contexts = [];
  if (this.element == null) {
    return false;
  }
  this._tl = "<section class=\"tl\">\n  <div class=\"tl-wrap\">\n    {{#items}}\n    {{#card}}<label for=\"page-token\"{{/card}}{{^card}}<div{{/card}} class=\"tl-item tl-{{context}}{{#landmark}} tl-landmark{{/landmark}}{{#unlocked}} tl-unlocked{{/unlocked}}\" data-id=\"{{id}}\">\n      <span class=\"tl-item-title\">{{title}}</span>\n      <time class=\"tl-item-date{{^showDate}} tl-item-date-hide{{/showDate}}\" date=\"{{date}}\">{{dateFormat}}</time>\n    {{#card}}</label>{{/card}}{{^card}}</div>{{/card}}\n    {{/items}}\n  </div>\n</section>";
  this._stats = "<div class=\"stats\">\n  <section class=\"stats-numbers-wrap\">\n    {{#numbers}}\n    <article class=\"stats-numbers-item stats-numbers-{{key}}\">\n      <span class=\"stats-numbers-value\">{{value}}</span>\n      <span class=\"stats-numbers-label\">{{{label}}}</span>\n    </article>\n    {{/numbers}}\n  </section>\n  <section class=\"stats-contexts\">\n    {{#contexts}}\n    <article class=\"stats-context stats-context-{{key}}\" data-value=\"{{value}}/{{total}}\">\n      <div class=\"stats-context-progress\" style=\"width:{{progress}}%\"></div>\n      <div class=\"stats-context-label\">{{name}}</div>\n    </article>\n    {{/contexts}}\n  </section>\n</div>";
  this._skip = "<label class=\"skip-btn\"><input type=\"checkbox\" id=\"skip-token\"{{#skip}} checked=\"true\"{{/skip}}> Passer automatiquement le tutoriel au lancement.</label>";
  this.init = function() {
    var c, contexts, item, _i, _j, _len, _len1, _ref1, _ref2, _ref3;
    this.element.innerHTML = "<label for=\"menu-token\" class=\"menu-exit\" title=\"touche ECHAP du clavier\"></label>\n<section class=\"menu\">\n  <label for=\"menu-token\" class=\"menu-count\" title=\"touche ESPACE du clavier\"></label>\n  <div class=\"menu-wrap\">\n    <div class=\"menu-layout\">\n      <section id=\"timeline\"></section>\n      <section class=\"info\">\n        <section id=\"stats\"></section>\n        <footer class=\"credits\">\n          <div id=\"skip\" class=\"skip\"></div>\n          <a href=\"http://flottillenumerique.com\" target=\"_blank\" class=\"credits-app\">\n            <img src=\"public/images/app.png\" width=\"64\" height=\"64\" class=\"credits-app-img\">\n            <p class=\"credits-app-text\">Retrouvez plus de contenus sur notre application ludo-éducative PC et tablettes <b>L'Hermione, la Traversée des Lumières</b>.\n            <br><small>Télécharger sur www.flottillenumerique.com</small></p>\n          </a>\n          <p class=\"credits-copyright\">\n            © 2015 <a href=\"http://www.flottillenumerique.com\" target=\"_blank\">La Flottille Numérique</a> —\n            <a href=\"mailto:contact@hermione-story.com\">contact@hermione-story.com</a>\n          </p>\n        </footer>\n      </section>\n    </div>\n  </div>\n</section>\n<div class=\"menu-bg\"></div>";
    this.box = this.element.querySelector('.menu-wrap');
    this.count = this.element.querySelector('.menu-count');
    contexts = [];
    _ref1 = this.data;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      if (_ref2 = item.context, __indexOf.call(contexts.map(function(a) {
        return a.k;
      }), _ref2) < 0) {
        contexts.push({
          k: item.context,
          v: item.contextFull
        });
      }
    }
    contexts.sort(function(a, b) {
      return a.v.localeCompare(b.v);
    });
    for (_j = 0, _len1 = contexts.length; _j < _len1; _j++) {
      c = contexts[_j];
      if ((_ref3 = c.k) !== 'repere' && _ref3 !== 'fin') {
        this.contexts.push({
          key: c.k,
          name: c.v,
          total: $.data.filter(function(a) {
            return a.context === c.k;
          }).length,
          value: 0
        });
      }
    }
    this.count.addEventListener('click', this.load);
    return this.update();
  };
  this.update = function(id) {
    return requestAnimFrame(function() {
      var item, _i, _len, _ref1;
      if (id) {
        _ref1 = $.data;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          item = _ref1[_i];
          if (item.id === id) {
            item.unlocked = true;
          }
        }
      }
      return $.count.dataset.count = STATS.markers.length;
    });
  };
  this.open = function() {
    return this.load(function() {
      return this.token.checked = true;
    });
  };
  this.close = function() {
    return this.token.checked = false;
  };
  this.isOpen = function() {
    return this.token.checked;
  };
  this.load = function(callback) {
    if (callback == null) {
      callback = false;
    }
    return requestAnimFrame(function() {
      var btn, c, item, lastDate, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2;
      $.box.querySelector('#skip').innerHTML = Mustache.render($._skip, {
        skip: sessionStorage.skip
      });
      $.box.querySelector('#skip-token').addEventListener('click', function(e) {
        if (sessionStorage.skip) {
          return delete sessionStorage.skip;
        } else {
          return sessionStorage.skip = true;
        }
      });
      data = $.data.filter(function(a) {
        return a.context !== 'tutoriel' && a.date !== false;
      });
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        item = data[_i];
        item.card = item.ref && item.unlocked;
        item.showDate = item.date !== lastDate;
        lastDate = item.date;
      }
      $.box.querySelector('#timeline').innerHTML = Mustache.render($._tl, {
        items: data
      });
      _ref1 = $.box.querySelectorAll('label.tl-item');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        btn = _ref1[_j];
        btn.addEventListener('click', function(e) {
          var id;
          e.preventDefault();
          id = parseInt(this.dataset.id);
          item = $.data.filter(function(a) {
            return a.id === id;
          })[0];
          console.log(id, item, $.data);
          if (($.callback.call != null) && (item != null) && item.ref) {
            $.callback.call($, item);
          }
          return timeout(100, function() {
            return document.querySelector('#page-token').checked = true;
          });
        });
      }
      _ref2 = $.contexts;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        c = _ref2[_k];
        c.value = $.data.filter(function(a) {
          return a.context === c.key && a.unlocked;
        }).length;
        c.progress = c.value / c.total * 100;
      }
      $.box.querySelector('#stats').innerHTML = Mustache.render($._stats, {
        contexts: $.contexts,
        numbers: [
          {
            key: 'days',
            value: STATS.days,
            label: (STATS.days > 1 ? 'Jours' : 'Jour') + '<br>en mer'
          }, {
            key: 'markers',
            value: STATS.markers.length,
            label: (STATS.markers.length > 1 ? 'Balises<br>franchies' : 'Balise<br>franchie')
          }, {
            key: 'open',
            value: STATS.open.length,
            label: (STATS.open.length > 1 ? 'Escales' : 'Escale')
          }
        ]
      });
      if (callback.call != null) {
        return callback.call($);
      }
    });
  };
  this.init();
  return this;
};
