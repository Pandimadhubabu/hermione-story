var animate, element, extend, jsonp, preload, setAttributes, shuffle, timeout;

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();

extend = function(object, properties) {
  var k, v;
  for (k in properties) {
    v = properties[k];
    object[k] = v;
  }
  return object;
};

element = function(tag, attributes) {
  return setAttributes(document.createElementNS('http://www.w3.org/2000/svg', tag), attributes);
};

setAttributes = function(item, attributes) {
  var k, v;
  for (k in attributes) {
    v = attributes[k];
    item.setAttributeNS(null, k, v);
  }
  return item;
};

timeout = function(delay, callback) {
  return setTimeout(callback, delay);
};

shuffle = function(a) {
  var i, m, _ref;
  m = a.length;
  while (m) {
    i = Math.floor(Math.random() * m--);
    _ref = [a[i], a[m]], a[m] = _ref[0], a[i] = _ref[1];
  }
  return a;
};

animate = function(callback, duration, easing) {
  var animation, start;
  if (duration == null) {
    duration = 300;
  }
  if (easing == null) {
    easing = function(t) {
      return t;
    };
  }
  start = (new Date).getTime();
  return (animation = function() {
    var t;
    t = easing(((new Date).getTime() - start) / duration);
    if (t <= 1) {
      requestAnimFrame(animation);
    } else {
      t = 1;
    }
    return callback(t);
  })();
};

jsonp = (function() {
  var unique;
  unique = 0;
  return function(url, callback) {
    var name, script, _ref;
    _ref = ['_jsonp_' + unique++, document.createElement('script')], name = _ref[0], script = _ref[1];
    url += (url.match(/\?/) ? '&' : '?') + 'callback=' + name;
    script.src = url;
    window[name] = function(data) {
      document.body.removeChild(script);
      return callback(data);
    };
    return document.body.appendChild(script);
  };
})();

preload = function(src, callback) {
  var img;
  if (callback == null) {
    callback = false;
  }
  img = new Image();
  img.onload = function() {
    return callback();
  };
  return img.src = src;
};
