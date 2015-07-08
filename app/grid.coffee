# --------------------
# tiles grid
# gold mine: http://www.redblobgames.com/grids/hexagons/
# --------------------
Grid = (target, data = [], params = {}) ->
  [@data, @lookup, @element, @tiles, @cache, $] = [data, {}, document.querySelector(target), {}, [], @]
  [@path, @current, @q, @length, @w, @h] = [[], 0, 0, 0, 0, 0]
  return false if not @element?
  @lookup[item.id] = item for item, i in @data

  @options = extend {
    size: 30
    distance: 2
    before: 2
    after: 2
    space: 0
    onMove: false
    onSnap: false
    onChange: false
    onEnd: false
    onEnter: false
    onLeave: false
  }, params

  # init
  @init = ->
    # position grid
    @element.innerHTML = '<div class="grid-wrap"><div class="grid-box"></div></div>'
    wrap = @element.querySelector('.grid-wrap')

    # generate grid
    @box = @element.querySelector('.grid-box')
    do @generate
    [@w, @h] = [@options.size*3/2, @options.size*Math.sqrt(3)]
    [@width, @height] = [(@w+@options.space)*(@length+2), (@h+@options.space)*(@options.distance*2+3/2)]
    @svg = element 'svg', {class: 'grid', width: @width, height: @height}
    @box.appendChild @svg
    @svg.style.position = 'relative'
    do center = -> $.svg.style.top = (($.box.clientHeight or $.box.offsetHeight())-$.height)/2+'px'
    window.addEventListener 'resize', -> requestAnimFrame center
    @setCurrent @find(0)

    # pan control
    [mc, ref] = [new Hammer(@element.querySelector('.grid-wrap')), 0]
    mc.on 'panstart', (e) -> ref = $.getPos($.q); $.options.onMove.call($, $.q) if $.options.onMove.call?
    mc.on 'pan', (e) -> requestAnimFrame ->
      $.show $.getLine(pos = Math.min($.getPos(0), Math.max($.getPos($.length), ref-e.deltaY*3)))
      if e.isFinal then $.snap(pos, $.getPos($.q)) else $.move(pos)
      $.options.onSnap.call($, $.q, $.q > $.length-3 and $.current.q is $.length) if e.isFinal and $.options.onSnap.call?
    mc.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL })

  @slide = (d = true) ->
    @show @q+([1,-1][[true, false].indexOf(d)])
    @move @getPos(@q)
  @progress = (d = true) ->
    return if @current.q >= @length
    [q, n, k] = [Math.min(@current.q+1, @length-1), @next(@current), [true, false].indexOf(d)]
    if n.length is 1 then k = 0 else if n[k%2]? and @t(n[k%2]) is false then k++
    @setCurrent @next(@current)[k%2]

  @setCurrent = (c) ->
    [direction, pos, @current] = [@current.r+@current.q%2 <= c.r, @getPos(@current.q), c]
    @snap pos, @getPos(c.q)
    @path.push key if (key = @tok(@current)) not in @path
    @show @current.q
    @options.onChange.call($, @t(c), c, direction, @get(c), @current.q is @length) if @options.onChange.call?
  @show = (q) ->
    q = Math.max(0, Math.min(@length, q))
    [@q, visible] = [q, [Math.max(0,q-@options.before)..Math.min(q+@options.after, @length)]]
    @svg.appendChild @line i for i in visible when not document.getElementById('gl'+i)?
    @svg.removeChild line for line in [].slice.call(@svg.childNodes, 0) when parseInt(line.id.slice(2)) not in visible
    if @current.q >= visible[0]
      for item in @path.filter((k) -> $.toc(k).q in visible).map((k) -> $.svg.querySelector('#gt'+k))
        item.setAttribute('class', item.getAttribute('class')+' tile-through') if item.getAttribute('class').indexOf('tile-through') is -1
        item.setAttribute('class', item.getAttribute('class').replace('tile-current', '')) if item.getAttribute('class').indexOf('tile-current') > -1
        item.setAttribute('class', item.getAttribute('class')+' tile-current') if item.id.slice(2) is @tok(@current)

  @getLine = (pos) -> Math.floor(-pos/(@w+@options.space))
  @getPos = (q) -> -q*(@w+@options.space)
  @snap = (from, to) -> target = to-from; animate ( (t) -> $.move from+target*t, t is 1 ), 300, (t) -> (--t)*t*t+1
  @move = (pos) -> $.svg.style.webkitTransform = $.svg.style.transform = 'translateX('+pos+'px)'
  @skip = ->
    [keys, i] = [Object.keys(@tiles), 0]
    while not current
      [k, v, i] = [keys[i], @tiles[keys[i]], i+1]
      @path.push k if v isnt false and k not in @path
      current = @toc(k) if v not in [-1, false] and @lookup[v].context isnt 'tutoriel'
    @setCurrent current

  @line = (q) ->
    return line if (line = @cache[q])?
    line = element 'g', {class: 'grid-line', id: 'gl'+q }
    line.appendChild ( @tile @c(q, r) ) for r in [0..@options.distance*2]
    line
  @tile = (c) ->
    cl = if @t(c) is false then 'tile-disabled' else if @get(c).checkpoint then 'tile-checkpoint' else if @t(c) > -1 then 'tile-item' else 'tile'
    cl += ' tile-'+@get(c).context if @get(c).context
    [x, y] = [(c.q+1)*@w+c.q*@options.space, @height/2+(c.r-@options.distance+(c.q%2)/2-1/4)*@h+(c.r-@options.distance+(c.q%2)/2)*@options.space]
    tile = element 'polygon', {id: 'gt'+@tok(c), class: cl, points: @points({x:x,y:y})}
    tile.addEventListener 'touchstart', (e) ->
      e.stopPropagation(); e.preventDefault();
      if $.double($.tok(c)) $.goTo(c)
      else $.options.onEnter.call($, e, $.t(c), c, $.get(c)) if $.options.onEnter.call?
    tile.addEventListener 'click', (e) -> $.goTo(c)
    tile.addEventListener 'mouseenter', (e) -> $.options.onEnter.call($, e, $.t(c), c, $.get(c)) if $.options.onEnter.call?
    tile.addEventListener 'mouseleave', (e) -> $.options.onLeave.call($, e, $.t(c), c, $.get(c)) if $.options.onLeave.call?
    tile
  @goTo = (c) -> requestAnimFrame ->
    n = $.next($.current).filter((a) -> $.t(a) isnt false and $.in(a, $.current, c))
    $.setCurrent shuffle(n)[0] if n.length
    timeout 150, arguments.callee if not (n.length is 0 or $.current.q is c.q or $.t($.current) > -1)
  @double = (k) ->
    return true if @t(@toc(k)) is -1 or @doubleStore is k
    @doubleStore = k
    false

  @points = (center) -> (@corner(center, @options.size, i).join(',') for i in [0..5]).join(' ')
  @corner = (center, size, i) -> rad = Math.PI/180*(60*i); [center.x+size*Math.cos(rad), center.y+size*Math.sin(rad)]

  @c = (q, r) -> {q:q, r:r}
  @t = (c) -> @tiles[@tok(c)]
  @set = (c, id = false) -> @tiles[@tok(c)] = id
  @get = (c) -> if (item = @lookup[@t(c)])? then item else false
  @tok = (c) -> c.q+'-'+c.r
  @toc = (id) -> c = id.split('-').map(parseFloat); @c(c[0], c[1])
  @find = (q) -> ( @c(q, r) for r in [0..@options.distance*2] when @t(@c(q, r)) not in [false, -1] )[0]
  @next = (c, b = false) -> [-1, 0].map((r) -> $.c(c.q+(if b then -1 else 1), c.r+r+c.q%2)).filter((a) -> a.r in [0..$.options.distance*2])
  @cube = (c) -> [x, z] = [c.q, c.r-(c.q-(c.q&1))/2]; {x:x, z:z, y:-x-z}
  @in = (c, o, t) -> [o, t] = [t, o] if t.q < o.q; [i, p, n] = [c, o, t].map(@cube); n.y <= p.y and n.z <= p.z and i.y in [n.y..p.y] and i.z in [n.z..p.z] and c.q in [o.q..t.q] and c.r in [0..@options.distance*2]
  @area = (o, t) -> @toc(id) for id, tile of @tiles when @in(@toc(id), o, t) and @toc(id).q not in [o.q, t.q]
  @draw = (o, t) -> c = o; ( @set((c = shuffle(n)[0]), -1) if (n = @next(c, o.q > t.q).filter((a) -> $.in(a, o, t) and $.t(a) in [false, -1])).length ) for q in ( if t.q < o.q then [t.q..o.q-2] else [o.q..t.q-2] )
  @dist = (o, t) -> [a, b] = [o, t].map(@cube); (Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z))/2

  @generate = ->
    # position checkpoints step by step
    steps = ( item.step for item in @data ).filter((v, i, a) -> a.indexOf(v) is i).sort((a, b) -> if a < b then -1 else 1)
    [data, checkpoints] = [shuffle(@data.slice(0)), []]

    for step, i in steps
      items = data.filter((a) -> a.step is step)
      [cp, np] = [items.filter((a) -> a.checkpoint), items.filter((a) -> not a.checkpoint)]
      avg = 4+Math.ceil(Math.max(1, Math.floor(np.length*2/3))/cp.length)-1
      cp.sort((a, b) -> if a.id < b.id then -1 else 1) if cp[0].context is 'tutoriel'
      for item, j in cp
        current = @length
        @length += avg if i < steps.length-1 or j < cp.length-1
        ( @set(@c(q, r)) for r in [0..@options.distance*2] ) for q in [current..@length]
        checkpoints.push current
        matches = if (prev = checkpoints[checkpoints.indexOf(current)-1])? then [1..@options.distance*2-1].filter((k) -> [a, b] = [$.c(current, k), $.find(prev)].map($.cube); b.z-a.z>1 and b.y-a.y>1) else [1..@options.distance*2-1]
        @set(@c(current, shuffle(matches)[0]), item.id)

    # place points & inject events
    start = 0
    for step in steps
      items = data.filter((a) -> a.step is step)
      np = []
      [end, np] = [start+items.filter((a) -> a.checkpoint).length, items.filter((a) -> not a.checkpoint)]
      for checkpoint, q in checkpoints when q in [start..end-1]
        [o, t] = [@find(checkpoint), @find(checkpoints[q+1])]
        if np.length is 0 then @draw(o, t)
        else if np.length is 1 then @draw(o, t); @set(shuffle(@area(o, t)).filter((e) -> $.dist(o, e) >= 2 and $.dist(t, e) >= 2 and $.t(e) is -1)[0], np.shift().id)
        else
          [events, area] = [[o, t], shuffle(@area(o, t))]
          ( events.push tile if events.filter((e) -> $.dist(tile, e) >= 2).length is events.length and tile not in events ) while tile = area.shift()
          events = events.sort((a, b) -> if a.q < b.q then -1 else 1 ).concat(events.slice(0).reverse())
          for event, index in events when index < events.length-1
            @set(event, np.shift().id) if np.length and @t(event) is false
            j = 1; j++ while @area(event, events[index+j]).length is 0
            @draw(event, events[index+j])
      start = end

  do @init
  @
