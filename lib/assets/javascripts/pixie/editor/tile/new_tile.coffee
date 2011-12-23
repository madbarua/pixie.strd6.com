#= require underscore
#= require backbone

#= require_tree ./models
#= require_tree ./views

Models = Pixie.Editor.Tile.Models

layerList = new Models.LayerList [
  new Models.Layer
    name: "Background"
  new Models.Layer
    name: "Entities"
]

new Pixie.Editor.Tile.Views.LayersView
  el: $ "#testie"
  collection: layerList

layerList.activeLayer(layerList.at(0))
