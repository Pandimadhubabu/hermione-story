var STATS, init,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

STATS = {
  days: 0,
  markers: [],
  open: []
};

init = function(data) {
  var btn, controls, current, defaultHeight, grid, id, menu, page, preview, restart, scale, wrap;
  document.body.innerHTML += ((function() {
    var _i, _len, _ref, _results;
    _ref = ['page-token', 'menu-token'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      _results.push('<input type="checkbox" id="' + id + '">');
    }
    return _results;
  })()).join('');
  document.body.innerHTML += ((function() {
    var _i, _len, _ref, _results;
    _ref = ['grid', 'controls', 'current', 'preview', 'menu', 'page'];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      _results.push('<section id="' + id + '"></section>');
    }
    return _results;
  })()).join('');
  controls = new Controls('#controls', function(direction) {
    return requestAnimFrame(function() {
      return grid.progress(direction);
    });
  });
  page = new Page('#page', '#page-token');
  current = new Current('#current', function(item) {
    if (item.context === 'fin') {
      menu.load();
    }
    if (item.context !== 'fin' && (item.ref || item.more)) {
      return page.update(item);
    }
  });
  preview = new Preview('#preview');
  menu = new Menu('#menu', '#menu-token', data, function(item) {
    return page.update(item);
  });
  restart = document.querySelector('#restart');
  grid = new Grid('#grid', data.filter(function(a) {
    return a.context !== 'repere';
  }), {
    size: 100,
    before: 4,
    after: 8,
    distance: 2,
    space: 20,
    onChange: function(id, coord, direction, item, end) {
      return requestAnimFrame(function() {
        var _ref;
        controls.tilt(direction);
        if (item) {
          document.body.className = item.context;
          if (item.context !== 'tutoriel') {
            current.update(item);
          } else {
            current.update(item, function() {
              var _i, _len, _ref, _results;
              grid.skip();
              _results = [];
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                item = data[_i];
                if (!(item.context === 'tutoriel' && (_ref = item.id, __indexOf.call(STATS.markers, _ref) < 0))) {
                  continue;
                }
                STATS.markers.push(item.id);
                _results.push(item.unlocked = true);
              }
              return _results;
            });
          }
        }
        menu.update((item ? item.id : false));
        STATS.days = coord.q + 1;
        if (item && (_ref = item.id, __indexOf.call(STATS.markers, _ref) < 0) && !end) {
          STATS.markers.push(item.id);
        }
        if (end) {
          return restart.classList.add('restart-show');
        }
      });
    },
    onEnter: function(e, id, coord, item) {
      return requestAnimFrame(function() {
        if (item) {
          return preview.show(item);
        }
      });
    },
    onLeave: function(e, id, coord, item) {
      return requestAnimFrame(function() {
        if (preview.open()) {
          return preview.hide();
        }
      });
    },
    onMove: function(q) {
      if (restart.classList.contains('restart-show')) {
        return restart.classList.remove('restart-show');
      }
    },
    onSnap: function(q, end) {
      if (end && !restart.classList.contains('restart-show')) {
        return restart.classList.add('restart-show');
      }
    }
  });
  wrap = document.querySelector('.grid-wrap');
  defaultHeight = wrap.clientHeight;
  scale = function() {
    return wrap.style.webkitTransform = wrap.style.transform = (window.innerWidth < 1280 ? 'translateX(50px) ' : '') + 'scale(' + Math.max(.9, window.innerHeight * 3 / 5 / defaultHeight) + ')';
  };
  window.addEventListener('resize', function() {
    return requestAnimFrame(scale);
  });
  scale();
  window.addEventListener('keydown', function(e) {
    return requestAnimFrame(function() {
      var _ref, _ref1, _ref2;
      if ((_ref = e.which) === 38 || _ref === 40) {
        return grid.slide([true, false][[38, 40].indexOf(e.which)]);
      } else if ((_ref1 = e.which) === 37 || _ref1 === 39) {
        return grid.progress([true, false][[37, 39].indexOf(e.which)]);
      } else if (e.ctrlKey || e.altKey || e.metaKey) {
        return true;
      } else if (e.which === 13 && document.body.id !== 'loaded') {
        return document.body.id = 'loaded';
      } else if (((_ref2 = e.which) === 32 || _ref2 === 77 || _ref2 === 84) && !page.isOpen()) {
        if (menu.isOpen()) {
          return menu.close();
        } else {
          return menu.open();
        }
      } else if (e.which === 13 && current.isPage() && !menu.isOpen()) {
        if (page.isOpen()) {
          return page.close();
        } else {
          return page.open();
        }
      } else if (e.which === 27 && page.isOpen()) {
        return page.close();
      } else if (e.which === 27 && menu.isOpen()) {
        return menu.close();
      }
    });
  });
  window.progress();
  btn = document.querySelector('.preload-progress');
  btn.classList.add('preload-start');
  return btn.addEventListener('click', function() {
    return document.body.id = 'loaded';
  });
};

(function() {

  /*
  Sorry about this webkit-only thing…
  Firefox can't handle off-canvas transformed SVG elements with perspective and there is nothing I can do about it.
  I really tried IE (10+), but seems that it just couldn't try me back.
  Wait, what's Opera?
   */
  var img, k, load, ressources, sources, v, _ref;
  if ((_ref = head.browser.name) === 'ie' || _ref === 'ff' || _ref === 'opera') {
    return false;
  }
  sources = {
    libs: ['mustache', 'hammer'].map(function(a) {
      return 'assets/lib/' + a + '.min.js';
    }),
    scripts: ['helpers', 'grid', 'views'].map(function(a) {
      return 'app/' + a + '.js';
    }),
    css: ['app'].map(function(a) {
      return 'assets/css/' + a + '.css';
    })
  };
  ressources = ((function() {
    var _results;
    _results = [];
    for (k in sources) {
      v = sources[k];
      _results.push(v.join(','));
    }
    return _results;
  })()).join(',').split(',').reverse();
  window.progress = (function() {
    var bar, current, label, steps, wrap, _ref1, _ref2;
    _ref1 = ['.preload-progress', '.preload-progress-bar', '.preload-progress-label'].map(function(a) {
      return document.querySelector(a);
    }), wrap = _ref1[0], bar = _ref1[1], label = _ref1[2];
    _ref2 = [2 + ressources.length, 0], steps = _ref2[0], current = _ref2[1];
    return function() {
      current++;
      wrap.dataset.value = current + '/' + steps;
      bar.style.width = current / steps * 100 + '%';
      if (current === steps - 1) {
        return label.innerHTML = 'initialisation…';
      }
    };
  })();
  load = function(files, callback) {
    if (files.length === 0) {
      return callback();
    } else {
      head.load(files.slice(-1) + '?t=' + (new Date).getTime(), function() {
        return load(files.slice(0, -1), callback);
      });
      return progress();
    }
  };
  img = new Image();
  img.src = 'assets/images/background.jpg';
  return img.addEventListener('load', function() {
    progress();
    return load(ressources, function() {
      var get;
      get = new XMLHttpRequest();
      get.open('GET', 'http://data.hermione-story.com/data.json');
      get.onload = function() {
        if (get.status === 200) {
          return init(JSON.parse(get.responseText));
        }
      };
      return get.send();
    });
  });
})();
