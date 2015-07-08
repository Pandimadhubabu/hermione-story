var Grid,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Grid = function(target, data, params) {
  var $, i, item, _i, _len, _ref, _ref1, _ref2;
  if (data == null) {
    data = [];
  }
  if (params == null) {
    params = {};
  }
  _ref = [data, {}, document.querySelector(target), {}, [], this], this.data = _ref[0], this.lookup = _ref[1], this.element = _ref[2], this.tiles = _ref[3], this.cache = _ref[4], $ = _ref[5];
  _ref1 = [[], 0, 0, 0, 0, 0], this.path = _ref1[0], this.current = _ref1[1], this.q = _ref1[2], this.length = _ref1[3], this.w = _ref1[4], this.h = _ref1[5];
  if (this.element == null) {
    return false;
  }
  _ref2 = this.data;
  for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
    item = _ref2[i];
    this.lookup[item.id] = item;
  }
  this.options = extend({
    size: 30,
    distance: 2,
    before: 2,
    after: 2,
    space: 0,
    onMove: false,
    onSnap: false,
    onChange: false,
    onEnd: false,
    onEnter: false,
    onLeave: false
  }, params);
  this.init = function() {
    var center, mc, ref, wrap, _ref3, _ref4, _ref5;
    this.element.innerHTML = '<div class="grid-wrap"><div class="grid-box"></div></div>';
    wrap = this.element.querySelector('.grid-wrap');
    this.box = this.element.querySelector('.grid-box');
    this.generate();
    _ref3 = [this.options.size * 3 / 2, this.options.size * Math.sqrt(3)], this.w = _ref3[0], this.h = _ref3[1];
    _ref4 = [(this.w + this.options.space) * (this.length + 2), (this.h + this.options.space) * (this.options.distance * 2 + 3 / 2)], this.width = _ref4[0], this.height = _ref4[1];
    this.svg = element('svg', {
      "class": 'grid',
      width: this.width,
      height: this.height
    });
    this.box.appendChild(this.svg);
    this.svg.style.position = 'relative';
    (center = function() {
      return $.svg.style.top = (($.box.clientHeight || $.box.offsetHeight()) - $.height) / 2 + 'px';
    })();
    window.addEventListener('resize', function() {
      return requestAnimFrame(center);
    });
    this.setCurrent(this.find(0));
    _ref5 = [new Hammer(this.element.querySelector('.grid-wrap')), 0], mc = _ref5[0], ref = _ref5[1];
    mc.on('panstart', function(e) {
      ref = $.getPos($.q);
      if ($.options.onMove.call != null) {
        return $.options.onMove.call($, $.q);
      }
    });
    mc.on('pan', function(e) {
      return requestAnimFrame(function() {
        var pos;
        $.show($.getLine(pos = Math.min($.getPos(0), Math.max($.getPos($.length), ref - e.deltaY * 3))));
        if (e.isFinal) {
          $.snap(pos, $.getPos($.q));
        } else {
          $.move(pos);
        }
        if (e.isFinal && ($.options.onSnap.call != null)) {
          return $.options.onSnap.call($, $.q, $.q > $.length - 3 && $.current.q === $.length);
        }
      });
    });
    return mc.get('pan').set({
      direction: Hammer.DIRECTION_VERTICAL
    });
  };
  this.slide = function(d) {
    if (d == null) {
      d = true;
    }
    this.show(this.q + [1, -1][[true, false].indexOf(d)]);
    return this.move(this.getPos(this.q));
  };
  this.progress = function(d) {
    var k, n, q, _ref3;
    if (d == null) {
      d = true;
    }
    if (this.current.q >= this.length) {
      return;
    }
    _ref3 = [Math.min(this.current.q + 1, this.length - 1), this.next(this.current), [true, false].indexOf(d)], q = _ref3[0], n = _ref3[1], k = _ref3[2];
    if (n.length === 1) {
      k = 0;
    } else if ((n[k % 2] != null) && this.t(n[k % 2]) === false) {
      k++;
    }
    return this.setCurrent(this.next(this.current)[k % 2]);
  };
  this.setCurrent = function(c) {
    var direction, key, pos, _ref3, _ref4;
    _ref3 = [this.current.r + this.current.q % 2 <= c.r, this.getPos(this.current.q), c], direction = _ref3[0], pos = _ref3[1], this.current = _ref3[2];
    this.snap(pos, this.getPos(c.q));
    if (_ref4 = (key = this.tok(this.current)), __indexOf.call(this.path, _ref4) < 0) {
      this.path.push(key);
    }
    this.show(this.current.q);
    if (this.options.onChange.call != null) {
      return this.options.onChange.call($, this.t(c), c, direction, this.get(c), this.current.q === this.length);
    }
  };
  this.show = function(q) {
    var line, visible, _j, _k, _l, _len1, _len2, _len3, _m, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _results, _results1;
    q = Math.max(0, Math.min(this.length, q));
    _ref5 = [
      q, (function() {
        _results = [];
        for (var _j = _ref3 = Math.max(0, q - this.options.before), _ref4 = Math.min(q + this.options.after, this.length); _ref3 <= _ref4 ? _j <= _ref4 : _j >= _ref4; _ref3 <= _ref4 ? _j++ : _j--){ _results.push(_j); }
        return _results;
      }).apply(this)
    ], this.q = _ref5[0], visible = _ref5[1];
    for (_k = 0, _len1 = visible.length; _k < _len1; _k++) {
      i = visible[_k];
      if (document.getElementById('gl' + i) == null) {
        this.svg.appendChild(this.line(i));
      }
    }
    _ref6 = [].slice.call(this.svg.childNodes, 0);
    for (_l = 0, _len2 = _ref6.length; _l < _len2; _l++) {
      line = _ref6[_l];
      if (_ref7 = parseInt(line.id.slice(2)), __indexOf.call(visible, _ref7) < 0) {
        this.svg.removeChild(line);
      }
    }
    if (this.current.q >= visible[0]) {
      _ref8 = this.path.filter(function(k) {
        var _ref8;
        return _ref8 = $.toc(k).q, __indexOf.call(visible, _ref8) >= 0;
      }).map(function(k) {
        return $.svg.querySelector('#gt' + k);
      });
      _results1 = [];
      for (_m = 0, _len3 = _ref8.length; _m < _len3; _m++) {
        item = _ref8[_m];
        if (item.getAttribute('class').indexOf('tile-through') === -1) {
          item.setAttribute('class', item.getAttribute('class') + ' tile-through');
        }
        if (item.getAttribute('class').indexOf('tile-current') > -1) {
          item.setAttribute('class', item.getAttribute('class').replace('tile-current', ''));
        }
        if (item.id.slice(2) === this.tok(this.current)) {
          _results1.push(item.setAttribute('class', item.getAttribute('class') + ' tile-current'));
        } else {
          _results1.push(void 0);
        }
      }
      return _results1;
    }
  };
  this.getLine = function(pos) {
    return Math.floor(-pos / (this.w + this.options.space));
  };
  this.getPos = function(q) {
    return -q * (this.w + this.options.space);
  };
  this.snap = function(from, to) {
    target = to - from;
    return animate((function(t) {
      return $.move(from + target * t, t === 1);
    }), 300, function(t) {
      return (--t) * t * t + 1;
    });
  };
  this.move = function(pos) {
    return $.svg.style.webkitTransform = $.svg.style.transform = 'translateX(' + pos + 'px)';
  };
  this.skip = function() {
    var current, k, keys, v, _ref3, _ref4;
    _ref3 = [Object.keys(this.tiles), 0], keys = _ref3[0], i = _ref3[1];
    while (!current) {
      _ref4 = [keys[i], this.tiles[keys[i]], i + 1], k = _ref4[0], v = _ref4[1], i = _ref4[2];
      if (v !== false && __indexOf.call(this.path, k) < 0) {
        this.path.push(k);
      }
      if ((v !== (-1) && v !== false) && this.lookup[v].context !== 'tutoriel') {
        current = this.toc(k);
      }
    }
    return this.setCurrent(current);
  };
  this.line = function(q) {
    var line, r, _j, _ref3;
    if ((line = this.cache[q]) != null) {
      return line;
    }
    line = element('g', {
      "class": 'grid-line',
      id: 'gl' + q
    });
    for (r = _j = 0, _ref3 = this.options.distance * 2; 0 <= _ref3 ? _j <= _ref3 : _j >= _ref3; r = 0 <= _ref3 ? ++_j : --_j) {
      line.appendChild(this.tile(this.c(q, r)));
    }
    return line;
  };
  this.tile = function(c) {
    var cl, tile, x, y, _ref3;
    cl = this.t(c) === false ? 'tile-disabled' : this.get(c).checkpoint ? 'tile-checkpoint' : this.t(c) > -1 ? 'tile-item' : 'tile';
    if (this.get(c).context) {
      cl += ' tile-' + this.get(c).context;
    }
    _ref3 = [(c.q + 1) * this.w + c.q * this.options.space, this.height / 2 + (c.r - this.options.distance + (c.q % 2) / 2 - 1 / 4) * this.h + (c.r - this.options.distance + (c.q % 2) / 2) * this.options.space], x = _ref3[0], y = _ref3[1];
    tile = element('polygon', {
      id: 'gt' + this.tok(c),
      "class": cl,
      points: this.points({
        x: x,
        y: y
      })
    });
    tile.addEventListener('touchstart', function(e) {
      e.stopPropagation();
      e.preventDefault();
      if ($.double($.tok(c))($.goTo(c))) {

      } else {
        if ($.options.onEnter.call != null) {
          return $.options.onEnter.call($, e, $.t(c), c, $.get(c));
        }
      }
    });
    tile.addEventListener('click', function(e) {
      return $.goTo(c);
    });
    tile.addEventListener('mouseenter', function(e) {
      if ($.options.onEnter.call != null) {
        return $.options.onEnter.call($, e, $.t(c), c, $.get(c));
      }
    });
    tile.addEventListener('mouseleave', function(e) {
      if ($.options.onLeave.call != null) {
        return $.options.onLeave.call($, e, $.t(c), c, $.get(c));
      }
    });
    return tile;
  };
  this.goTo = function(c) {
    return requestAnimFrame(function() {
      var n;
      n = $.next($.current).filter(function(a) {
        return $.t(a) !== false && $["in"](a, $.current, c);
      });
      if (n.length) {
        $.setCurrent(shuffle(n)[0]);
      }
      if (!(n.length === 0 || $.current.q === c.q || $.t($.current) > -1)) {
        return timeout(150, arguments.callee);
      }
    });
  };
  this.double = function(k) {
    if (this.t(this.toc(k)) === -1 || this.doubleStore === k) {
      return true;
    }
    this.doubleStore = k;
    return false;
  };
  this.points = function(center) {
    return ((function() {
      var _j, _results;
      _results = [];
      for (i = _j = 0; _j <= 5; i = ++_j) {
        _results.push(this.corner(center, this.options.size, i).join(','));
      }
      return _results;
    }).call(this)).join(' ');
  };
  this.corner = function(center, size, i) {
    var rad;
    rad = Math.PI / 180 * (60 * i);
    return [center.x + size * Math.cos(rad), center.y + size * Math.sin(rad)];
  };
  this.c = function(q, r) {
    return {
      q: q,
      r: r
    };
  };
  this.t = function(c) {
    return this.tiles[this.tok(c)];
  };
  this.set = function(c, id) {
    if (id == null) {
      id = false;
    }
    return this.tiles[this.tok(c)] = id;
  };
  this.get = function(c) {
    if ((item = this.lookup[this.t(c)]) != null) {
      return item;
    } else {
      return false;
    }
  };
  this.tok = function(c) {
    return c.q + '-' + c.r;
  };
  this.toc = function(id) {
    var c;
    c = id.split('-').map(parseFloat);
    return this.c(c[0], c[1]);
  };
  this.find = function(q) {
    var r;
    return ((function() {
      var _j, _ref3, _ref4, _results;
      _results = [];
      for (r = _j = 0, _ref3 = this.options.distance * 2; 0 <= _ref3 ? _j <= _ref3 : _j >= _ref3; r = 0 <= _ref3 ? ++_j : --_j) {
        if ((_ref4 = this.t(this.c(q, r))) !== false && _ref4 !== (-1)) {
          _results.push(this.c(q, r));
        }
      }
      return _results;
    }).call(this))[0];
  };
  this.next = function(c, b) {
    if (b == null) {
      b = false;
    }
    return [-1, 0].map(function(r) {
      return $.c(c.q + (b ? -1 : 1), c.r + r + c.q % 2);
    }).filter(function(a) {
      var _j, _ref3, _ref4, _results;
      return _ref3 = a.r, __indexOf.call((function() {
        _results = [];
        for (var _j = 0, _ref4 = $.options.distance * 2; 0 <= _ref4 ? _j <= _ref4 : _j >= _ref4; 0 <= _ref4 ? _j++ : _j--){ _results.push(_j); }
        return _results;
      }).apply(this), _ref3) >= 0;
    });
  };
  this.cube = function(c) {
    var x, z, _ref3;
    _ref3 = [c.q, c.r - (c.q - (c.q & 1)) / 2], x = _ref3[0], z = _ref3[1];
    return {
      x: x,
      z: z,
      y: -x - z
    };
  };
  this["in"] = function(c, o, t) {
    var n, p, _j, _k, _l, _m, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results1, _results2, _results3;
    if (t.q < o.q) {
      _ref3 = [t, o], o = _ref3[0], t = _ref3[1];
    }
    _ref4 = [c, o, t].map(this.cube), i = _ref4[0], p = _ref4[1], n = _ref4[2];
    return n.y <= p.y && n.z <= p.z && (_ref5 = i.y, __indexOf.call((function() {
      _results = [];
      for (var _j = _ref6 = n.y, _ref7 = p.y; _ref6 <= _ref7 ? _j <= _ref7 : _j >= _ref7; _ref6 <= _ref7 ? _j++ : _j--){ _results.push(_j); }
      return _results;
    }).apply(this), _ref5) >= 0) && (_ref8 = i.z, __indexOf.call((function() {
      _results1 = [];
      for (var _k = _ref9 = n.z, _ref10 = p.z; _ref9 <= _ref10 ? _k <= _ref10 : _k >= _ref10; _ref9 <= _ref10 ? _k++ : _k--){ _results1.push(_k); }
      return _results1;
    }).apply(this), _ref8) >= 0) && (_ref11 = c.q, __indexOf.call((function() {
      _results2 = [];
      for (var _l = _ref12 = o.q, _ref13 = t.q; _ref12 <= _ref13 ? _l <= _ref13 : _l >= _ref13; _ref12 <= _ref13 ? _l++ : _l--){ _results2.push(_l); }
      return _results2;
    }).apply(this), _ref11) >= 0) && (_ref14 = c.r, __indexOf.call((function() {
      _results3 = [];
      for (var _m = 0, _ref15 = this.options.distance * 2; 0 <= _ref15 ? _m <= _ref15 : _m >= _ref15; 0 <= _ref15 ? _m++ : _m--){ _results3.push(_m); }
      return _results3;
    }).apply(this), _ref14) >= 0);
  };
  this.area = function(o, t) {
    var id, tile, _ref3, _ref4, _results;
    _ref3 = this.tiles;
    _results = [];
    for (id in _ref3) {
      tile = _ref3[id];
      if (this["in"](this.toc(id), o, t) && ((_ref4 = this.toc(id).q) !== o.q && _ref4 !== t.q)) {
        _results.push(this.toc(id));
      }
    }
    return _results;
  };
  this.draw = function(o, t) {
    var c, n, q, _j, _k, _l, _len1, _ref3, _ref4, _ref5, _ref6, _ref7, _results, _results1, _results2;
    c = o;
    _ref7 = (t.q < o.q ? (function() {
      _results1 = [];
      for (var _k = _ref3 = t.q, _ref4 = o.q - 2; _ref3 <= _ref4 ? _k <= _ref4 : _k >= _ref4; _ref3 <= _ref4 ? _k++ : _k--){ _results1.push(_k); }
      return _results1;
    }).apply(this) : (function() {
      _results2 = [];
      for (var _l = _ref5 = o.q, _ref6 = t.q - 2; _ref5 <= _ref6 ? _l <= _ref6 : _l >= _ref6; _ref5 <= _ref6 ? _l++ : _l--){ _results2.push(_l); }
      return _results2;
    }).apply(this));
    _results = [];
    for (_j = 0, _len1 = _ref7.length; _j < _len1; _j++) {
      q = _ref7[_j];
      _results.push((n = this.next(c, o.q > t.q).filter(function(a) {
        var _ref8;
        return $["in"](a, o, t) && ((_ref8 = $.t(a)) === false || _ref8 === (-1));
      })).length ? this.set((c = shuffle(n)[0]), -1) : void 0);
    }
    return _results;
  };
  this.dist = function(o, t) {
    var a, b, _ref3;
    _ref3 = [o, t].map(this.cube), a = _ref3[0], b = _ref3[1];
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)) / 2;
  };
  this.generate = function() {
    var area, avg, checkpoint, checkpoints, cp, current, end, event, events, index, items, j, matches, np, o, prev, q, r, start, step, steps, t, tile, _j, _k, _l, _len1, _len2, _len3, _len4, _len5, _m, _n, _o, _p, _q, _r, _ref10, _ref11, _ref12, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _results1, _results2, _results3, _s;
    steps = ((function() {
      var _j, _len1, _ref3, _results;
      _ref3 = this.data;
      _results = [];
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        item = _ref3[_j];
        _results.push(item.step);
      }
      return _results;
    }).call(this)).filter(function(v, i, a) {
      return a.indexOf(v) === i;
    }).sort(function(a, b) {
      if (a < b) {
        return -1;
      } else {
        return 1;
      }
    });
    _ref3 = [shuffle(this.data.slice(0)), []], data = _ref3[0], checkpoints = _ref3[1];
    for (i = _j = 0, _len1 = steps.length; _j < _len1; i = ++_j) {
      step = steps[i];
      items = data.filter(function(a) {
        return a.step === step;
      });
      _ref4 = [
        items.filter(function(a) {
          return a.checkpoint;
        }), items.filter(function(a) {
          return !a.checkpoint;
        })
      ], cp = _ref4[0], np = _ref4[1];
      avg = 4 + Math.ceil(Math.max(1, Math.floor(np.length * 2 / 3)) / cp.length) - 1;
      if (cp[0].context === 'tutoriel') {
        cp.sort(function(a, b) {
          if (a.id < b.id) {
            return -1;
          } else {
            return 1;
          }
        });
      }
      for (j = _k = 0, _len2 = cp.length; _k < _len2; j = ++_k) {
        item = cp[j];
        current = this.length;
        if (i < steps.length - 1 || j < cp.length - 1) {
          this.length += avg;
        }
        for (q = _l = current, _ref5 = this.length; current <= _ref5 ? _l <= _ref5 : _l >= _ref5; q = current <= _ref5 ? ++_l : --_l) {
          for (r = _m = 0, _ref6 = this.options.distance * 2; 0 <= _ref6 ? _m <= _ref6 : _m >= _ref6; r = 0 <= _ref6 ? ++_m : --_m) {
            this.set(this.c(q, r));
          }
        }
        checkpoints.push(current);
        matches = (prev = checkpoints[checkpoints.indexOf(current) - 1]) != null ? (function() {
          _results = [];
          for (var _n = 1, _ref7 = this.options.distance * 2 - 1; 1 <= _ref7 ? _n <= _ref7 : _n >= _ref7; 1 <= _ref7 ? _n++ : _n--){ _results.push(_n); }
          return _results;
        }).apply(this).filter(function(k) {
          var a, b, _ref7;
          _ref7 = [$.c(current, k), $.find(prev)].map($.cube), a = _ref7[0], b = _ref7[1];
          return b.z - a.z > 1 && b.y - a.y > 1;
        }) : (function() {
          _results1 = [];
          for (var _o = 1, _ref8 = this.options.distance * 2 - 1; 1 <= _ref8 ? _o <= _ref8 : _o >= _ref8; 1 <= _ref8 ? _o++ : _o--){ _results1.push(_o); }
          return _results1;
        }).apply(this);
        this.set(this.c(current, shuffle(matches)[0]), item.id);
      }
    }
    start = 0;
    _results2 = [];
    for (_p = 0, _len3 = steps.length; _p < _len3; _p++) {
      step = steps[_p];
      items = data.filter(function(a) {
        return a.step === step;
      });
      np = [];
      _ref9 = [
        start + items.filter(function(a) {
          return a.checkpoint;
        }).length, items.filter(function(a) {
          return !a.checkpoint;
        })
      ], end = _ref9[0], np = _ref9[1];
      for (q = _q = 0, _len4 = checkpoints.length; _q < _len4; q = ++_q) {
        checkpoint = checkpoints[q];
        if (!(__indexOf.call((function() {
          _results3 = [];
          for (var _r = start, _ref10 = end - 1; start <= _ref10 ? _r <= _ref10 : _r >= _ref10; start <= _ref10 ? _r++ : _r--){ _results3.push(_r); }
          return _results3;
        }).apply(this), q) >= 0)) {
          continue;
        }
        _ref11 = [this.find(checkpoint), this.find(checkpoints[q + 1])], o = _ref11[0], t = _ref11[1];
        if (np.length === 0) {
          this.draw(o, t);
        } else if (np.length === 1) {
          this.draw(o, t);
          this.set(shuffle(this.area(o, t)).filter(function(e) {
            return $.dist(o, e) >= 2 && $.dist(t, e) >= 2 && $.t(e) === -1;
          })[0], np.shift().id);
        } else {
          _ref12 = [[o, t], shuffle(this.area(o, t))], events = _ref12[0], area = _ref12[1];
          while (tile = area.shift()) {
            if (events.filter(function(e) {
              return $.dist(tile, e) >= 2;
            }).length === events.length && __indexOf.call(events, tile) < 0) {
              events.push(tile);
            }
          }
          events = events.sort(function(a, b) {
            if (a.q < b.q) {
              return -1;
            } else {
              return 1;
            }
          }).concat(events.slice(0).reverse());
          for (index = _s = 0, _len5 = events.length; _s < _len5; index = ++_s) {
            event = events[index];
            if (!(index < events.length - 1)) {
              continue;
            }
            if (np.length && this.t(event) === false) {
              this.set(event, np.shift().id);
            }
            j = 1;
            while (this.area(event, events[index + j]).length === 0) {
              j++;
            }
            this.draw(event, events[index + j]);
          }
        }
      }
      _results2.push(start = end);
    }
    return _results2;
  };
  this.init();
  return this;
};
