#= require tmpls/pixie/editor/tile/screen
#= require ../command

namespace "Pixie.Editor.Tile.Views", (Views) ->
  {Command, Models} = Pixie.Editor.Tile

  tools =
    stamp:
      start: ->
      enter: ({x, y, layer, entity, execute}) ->
        if layer and entity
          instance = new Models.Instance
            x: x
            y: y
            sourceEntity: entity

          execute Command.AddInstance
            instance: instance
            layer: layer
      end: ->

    eraser:
      start: ->
      enter: ({x, y, layer, execute})->
        if layer
          instance = layer.instanceAt(x, y)

          execute Command.RemoveInstance
            instance: instance
            layer: activeLayer
      end: ->

  UI = Pixie.UI

  class Views.Screen extends Backbone.View
    className: "screen"

    initialize: ->
      # Force jQuery Element
      @el = $(@el)

      # Set up HTML
      @el.html $.tmpl("pixie/editor/tile/screen")

      @settings = @options.settings
      @execute = @settings.execute

      @collection.bind 'add', @appendLayer

      @collection.bind 'reset', @render

      @render()

    render: =>
      grid = GridGen
        width: @settings.get "tileWidth"
        height: @settings.get "tileHeight"

      @$('.canvas').css
        height: @settings.pixelHeight()
        width: @settings.pixelWidth()
        backgroundImage: grid.backgroundImage()

      @$(".cursor").css
        width: @settings.get("tileWidth") - 1
        height: @settings.get("tileHeight") - 1

      @$(".canvas ul.layers").empty()

      @collection.each (layer) =>
        @appendLayer layer

    appendLayer: (layer) =>
      layerView = new Views.ScreenLayer
        model: layer
        settings: @settings

      @$("ul.layers").append layerView.render().el

    localPosition: (event) =>
      {currentTarget} = event

      cursorWidth = @settings.get "tileWidth"
      cursorHeight = @settings.get "tileHeight"

      offset = $(currentTarget).offset()

      x: (event.pageX - offset.left).clamp(0, @settings.pixelWidth() - cursorWidth).snap(cursorWidth)
      y: (event.pageY - offset.top).clamp(0, @settings.pixelHeight() - cursorHeight).snap(cursorHeight)

    mousemove: (event) =>
      {x, y} = @cursorPosition = @localPosition(event)

      unless _.isEqual(@cursorPosition, @previousCursorPosition)
        @entered(x, y)

        @$(".cursor").css
          left: x - 1
          top: y - 1

      @previousCursorPosition = @cursorPosition

    entered: (x, y) =>
      if @activeTool
        layer = @settings.get "activeLayer"
        entity = @settings.get "activeEntity"

        @activeTool.enter({x, y, layer, entity, @execute})

    actionStart: (event) =>
      event.preventDefault()

      if tool = tools[@settings.get("activeTool")]
        @activeTool = tool

        {x, y} = @localPosition(event)
        layer = @settings.get "activeLayer"
        entity = @settings.get "activeEntity"

        tool.start({x, y, layer, entity, @execute})
        tool.enter({x, y, layer, entity, @execute})

    actionEnd: (event) ->
      if @activeTool
        {x, y} = @localPosition(event)
        layer = @settings.get "activeLayer"
        entity = @settings.get "activeEntity"

        @activeTool.end()

      @activeTool = null

    events:
      "mousemove .canvas": "mousemove"
      "mousedown .canvas": "actionStart"
      "mouseup": "actionEnd"
