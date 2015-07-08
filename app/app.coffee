# --------------------
# global
# --------------------
STATS = {days:0, markers:[], open:[]}



# --------------------
# init
# --------------------
init = (data) ->

  # set DOM base
  document.body.innerHTML += ( '<input type="checkbox" id="'+id+'">' for id in ['page-token', 'menu-token'] ).join('')
  document.body.innerHTML += ( '<section id="'+id+'"></section>' for id in ['grid', 'controls', 'current', 'preview', 'menu', 'page'] ).join('')


  # set views
  controls = new Controls '#controls', (direction) -> requestAnimFrame -> grid.progress direction
  page = new Page '#page', '#page-token'
  current = new Current '#current', (item) ->
    do menu.load if item.context is 'fin'
    page.update(item) if item.context isnt 'fin' and (item.ref or item.more)
  preview = new Preview '#preview'
  menu = new Menu '#menu', '#menu-token', data, (item) -> page.update item


  # set grid
  restart = document.querySelector('#restart')
  grid = new Grid '#grid', data.filter((a) -> a.context isnt 'repere'),
    # params
    size: 100
    before: 4
    after: 8
    distance: 2
    space: 20

    # on current change
    onChange: (id, coord, direction, item, end) -> requestAnimFrame ->
      controls.tilt direction
      if item
        document.body.className = item.context
        if item.context isnt 'tutoriel' then current.update item else current.update item, ->
          do grid.skip
          for item in data when item.context is 'tutoriel' and item.id not in STATS.markers
            STATS.markers.push item.id
            item.unlocked = true
      menu.update (if item then item.id else false)
      STATS.days = coord.q+1
      STATS.markers.push item.id if item and item.id not in STATS.markers and not end
      restart.classList.add 'restart-show' if end

    # on mouse enter/leave tile
    onEnter: (e, id, coord, item) -> requestAnimFrame -> preview.show item if item
    onLeave: (e, id, coord, item) -> requestAnimFrame -> preview.hide() if preview.open()
    onMove: (q) -> restart.classList.remove 'restart-show' if restart.classList.contains 'restart-show'
    onSnap: (q, end) -> restart.classList.add 'restart-show' if end and not restart.classList.contains 'restart-show'


  # scale grid
  wrap = document.querySelector('.grid-wrap')
  defaultHeight = wrap.clientHeight
  scale = -> wrap.style.webkitTransform = wrap.style.transform = (if window.innerWidth < 1280 then 'translateX(50px) ' else '')+'scale('+Math.max(.9, window.innerHeight*3/5/defaultHeight)+')'
  window.addEventListener 'resize', -> requestAnimFrame scale
  do scale


  # keyboard controls
  window.addEventListener 'keydown', (e) -> requestAnimFrame ->
    # progress through & slide the grid
    if e.which in [38,40] then grid.slide [true, false][[38,40].indexOf(e.which)]
    else if e.which in [37,39] then grid.progress [true, false][[37,39].indexOf(e.which)]

    # interface
    else if e.ctrlKey or e.altKey or e.metaKey then true
    else if e.which is 13 and document.body.id isnt 'loaded' then document.body.id = 'loaded'
    else if e.which in [32,77,84] and not page.isOpen() then (if menu.isOpen() then menu.close() else menu.open())
    else if e.which is 13 and current.isPage() and not menu.isOpen() then (if page.isOpen() then page.close() else page.open())
    else if e.which is 27 and page.isOpen() then page.close()
    else if e.which is 27 and menu.isOpen() then menu.close()


  # start
  do window.progress
  btn = document.querySelector('.preload-progress')
  btn.classList.add 'preload-start'
  btn.addEventListener 'click', -> document.body.id = 'loaded'



# --------------------
# load
# --------------------
do ->
  ###
  Sorry about this webkit-only thing…
  Firefox can't handle off-canvas transformed SVG elements with perspective and there is nothing I can do about it.
  I really tried IE (10+), but seems that it just couldn't try me back.
  Wait, what's Opera?
  ###
  return false if head.browser.name in ['ie', 'ff', 'opera']

  sources =
    libs:     ['mustache', 'hammer'].map((a) -> 'assets/lib/'+a+'.min.js')
    scripts:  ['helpers', 'grid', 'views'].map((a) -> 'app/'+a+'.js')
    css:      ['app'].map((a) -> 'assets/css/'+a+'.css')
  ressources = ( v.join(',') for k, v of sources ).join(',').split(',').reverse()

  window.progress = do ->
    [wrap, bar, label] = ['.preload-progress', '.preload-progress-bar', '.preload-progress-label'].map((a) -> document.querySelector(a))
    [steps, current] = [2+ressources.length, 0]
    ->
      current++
      wrap.dataset.value = current+'/'+steps
      bar.style.width = current/steps*100+'%'
      label.innerHTML = 'initialisation…' if current is steps-1


  load = (files, callback) ->
    if files.length is 0 then do callback
    else
      head.load files.slice(-1)+'?t='+(new Date).getTime(), -> load(files.slice(0, -1), callback)
      do progress

  img = new Image()
  img.src = 'assets/images/background.jpg'
  img.addEventListener 'load', ->
    do progress
    load ressources, ->
      get = new XMLHttpRequest()
      get.open('GET', 'http://data.hermione-story.com/data.json');
      get.onload = -> init(JSON.parse(get.responseText)) if get.status is 200
      get.send();
