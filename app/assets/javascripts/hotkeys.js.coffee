site_hotkeys = [
  { description: "Toggle chat", key: "c" }
  { description: "Bring up this dialog", key: "?" }
]

tilemap_hotkeys = [
  { description: "Open tile in pixel editor", key: "double click" }
  { description: "Edit tile properties", key: "p" }
]

animation_hotkeys = [
  { description: "Add multiple sprites to animation frame", key: "shift-click sprite" }
  { description: "Remove selected frame(s)", key: "delete" }
  { description: "Select multiple animation frames", key: "shift-click frame" }
  { description: "Add n copies of the last sprite clicked to animation frame", key: "numbers 1 - 9" }
  { description: "Cut selected sprites from animation frame", key: ["ctrl x","⌘ x"] }
  { description: "Copy selected sprites from animation frame", key: ["ctrl c","⌘ c"] }
  { description: "Paste selected sprites from animation frame", key: ["ctrl v","⌘ v"] }
  { description: "Create new sequence with current animation frame", key: ["ctrl s","⌘ s"] }
]

developer_hotkeys = [
  { description: "Enter developer mode", key: "esc" }
  { description: "Save game to github", key: ["ctrl s", "⌘ s"] }
  { description: "Edit object properties", key: "right click" }
  { description: "Increment numeric values. Flip booleans", key: "↑" }
  { description: "Decrement numeric values. Flip booleans", key: "↓" }
  { description: "Increment numeric values by 10", key: "shift ↑" }
  { description: "Decrement numeric values by 10", key: "shift ↓" }
]

pixie_hotkeys = [
  { description: "Pencil", key: ["p", 1] }
  { description: "Brush", key: ["b", 2] }
  { description: "Eye Dropper", key: ["i", 3] }
  { description: "Eraser", key: ["e", 4] }
  { description: "Fill", key: ["f", 5] }
]

key_join = (hotkey) ->
  { description: hotkey.description, key: [].concat(hotkey.key).join(" <em>or</em> ") }

hotkey_markup = (hotkeys, title, template) ->
  container = $('<div><h2 class="header">' + title + '</h2></div>')
  $.each hotkeys, (i, data) ->
    template.tmpl("tmpls/#{key_join(data)}").appendTo(container)

  return container

hotkeyHandler = ->
  template = $('#hotkeys')
  hotkeys = $('#hotkeysModal').empty()

  hotkey_markup(site_hotkeys, "Keyboard Shortcuts", template).appendTo(hotkeys)

  if $('#test_frame').contents().find('body *').length
    hotkey_markup(developer_hotkeys, "Developer Mode", template).appendTo(hotkeys)
  else if window.currentComponent
    switch window.currentComponent.attr('class')
      when "editor tile_editor" then hotkey_markup(tilemap_hotkeys, "Tile Editor", template).appendTo(hotkeys)
      when "editor animation_editor" then hotkey_markup(animation_hotkeys, "Animation Editor", template).appendTo(hotkeys)
      when "editor pixie" then hotkey_markup(pixie_hotkeys, "Pixel Editor", template).appendTo(hotkeys)

  hotkeys.modal()

$('.help_hotkeys').mousedown(hotkeyHandler)

$(document).bind 'keydown', 'shift+/', hotkeyHandler
