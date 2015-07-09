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

async = (method, url, callback = false, params = {}, headers = {}) ->
  xhr = new XMLHttpRequest()
  xhr.open method, url
  xhr.setRequestHeader 'Content-Type', 'application/json; charset=UTF-8'
  xhr.setRequestHeader k, v for k, v of headers
  if callback.call? then xhr.onload = -> callback(JSON.parse(xhr.responseText)) if xhr.status is 200
  xhr.send JSON.stringify(params)

preload = (src, callback = false) ->
  img = new Image()
  img.onload = -> do callback
  img.src = src
