# --------------------
# helpers
# --------------------

# Thanks Paul Irish: http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = do -> window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or ( callback ) -> window.setTimeout callback, 1000/60

extend = (object, properties) -> (object[k] = v for k, v of properties); object
element = (tag, attributes) -> setAttributes document.createElementNS('http://www.w3.org/2000/svg', tag), attributes
setAttributes = (item, attributes) -> (item.setAttributeNS null, k, v for k, v of attributes); item

timeout = (delay, callback) -> setTimeout callback, delay
shuffle = (a) -> m = a.length; ( i = Math.floor(Math.random()*m--); [a[m], a[i]] = [a[i], a[m]] ) while (m); a

animate = ( callback, duration = 300, easing = (t) -> t ) ->
  start = ( new Date ).getTime()
  do animation = ->
    t = easing ( ( new Date ).getTime()-start )/duration
    if t <= 1 then requestAnimFrame animation else t = 1
    callback t

jsonp = do ->
  unique = 0
  (url, callback) ->
    [name, script] = ['_jsonp_'+unique++, document.createElement 'script']
    url += ( if url.match /\?/ then '&' else '?' )+'callback='+name
    script.src = url
    window[name] = (data) -> document.body.removeChild(script); callback data
    document.body.appendChild script

preload = (src, callback = false) ->
  img = new Image()
  img.onload = -> do callback
  img.src = src
