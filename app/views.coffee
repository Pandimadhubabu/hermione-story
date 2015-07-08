# --------------------
# Controls
# --------------------
Controls = (target, click = false) ->
  [@element, $] = [document.querySelector(target), @]
  return false if not @element?

  @tilt = (direction = false) -> @tile.setAttribute('class', 'controls-tile controls-tile-'+(if direction then 'right' else 'left'))
  @init = ->
    @element.innerHTML = """
    <div class="controls">
      <svg class="controls-left" width="68px" height="68px" viewBox="0 0 68 68" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <circle fill="#000000" cx="34" cy="34" r="34"></circle>
        <path d="M20.4345414,17.0146985 C20.5335111,17.0048995 20.6354204,17 20.7412494,17 L44.2930903,17 C46.3655739,17 48.0421788,18.6775848 48.0431587,20.7490886 C48.0421788,22.8176526 46.3636141,24.4962173 44.29603,24.4962173 L29.7964839,24.4962173 L49.9020246,44.5997983 C51.3659918,46.0647453 51.3659918,48.4390374 49.9020246,49.9020246 C48.4400173,51.3650119 46.0657252,51.3650119 44.6007782,49.9000648 L24.4962173,29.7964839 L24.4962173,44.29603 C24.4971972,46.364594 22.8176526,48.0441386 20.7471288,48.0451185 C18.6785647,48.0431587 17.0019598,46.3655739 17,44.2979898 L17.0009799,20.7500684 C17,20.6373802 17.0048995,20.5325312 17.0176382,20.428662 C17.019598,20.3845666 17.0254773,20.3404712 17.0303768,20.2973557 C17.0342964,20.2630593 17.0391959,20.2258232 17.0489949,20.1944665 C17.1607032,19.4281865 17.5085669,18.6913034 18.0974854,18.0984653 C18.6913034,17.5066071 19.4281865,17.1597233 20.1983861,17.0450753 C20.3257728,17.028417 20.3786872,17.0186181 20.4345414,17.0146985 Z" fill="#FFFFFF"></path>
      </svg>
      <svg class="controls-right" width="68px" height="68px" viewBox="0 0 68 68" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <circle fill="#000000" cx="34" cy="34" r="34"></circle>
        <path d="M20.4345414,17.0146985 C20.5335111,17.0048995 20.6354204,17 20.7412494,17 L44.2930903,17 C46.3655739,17 48.0421788,18.6775848 48.0431587,20.7490886 C48.0421788,22.8176526 46.3636141,24.4962173 44.29603,24.4962173 L29.7964839,24.4962173 L49.9020246,44.5997983 C51.3659918,46.0647453 51.3659918,48.4390374 49.9020246,49.9020246 C48.4400173,51.3650119 46.0657252,51.3650119 44.6007782,49.9000648 L24.4962173,29.7964839 L24.4962173,44.29603 C24.4971972,46.364594 22.8176526,48.0441386 20.7471288,48.0451185 C18.6785647,48.0431587 17.0019598,46.3655739 17,44.2979898 L17.0009799,20.7500684 C17,20.6373802 17.0048995,20.5325312 17.0176382,20.428662 C17.019598,20.3845666 17.0254773,20.3404712 17.0303768,20.2973557 C17.0342964,20.2630593 17.0391959,20.2258232 17.0489949,20.1944665 C17.1607032,19.4281865 17.5085669,18.6913034 18.0974854,18.0984653 C18.6913034,17.5066071 19.4281865,17.1597233 20.1983861,17.0450753 C20.3257728,17.028417 20.3786872,17.0186181 20.4345414,17.0146985 Z" id="Path" fill="#FFFFFF" sketch:type="MSShapeGroup" transform="translate(34.000000, 33.999510) scale(-1, 1) translate(-34.000000, -33.999510) "></path>
      </svg>
      <svg class="controls-tile" width="130px" height="150px" viewBox="0 0 260 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <polygon fill="#32394B" points="130 0 259.903811 75 259.903811 225 130 300 0.0961894323 225 0.0961894323 75 "></polygon>
      </svg>
    </div>"""
    @tile = document.querySelector('.controls-tile')
    document.querySelector('.controls-left').addEventListener 'click', -> click true if click.call?
    document.querySelector('.controls-right').addEventListener 'click', -> click false if click.call?
  do @init
  @


# --------------------
# preview
# --------------------
Preview = (target) ->
  [@element, $] = [document.querySelector(target), @]
  return false if not @element?

  @tpl = """
    <header class="preview-header">
      <small class="preview-context">{{contextFull}}</small>
      <h1 class="preview-title">{{title}}</h1>
      {{#date}}<time class="preview-date" date="{{date}}">{{dateFormat}}</time>{{/date}}
      <span class="preview-icon"><span class="icon-{{icon}}"></span></span>
    </header>"""

  @init = ->
    @element.innerHTML = '<article class="preview"></article>'
    @box = @element.querySelector('.preview')
  @show = (data) -> requestAnimFrame ->
    $.element.className = 'preview-'+data.context
    $.box.classList.add 'preview-show'
    $.box.innerHTML = Mustache.render $.tpl, extend(data, {icon:(if data.text then 'text' else if data.video then 'film' else 'idea')})
  @hide = -> requestAnimFrame -> $.box.classList.remove 'preview-show'
  @open = -> @box.classList.contains 'preview-show'

  do @init
  @



# --------------------
# current
# --------------------
Current = (target, callback = false) ->
  [@element, @callback, $] = [document.querySelector(target), callback, @]
  return false if not @element?

  @tpl = """
    <article class="current-wrap">
      <h1 class="current-title{{^date}} current-title-style{{/date}}">{{title}}</h1>
      {{#date}}<time class="current-date" date="{{date}}">{{dateFormat}}</time>{{/date}}
      <div class="current-excerpt"><p>{{{excerpt}}}</p></div>
      {{#text}}<label for="page-token" class="current-btn js-open js-page" title="touche ENTRÉE du clavier">Consulter la fiche</label>{{/text}}
      {{#more}}<label for="page-token" class="current-btn js-page" title="touche ENTRÉE du clavier">Lire la suite</label>{{/more}}
      {{#video}}<label for="page-token" class="current-btn js-open js-page" title="touche ENTRÉE du clavier">Voir la vidéo</label>{{/video}}
      {{#skip}}<button class="current-btn js-skip" title="touche ENTRÉE du clavier">Passer le tutoriel</label>{{/skip}}
      {{#end}}<label for="menu-token" class="current-btn" title="touche ESPACE du clavier">Ouvrir le tableau de bord</label>{{/end}}
    </article>"""

  @init = ->
    @element.innerHTML = """<section class="current"></section><div class="current-bg"></div>"""
    @box = @element.querySelector('.current')
  @update = (data, skip = false) -> requestAnimFrame ->
    $.box.innerHTML = Mustache.render $.tpl, extend(data, {skip: skip.call?, end: data.context is 'fin'})
    if btn = $.box.querySelector('.js-open') then btn.addEventListener 'click', ->
      STATS.open.push data.id if data.id not in STATS.open
    if skip.call?
      if sessionStorage.skip then do skip
      else $.box.querySelector('.js-skip').addEventListener 'click', (e) ->
        do e.preventDefault
        sessionStorage.skip = true
        do skip
    $.callback.call($, data) if $.callback.call?
  @isPage = -> @box.querySelector('.js-page')?

  do @init
  @



# --------------------
# page
# --------------------
Page = (target, token) ->
  [@element, @token, @id, $] = [document.querySelector(target), document.querySelector(token), false, @]
  return false if not @element?

  @tpl = """
    <label for="page-token" class="page-exit" title="touche ECHAP du clavier"></label>
    <article class="page-wrap{{#image}} page-full{{/image}}">
      <div class="page-content">
        <div class="page-content-wrap">
          {{#video}}
          <div class="page-video">
            <iframe class="page-video-frame" src="https://player.vimeo.com/video/{{video}}" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
          </div>
          {{/video}}
          <header class="page-header">
            <h1 class="page-title{{^date}} page-title-style{{/date}}">{{title}}</h1>
            {{#date}}<time class="page-date" date="{{date}}">{{dateFormat}}</time>{{/date}}
            {{#text}}<div class="page-excerpt">{{{excerptFull}}}</div>{{/text}}
          </header>
          {{#text}}
          <a href="http://flottillenumerique.com" target="_blank" class="page-app">
            <img src="assets/images/app.png" width="64" height="64" class="page-app-img">
            <p class="page-app-text">Plus d'informations à ce sujet sur l'application PC et tablettes <b>L'Hermione, la Traversée des Lumières</b>.
            <br><small>Télécharger sur flottillenumerique.com</small></p>
          </a>
          {{/text}}
          <div class="page-text">{{#text}}{{{text}}}{{/text}}{{^text}}{{{excerptFull}}}{{/text}}</div>
        </div>
      </div>
      {{#image}}
      <aside class="page-cover">
        <figure class="page-cover-img" style="background-image:url({{image}})"></figure>
      </aside>
      {{/image}}
    </article>
    <footer class="page-context">{{contextFull}}</footer>"""

  @init = ->
    # TODO put loader in .page
    @element.innerHTML = """<section class="page"></section>"""
    @box = @element.querySelector('.page')
  @update = (data) -> requestAnimFrame ->
    $.box.dataset.id = data.id
    $.box.dataset.open = true if data.text or data.video
    $.box.className = 'page page-'+data.context
    $.box.innerHTML = Mustache.render $.tpl, data
  @open = ->
    @token.checked = true
    id = parseInt($.box.dataset.id)
    STATS.open.push id if id not in STATS.open and $.box.dataset.open
  @close = -> @token.checked = false
  @isOpen = -> @token.checked

  do @init
  @



# --------------------
# menu
# --------------------
Menu = (target, token, data = [], callback = false) ->
  [@data, @element, @token, @callback, $] = [data.sort((a, b) -> a.date.toString().localeCompare(b.date.toString())), document.querySelector(target), document.querySelector(token), callback, @]
  @contexts = []
  return false if not @element?

  @_tl = """
    <section class="tl">
      <div class="tl-wrap">
        {{#items}}
        {{#card}}<label for="page-token"{{/card}}{{^card}}<div{{/card}} class="tl-item tl-{{context}}{{#landmark}} tl-landmark{{/landmark}}{{#unlocked}} tl-unlocked{{/unlocked}}" data-id="{{id}}">
          <span class="tl-item-title">{{title}}</span>
          <time class="tl-item-date{{^showDate}} tl-item-date-hide{{/showDate}}" date="{{date}}">{{dateFormat}}</time>
        {{#card}}</label>{{/card}}{{^card}}</div>{{/card}}
        {{/items}}
      </div>
    </section>
    """

  @_stats = """
    <div class="stats">
      <section class="stats-numbers-wrap">
        {{#numbers}}
        <article class="stats-numbers-item stats-numbers-{{key}}">
          <span class="stats-numbers-value">{{value}}</span>
          <span class="stats-numbers-label">{{{label}}}</span>
        </article>
        {{/numbers}}
      </section>
      <section class="stats-contexts">
        {{#contexts}}
        <article class="stats-context stats-context-{{key}}" data-value="{{value}}/{{total}}">
          <div class="stats-context-progress" style="width:{{progress}}%"></div>
          <div class="stats-context-label">{{name}}</div>
        </article>
        {{/contexts}}
      </section>
    </div>
    """

  @_skip = """<label class="skip-btn"><input type="checkbox" id="skip-token"{{#skip}} checked="true"{{/skip}}> Passer automatiquement le tutoriel au lancement.</label>"""

  # init
  @init = ->
    @element.innerHTML = """
      <label for="menu-token" class="menu-exit" title="touche ECHAP du clavier"></label>
      <section class="menu">
        <label for="menu-token" class="menu-count" title="touche ESPACE du clavier"></label>
        <div class="menu-wrap">
          <div class="menu-layout">
            <section id="timeline"></section>
            <section class="info">
              <section id="stats"></section>
              <footer class="credits">
                <div id="skip" class="skip"></div>
                <a href="http://flottillenumerique.com" target="_blank" class="credits-app">
                  <img src="assets/images/app.png" width="64" height="64" class="credits-app-img">
                  <p class="credits-app-text">Retrouvez plus de contenus sur notre application ludo-éducative PC et tablettes <b>L'Hermione, la Traversée des Lumières</b>.
                  <br><small>Télécharger sur www.flottillenumerique.com</small></p>
                </a>
                <p class="credits-copyright">
                  © 2015 <a href="http://www.flottillenumerique.com" target="_blank">La Flottille Numérique</a> —
                  <a href="mailto:contact@hermione-story.com">contact@hermione-story.com</a>
                </p>
              </footer>
            </section>
          </div>
        </div>
      </section>
      <div class="menu-bg"></div>"""
    @box = @element.querySelector('.menu-wrap')
    @count = @element.querySelector('.menu-count')

    # contexts
    contexts = []
    contexts.push {k:item.context, v:item.contextFull} for item in @data when item.context not in contexts.map((a) -> a.k)
    contexts.sort((a, b) -> a.v.localeCompare(b.v))
    @contexts.push {key:c.k, name:c.v,total:$.data.filter((a) -> a.context is c.k).length,value:0} for c in contexts when c.k not in ['repere', 'fin']

    # update
    @count.addEventListener 'click', @load
    do @update

  @update = (id) -> requestAnimFrame ->
    item.unlocked = true for item in $.data when item.id is id if id
    $.count.dataset.count = STATS.markers.length

  @open = -> @load -> @token.checked = true
  @close = -> @token.checked = false
  @isOpen = -> @token.checked

  @load = (callback = false) -> requestAnimFrame ->
    # skip
    $.box.querySelector('#skip').innerHTML = Mustache.render $._skip, {skip:sessionStorage.skip}
    $.box.querySelector('#skip-token').addEventListener 'click', (e) -> if sessionStorage.skip then delete sessionStorage.skip else sessionStorage.skip = true

    # timeline
    data = $.data.filter((a) -> a.context isnt 'tutoriel' and a.date isnt false)
    for item in data
      item.card = item.ref and item.unlocked
      item.showDate = item.date isnt lastDate
      lastDate = item.date
    $.box.querySelector('#timeline').innerHTML = Mustache.render $._tl, {items:data}
    for btn in $.box.querySelectorAll('label.tl-item')
      btn.addEventListener 'click', (e) ->
        do e.preventDefault
        id = parseInt @dataset.id
        item = $.data.filter((a) -> a.id is id)[0]
        console.log id, item, $.data
        $.callback.call($, item) if $.callback.call? and item? and item.ref
        timeout 100, -> document.querySelector('#page-token').checked = true

    # stats
    for c in $.contexts
      c.value = $.data.filter((a) -> a.context is c.key and a.unlocked).length
      c.progress = c.value/c.total*100
    $.box.querySelector('#stats').innerHTML = Mustache.render $._stats, {
      contexts: $.contexts
      numbers:[
        {key:'days',value:STATS.days,label:(if STATS.days > 1 then 'Jours' else 'Jour')+'<br>en mer'},
        {key:'markers',value:STATS.markers.length,label:(if STATS.markers.length > 1 then 'Balises<br>franchies' else 'Balise<br>franchie')}
        {key:'open',value:STATS.open.length,label:(if STATS.open.length > 1 then 'Escales' else 'Escale')}
      ]
    }

    # callback
    callback.call($) if callback.call?


  do @init
  @
