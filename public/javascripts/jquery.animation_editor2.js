/* DO NOT MODIFY. This file was compiled Mon, 01 Aug 2011 18:45:30 GMT from
 * /Users/matt/pixie.strd6.com/app/coffeescripts/jquery.animation_editor2.coffee
 */

(function() {
  $.fn.animationEditor = function(options) {
    var Animation, Controls, animationEditor, animationNumber, animationTemplate, animations, controls, currentAnimation, editorTemplate, spriteTemplate, templates, updateUI;
    animationNumber = 1;
    animationEditor = $(this.get(0)).addClass("editor animation_editor");
    templates = $("#animation_editor_templates");
    editorTemplate = templates.find('.editor.template');
    animationTemplate = templates.find('.animation');
    spriteTemplate = templates.find('.sprite');
    Controls = function() {
      var changePlayIcon, fps, fpsEl, intervalId, scrubber, scrubberEl, self, updateFrame;
      intervalId = null;
      scrubberEl = $('.scrubber');
      scrubber = {
        min: scrubberEl.get(0).min,
        max: scrubberEl.get(0).max,
        val: scrubberEl.val()
      };
      fpsEl = $('.fps input');
      fps = {
        min: fpsEl.get(0).min,
        max: fpsEl.get(0).max,
        val: fpsEl.val()
      };
      updateFrame = function() {
        self.update();
        scrubber.val = (scrubber.val + 1) % (scrubber.max + 1);
        return currentAnimation.currentFrameIndex(scrubber.val);
      };
      changePlayIcon = function(icon) {
        var el;
        el = $('.play');
        el.css("background-image", "url(/images/" + icon + ".png)");
        if (icon === 'pause') {
          return el.addClass('pause');
        } else {
          return el.removeClass('pause');
        }
      };
      self = {
        fps: function(val) {
          if (val != null) {
            fps.val = val;
            return self;
          } else {
            return fps.val;
          }
        },
        pause: function() {
          changePlayIcon('play');
          clearInterval(intervalId);
          return intervalId = null;
        },
        play: function() {
          if (!intervalId) {
            intervalId = setInterval(updateFrame, 1000 / fps.val);
          }
          return changePlayIcon('pause');
        },
        scrubber: function(val) {
          if (val != null) {
            scrubber.val = val;
            return self;
          } else {
            return scrubber.val;
          }
        },
        scrubberMax: function(val) {
          if (val != null) {
            scrubber.max = val;
            return self;
          } else {
            return scrubber.max;
          }
        },
        scrubberPosition: function() {
          return "" + scrubber.val + " / " + scrubber.max;
        },
        stop: function() {
          scrubber.val = 0;
          self.update();
          clearInterval(intervalId);
          intervalId = null;
          changePlayIcon('play');
          return currentAnimation.currentFrameIndex(-1);
        },
        update: function() {
          scrubberEl.val(scrubber.val);
          return scrubberEl.get(0).max = scrubber.max;
        }
      };
      return self;
    };
    Animation = function() {
      var currentFrameIndex, frames, name, self, sequences, tileset, updateSelected, updateSequence;
      tileset = [];
      sequences = [];
      frames = [];
      currentFrameIndex = 0;
      name = "Animation " + animationNumber;
      animationNumber += 1;
      updateSelected = function(frameIndex) {
        var player, tilesetIndex;
        tilesetIndex = frames[frameIndex];
        $('.frame_sprites .sprite_container').removeClass('current');
        player = $('.player img');
        if (frameIndex === -1) {
          return player.attr('src', tileset[0]);
        } else {
          player.attr('src', tileset[tilesetIndex]);
          return $('.frame_sprites .sprite_container').eq(frameIndex).addClass('current');
        }
      };
      updateSequence = function() {
        var array, sequence, sequencesEl, spriteIndex, spriteSrc, _i, _len, _results;
        sequencesEl = $('.sequences');
        sequencesEl.children().remove();
        _results = [];
        for (_i = 0, _len = sequences.length; _i < _len; _i++) {
          array = sequences[_i];
          sequence = $('<div class="sequence"></div>').appendTo(sequencesEl);
          _results.push((function() {
            var _j, _len2, _results2;
            _results2 = [];
            for (_j = 0, _len2 = array.length; _j < _len2; _j++) {
              spriteIndex = array[_j];
              spriteSrc = tileset[spriteIndex];
              _results2.push(spriteTemplate.tmpl({
                src: spriteSrc
              }).appendTo(sequence));
            }
            return _results2;
          })());
        }
        return _results;
      };
      self = {
        addFrame: function(imgSrc) {
          if ($.inArray(imgSrc, tileset) === -1) {
            tileset.push(imgSrc);
          }
          frames.push(tileset.indexOf(imgSrc));
          controls.scrubberMax(frames.length - 1);
          return self.update();
        },
        addSequenceToFrames: function(index) {
          var imageIndex, _i, _len, _ref, _results;
          _ref = sequences[index];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            imageIndex = _ref[_i];
            _results.push(self.addFrame(tileset[imageIndex]));
          }
          return _results;
        },
        createSequence: function() {
          sequences.push(frames.copy());
          updateSequence();
          frames.clear();
          return self.update();
        },
        currentFrameIndex: function(val) {
          if (val != null) {
            currentFrameIndex = val;
            updateSelected(val);
            return self;
          } else {
            return currentFrameIndex;
          }
        },
        name: name,
        update: function() {
          var frame_index, spriteSrc, _i, _len, _results;
          $('.frame_sprites').children().remove();
          _results = [];
          for (_i = 0, _len = frames.length; _i < _len; _i++) {
            frame_index = frames[_i];
            spriteSrc = tileset[frame_index];
            _results.push(spriteTemplate.tmpl({
              src: spriteSrc
            }).appendTo($('.frame_sprites')));
          }
          return _results;
        }
      };
      return self;
    };
    editorTemplate.tmpl().appendTo(animationEditor);
    controls = Controls();
    currentAnimation = Animation();
    animations = [currentAnimation];
    updateUI = function() {
      var animation, animationsEl, spritesEl, spritesSrc, src, _i, _j, _len, _len2, _results;
      animationsEl = $('.animations');
      animationsEl.children().remove();
      spritesEl = $('.sprites');
      spritesEl.children().remove();
      for (_i = 0, _len = animations.length; _i < _len; _i++) {
        animation = animations[_i];
        animationTemplate.tmpl({
          name: animation.name
        }).appendTo(animationsEl);
      }
      spritesSrc = ["http://dev.pixie.strd6.com/sprites/323/original.png", "http://dev.pixie.strd6.com/sprites/324/original.png", "http://dev.pixie.strd6.com/sprites/325/original.png", "http://dev.pixie.strd6.com/sprites/326/original.png", "http://dev.pixie.strd6.com/sprites/327/original.png", "http://dev.pixie.strd6.com/sprites/328/original.png", "http://dev.pixie.strd6.com/sprites/329/original.png", "http://dev.pixie.strd6.com/sprites/330/original.png", "http://dev.pixie.strd6.com/sprites/331/original.png", "http://dev.pixie.strd6.com/sprites/332/original.png", "http://dev.pixie.strd6.com/sprites/333/original.png", "http://dev.pixie.strd6.com/sprites/334/original.png", "http://dev.pixie.strd6.com/sprites/335/original.png", "http://dev.pixie.strd6.com/sprites/336/original.png", "http://dev.pixie.strd6.com/sprites/337/original.png", "http://dev.pixie.strd6.com/sprites/338/original.png"];
      _results = [];
      for (_j = 0, _len2 = spritesSrc.length; _j < _len2; _j++) {
        src = spritesSrc[_j];
        _results.push(spriteTemplate.tmpl({
          src: src
        }).appendTo(spritesEl));
      }
      return _results;
    };
    updateUI();
    $('.play').mousedown(function() {
      if ($(this).hasClass('pause')) {
        return controls.pause();
      } else {
        return controls.play();
      }
    });
    $('.scrubber').change(function() {
      var newValue;
      newValue = $(this).val();
      controls.scrubber(newValue);
      return currentAnimation.currentFrameIndex(newValue);
    });
    $('.stop').mousedown(function() {
      return controls.stop();
    });
    $('.new_animation').mousedown(function() {
      animations.push(Animation());
      currentAnimation = animations.last();
      return updateUI();
    });
    $('.sprites .sprite_container').mousedown(function() {
      var imgSrc;
      imgSrc = $(this).find('img').attr('src');
      return currentAnimation.addFrame(imgSrc);
    });
    $('.sequence').live({
      mousedown: function() {
        var index;
        index = $(this).index();
        return currentAnimation.addSequenceToFrames(index);
      }
    });
    $('.save_sequence').click(function() {
      return currentAnimation.createSequence();
    });
    return $('.fps input').change(function() {
      var newValue;
      newValue = $(this).val();
      controls.stop();
      return controls.fps(newValue);
    });
  };
}).call(this);