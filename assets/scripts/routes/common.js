// Common js
import appState from '../util/appState';

// Shared vars
let $window = $(window),
    $body = $('body'),
    $document = $(document),
    $customCursor,
    transitionElements = [],
    resizeTimer;

export default {
  // JavaScript to be fired on all pages
  init() {
    // Transition elements to enable/disable on resize
    transitionElements = [];

    // Init Functions
    _inverse();
    _initCustomCursor();
    _initNoise();

    function _inverse() {
      document.addEventListener('click', function(e) {
        if (document.body.classList.contains('inverse')) {
          document.body.classList.remove('inverse');
        } else {
          document.body.classList.add('inverse');
        }
      });
    }

    function _initCustomCursor() {
      if (appState.isTouchDevice) {
        return;
      }

      $body.addClass('custom-cursor');
      $body.css('cursor', 'none');
      let lastMousePosition = { x: 0, y: 0 };

      // Update the mouse position
      function onMouseMove(evt) {
        if (!$('#cursor').length) {
          $customCursor = $('<div id="cursor">•</div>').appendTo($body);
        }
        lastMousePosition.x = evt.clientX;
        lastMousePosition.y = evt.clientY;
        requestAnimationFrame(updateCursor);
      }

      function updateCursor() {
        if (!$('#cursor').length) {
          return;
        }
        // Get the element we're hovered on
        let hoveredEl = document.elementFromPoint(lastMousePosition.x, lastMousePosition.y);

        // Check if the element or any of its parents have a .js-cursor class
        if ($(hoveredEl).is('a') || $(hoveredEl).parents('a').length || $(hoveredEl).hasClass('button') || $(hoveredEl).parents('.button').length || $(hoveredEl).is('.cursor-hover') || $(hoveredEl).parents('.cursor-hover').length) {
          $customCursor.attr('style', '');
          $body.addClass('-cursor-active');
        } else {
          $body.removeClass('-cursor-active');
          $customCursor.attr('style', '');
        }

        // Check for a custom cursor data attribute
        if ($(hoveredEl).is('[data-cursor]') || $(hoveredEl).parents('[data-cursor]').length) {
          const style = $(hoveredEl).closest('[data-cursor]').attr('data-cursor');
          $customCursor.attr('class', '');
          $customCursor.addClass('style-' + style);
        } else {
          $customCursor.attr('class', '');
        }

        // now draw object at lastMousePosition
        $customCursor.css({
          'top': lastMousePosition.y + 'px',
          'left': lastMousePosition.x + 'px'
        });
      }

      // Listen for mouse movement
      document.addEventListener('mousemove', onMouseMove, false);
      // Make sure a user is still hovered on an element when they start scrolling
      document.addEventListener('scroll', updateCursor, false);
    }

    function _initNoise() {
      // Taken from https://www.freelancercybersummit.com/events/allyship-and-action

      class Noise {
        constructor(t = document.body, i) {
          document.getElementById("canvas-noise") ||
            ((this.canvas = this.ctx = this.canvasData = this.ctxData = this.imageData = null),
            (this.container = t),
            (this.settings = Object.assign(
              {
                size: 120,
                interval: 3,
                alpha: 20
              },
              i
            )),
            (this.loop = this.loop.bind(this)),
            (this.size = this.size.bind(this)),
            (this.frame = 0),
            (this.animation = null),
            this.init());
        }
        init() {
          (this.canvas = document.createElement("canvas")),
            (this.canvas.id = "canvas-noise"),
            (this.ctx = this.canvas.getContext("2d")),
            this.size(),
            window.addEventListener("resize", this.size),
            this.container.appendChild(this.canvas),
            (this.canvasData = document.createElement("canvas")),
            (this.ctxData = this.canvasData.getContext("2d")),
            (this.canvasData.width = this.settings.size),
            (this.canvasData.height = this.settings.size),
            (this.imageData = this.ctxData.createImageData(
              this.settings.size,
              this.settings.size
            )),
            this.loop();
        }
        size() {
          (this.canvas.width = window.innerWidth),
            (this.canvas.height = window.innerHeight);
        }
        pixel() {
          const t = this.imageData.data.length;
          for (let i = 0; i < t; i += 4) {
            const t = Math.floor(255 * Math.random());
            (this.imageData.data[i] = t),
              (this.imageData.data[i + 1] = t),
              (this.imageData.data[i + 2] = t),
              (this.imageData.data[i + 3] = this.settings.alpha);
          }
          this.ctxData.putImageData(this.imageData, 0, 0);
        }
        draw() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
            (this.ctx.fillStyle = this.ctx.createPattern(this.canvasData, "repeat")),
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        loop() {
          (this.frame += 1),
            this.frame % this.settings.interval == 0 && (this.pixel(), this.draw()),
            (this.animation = window.requestAnimationFrame(this.loop));
        }
        destroy() {
          window.removeEventListener("resize", this.size),
            window.cancelAnimationFrame(this.animation),
            this.canvas.remove();
          for (let t in this) delete this[t];
        }
      }
      var noise = new Noise();
    }

    // Disabling transitions on certain elements on resize
    function _disableTransitions() {
      $.each(transitionElements, function() {
        $(this).css('transition', 'none');
      });
    }

    function _enableTransitions() {
      $.each(transitionElements, function() {
        $(this).attr('style', '');
      });
    }

    function _resize() {
      // Disable transitions when resizing
      _disableTransitions();

      // Functions to run on resize end
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        // Re-enable transitions
        _enableTransitions();
      }, 250);
    }
    $(window).resize(_resize);

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
};
