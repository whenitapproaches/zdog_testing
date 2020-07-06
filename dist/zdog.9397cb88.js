// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/zdog/js/boilerplate.js":[function(require,module,exports) {
/*!
 * Zdog v1.1.2
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2020 Metafizzy
 */

/**
 * Boilerplate & utils
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog = factory();
  }
}( this, function factory() {

var Zdog = {};

Zdog.TAU = Math.PI * 2;

Zdog.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

Zdog.lerp = function( a, b, alpha ) {
  return ( b - a ) * alpha + a;
};

Zdog.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

var powerMultipliers = {
  2: function( a ) {
    return a * a;
  },
  3: function( a ) {
    return a * a * a;
  },
  4: function( a ) {
    return a * a * a * a;
  },
  5: function( a ) {
    return a * a * a * a * a;
  },
};

Zdog.easeInOut = function( alpha, power ) {
  if ( power == 1 ) {
    return alpha;
  }
  alpha = Math.max( 0, Math.min( 1, alpha ) );
  var isFirstHalf = alpha < 0.5;
  var slope = isFirstHalf ? alpha : 1 - alpha;
  slope /= 0.5;
  // make easing steeper with more multiples
  var powerMultiplier = powerMultipliers[ power ] || powerMultipliers[2];
  var curve = powerMultiplier( slope );
  curve /= 2;
  return isFirstHalf ? curve : 1 - curve;
};

return Zdog;

}));

},{}],"../node_modules/zdog/js/canvas-renderer.js":[function(require,module,exports) {
/**
 * CanvasRenderer
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.CanvasRenderer = factory();
  }
}( this, function factory() {

var CanvasRenderer = { isCanvas: true };

CanvasRenderer.begin = function( ctx ) {
  ctx.beginPath();
};

CanvasRenderer.move = function( ctx, elem, point ) {
  ctx.moveTo( point.x, point.y );
};

CanvasRenderer.line = function( ctx, elem, point ) {
  ctx.lineTo( point.x, point.y );
};

CanvasRenderer.bezier = function( ctx, elem, cp0, cp1, end ) {
  ctx.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

CanvasRenderer.closePath = function( ctx ) {
  ctx.closePath();
};

CanvasRenderer.setPath = function() {};

CanvasRenderer.renderPath = function( ctx, elem, pathCommands, isClosed ) {
  this.begin( ctx, elem );
  pathCommands.forEach( function( command ) {
    command.render( ctx, elem, CanvasRenderer );
  });
  if ( isClosed ) {
    this.closePath( ctx, elem );
  }
};

CanvasRenderer.stroke = function( ctx, elem, isStroke, color, lineWidth ) {
  if ( !isStroke ) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

CanvasRenderer.fill = function( ctx, elem, isFill, color ) {
  if ( !isFill ) {
    return;
  }
  ctx.fillStyle = color;
  ctx.fill();
};

CanvasRenderer.end = function() {};

return CanvasRenderer;

}));

},{}],"../node_modules/zdog/js/svg-renderer.js":[function(require,module,exports) {
/**
 * SvgRenderer
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.SvgRenderer = factory();
  }
}( this, function factory() {

var SvgRenderer = { isSvg: true };

// round path coordinates to 3 decimals
var round = SvgRenderer.round = function( num ) {
  return Math.round( num * 1000 ) / 1000;
};

function getPointString( point ) {
  return round( point.x ) + ',' + round( point.y ) + ' ';
}

SvgRenderer.begin = function() {};

SvgRenderer.move = function( svg, elem, point ) {
  return 'M' + getPointString( point );
};

SvgRenderer.line = function( svg, elem, point ) {
  return 'L' + getPointString( point );
};

SvgRenderer.bezier = function( svg, elem, cp0, cp1, end ) {
  return 'C' + getPointString( cp0 ) + getPointString( cp1 ) +
    getPointString( end );
};

SvgRenderer.closePath = function(/* elem */) {
  return 'Z';
};

SvgRenderer.setPath = function( svg, elem, pathValue ) {
  elem.setAttribute( 'd', pathValue );
};

SvgRenderer.renderPath = function( svg, elem, pathCommands, isClosed ) {
  var pathValue = '';
  pathCommands.forEach( function( command ) {
    pathValue += command.render( svg, elem, SvgRenderer );
  });
  if ( isClosed ) {
    pathValue += this.closePath( svg, elem );
  }
  this.setPath( svg, elem, pathValue );
};

SvgRenderer.stroke = function( svg, elem, isStroke, color, lineWidth ) {
  if ( !isStroke ) {
    return;
  }
  elem.setAttribute( 'stroke', color );
  elem.setAttribute( 'stroke-width', lineWidth );
};

SvgRenderer.fill = function( svg, elem, isFill, color ) {
  var fillColor = isFill ? color : 'none';
  elem.setAttribute( 'fill', fillColor );
};

SvgRenderer.end = function( svg, elem ) {
  svg.appendChild( elem );
};

return SvgRenderer;

}));

},{}],"../node_modules/zdog/js/vector.js":[function(require,module,exports) {
/**
 * Vector
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Vector = factory( Zdog );
  }

}( this, function factory( utils ) {

function Vector( position ) {
  this.set( position );
}

var TAU = utils.TAU;

// 'pos' = 'position'
Vector.prototype.set = function( pos ) {
  this.x = pos && pos.x || 0;
  this.y = pos && pos.y || 0;
  this.z = pos && pos.z || 0;
  return this;
};

// set coordinates without sanitizing
// vec.write({ y: 2 }) only sets y coord
Vector.prototype.write = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x = pos.x != undefined ? pos.x : this.x;
  this.y = pos.y != undefined ? pos.y : this.y;
  this.z = pos.z != undefined ? pos.z : this.z;
  return this;
};

Vector.prototype.rotate = function( rotation ) {
  if ( !rotation ) {
    return;
  }
  this.rotateZ( rotation.z );
  this.rotateY( rotation.y );
  this.rotateX( rotation.x );
  return this;
};

Vector.prototype.rotateZ = function( angle ) {
  rotateProperty( this, angle, 'x', 'y' );
};

Vector.prototype.rotateX = function( angle ) {
  rotateProperty( this, angle, 'y', 'z' );
};

Vector.prototype.rotateY = function( angle ) {
  rotateProperty( this, angle, 'x', 'z' );
};

function rotateProperty( vec, angle, propA, propB ) {
  if ( !angle || angle % TAU === 0 ) {
    return;
  }
  var cos = Math.cos( angle );
  var sin = Math.sin( angle );
  var a = vec[ propA ];
  var b = vec[ propB ];
  vec[ propA ] = a*cos - b*sin;
  vec[ propB ] = b*cos + a*sin;
}

Vector.prototype.isSame = function( pos ) {
  if ( !pos ) {
    return false;
  }
  return this.x === pos.x && this.y === pos.y && this.z === pos.z;
};

Vector.prototype.add = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x += pos.x || 0;
  this.y += pos.y || 0;
  this.z += pos.z || 0;
  return this;
};

Vector.prototype.subtract = function( pos ) {
  if ( !pos ) {
    return this;
  }
  this.x -= pos.x || 0;
  this.y -= pos.y || 0;
  this.z -= pos.z || 0;
  return this;
};

Vector.prototype.multiply = function( pos ) {
  if ( pos == undefined ) {
    return this;
  }
  // multiple all values by same number
  if ( typeof pos == 'number' ) {
    this.x *= pos;
    this.y *= pos;
    this.z *= pos;
  } else {
    // multiply object
    this.x *= pos.x != undefined ? pos.x : 1;
    this.y *= pos.y != undefined ? pos.y : 1;
    this.z *= pos.z != undefined ? pos.z : 1;
  }
  return this;
};

Vector.prototype.transform = function( translation, rotation, scale ) {
  this.multiply( scale );
  this.rotate( rotation );
  this.add( translation );
  return this;
};

Vector.prototype.lerp = function( pos, alpha ) {
  this.x = utils.lerp( this.x, pos.x || 0, alpha );
  this.y = utils.lerp( this.y, pos.y || 0, alpha );
  this.z = utils.lerp( this.z, pos.z || 0, alpha );
  return this;
};

Vector.prototype.magnitude = function() {
  var sum = this.x*this.x + this.y*this.y + this.z*this.z;
  return getMagnitudeSqrt( sum );
};

function getMagnitudeSqrt( sum ) {
  // PERF: check if sum ~= 1 and skip sqrt
  if ( Math.abs( sum - 1 ) < 0.00000001 ) {
    return 1;
  }
  return Math.sqrt( sum );
}

Vector.prototype.magnitude2d = function() {
  var sum = this.x*this.x + this.y*this.y;
  return getMagnitudeSqrt( sum );
};

Vector.prototype.copy = function() {
  return new Vector( this );
};

return Vector;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js"}],"../node_modules/zdog/js/anchor.js":[function(require,module,exports) {
/**
 * Anchor
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./canvas-renderer'), require('./svg-renderer') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Anchor = factory( Zdog, Zdog.Vector, Zdog.CanvasRenderer,
        Zdog.SvgRenderer );
  }
}( this, function factory( utils, Vector, CanvasRenderer, SvgRenderer ) {

var TAU = utils.TAU;
var onePoint = { x: 1, y: 1, z: 1 };

function Anchor( options ) {
  this.create( options || {} );
}

Anchor.prototype.create = function( options ) {
  this.children = [];
  // set defaults & options
  utils.extend( this, this.constructor.defaults );
  this.setOptions( options );

  // transform
  this.translate = new Vector( options.translate );
  this.rotate = new Vector( options.rotate );
  this.scale = new Vector( onePoint ).multiply( this.scale );
  // origin
  this.origin = new Vector();
  this.renderOrigin = new Vector();

  if ( this.addTo ) {
    this.addTo.addChild( this );
  }
};

Anchor.defaults = {};

Anchor.optionKeys = Object.keys( Anchor.defaults ).concat([
  'rotate',
  'translate',
  'scale',
  'addTo',
]);

Anchor.prototype.setOptions = function( options ) {
  var optionKeys = this.constructor.optionKeys;

  for ( var key in options ) {
    if ( optionKeys.indexOf( key ) != -1 ) {
      this[ key ] = options[ key ];
    }
  }
};

Anchor.prototype.addChild = function( shape ) {
  if ( this.children.indexOf( shape ) != -1 ) {
    return;
  }
  shape.remove(); // remove previous parent
  shape.addTo = this; // keep parent reference
  this.children.push( shape );
};

Anchor.prototype.removeChild = function( shape ) {
  var index = this.children.indexOf( shape );
  if ( index != -1 ) {
    this.children.splice( index, 1 );
  }
};

Anchor.prototype.remove = function() {
  if ( this.addTo ) {
    this.addTo.removeChild( this );
  }
};

// ----- update ----- //

Anchor.prototype.update = function() {
  // update self
  this.reset();
  // update children
  this.children.forEach( function( child ) {
    child.update();
  });
  this.transform( this.translate, this.rotate, this.scale );
};

Anchor.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
};

Anchor.prototype.transform = function( translation, rotation, scale ) {
  this.renderOrigin.transform( translation, rotation, scale );
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};

Anchor.prototype.updateGraph = function() {
  this.update();
  this.updateFlatGraph();
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
  });
  // z-sort
  this.flatGraph.sort( Anchor.shapeSorter );
};

Anchor.shapeSorter = function( a, b ) {
  return a.sortValue - b.sortValue;
};

// custom getter to check for flatGraph before using it
Object.defineProperty( Anchor.prototype, 'flatGraph', {
  get: function() {
    if ( !this._flatGraph ) {
      this.updateFlatGraph();
    }
    return this._flatGraph;
  },
  set: function( graph ) {
    this._flatGraph = graph;
  },
});

Anchor.prototype.updateFlatGraph = function() {
  this.flatGraph = this.getFlatGraph();
};

// return Array of self & all child graph items
Anchor.prototype.getFlatGraph = function() {
  var flatGraph = [ this ];
  return this.addChildFlatGraph( flatGraph );
};

Anchor.prototype.addChildFlatGraph = function( flatGraph ) {
  this.children.forEach( function( child ) {
    var childFlatGraph = child.getFlatGraph();
    Array.prototype.push.apply( flatGraph, childFlatGraph );
  });
  return flatGraph;
};

Anchor.prototype.updateSortValue = function() {
  this.sortValue = this.renderOrigin.z;
};

// ----- render ----- //

Anchor.prototype.render = function() {};

// TODO refactor out CanvasRenderer so its not a dependency within anchor.js
Anchor.prototype.renderGraphCanvas = function( ctx ) {
  if ( !ctx ) {
    throw new Error( 'ctx is ' + ctx + '. ' +
      'Canvas context required for render. Check .renderGraphCanvas( ctx ).' );
  }
  this.flatGraph.forEach( function( item ) {
    item.render( ctx, CanvasRenderer );
  });
};

Anchor.prototype.renderGraphSvg = function( svg ) {
  if ( !svg ) {
    throw new Error( 'svg is ' + svg + '. ' +
      'SVG required for render. Check .renderGraphSvg( svg ).' );
  }
  this.flatGraph.forEach( function( item ) {
    item.render( svg, SvgRenderer );
  });
};

// ----- misc ----- //

Anchor.prototype.copy = function( options ) {
  // copy options
  var itemOptions = {};
  var optionKeys = this.constructor.optionKeys;
  optionKeys.forEach( function( key ) {
    itemOptions[ key ] = this[ key ];
  }, this );
  // add set options
  utils.extend( itemOptions, options );
  var ItemClass = this.constructor;
  return new ItemClass( itemOptions );
};

Anchor.prototype.copyGraph = function( options ) {
  var clone = this.copy( options );
  this.children.forEach( function( child ) {
    child.copyGraph({
      addTo: clone,
    });
  });
  return clone;
};

Anchor.prototype.normalizeRotate = function() {
  this.rotate.x = utils.modulo( this.rotate.x, TAU );
  this.rotate.y = utils.modulo( this.rotate.y, TAU );
  this.rotate.z = utils.modulo( this.rotate.z, TAU );
};

// ----- subclass ----- //

function getSubclass( Super ) {
  return function( defaults ) {
    // create constructor
    function Item( options ) {
      this.create( options || {} );
    }

    Item.prototype = Object.create( Super.prototype );
    Item.prototype.constructor = Item;

    Item.defaults = utils.extend( {}, Super.defaults );
    utils.extend( Item.defaults, defaults );
    // create optionKeys
    Item.optionKeys = Super.optionKeys.slice(0);
    // add defaults keys to optionKeys, dedupe
    Object.keys( Item.defaults ).forEach( function( key ) {
      if ( !Item.optionKeys.indexOf( key ) != 1 ) {
        Item.optionKeys.push( key );
      }
    });

    Item.subclass = getSubclass( Item );

    return Item;
  };
}

Anchor.subclass = getSubclass( Anchor );

return Anchor;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./vector":"../node_modules/zdog/js/vector.js","./canvas-renderer":"../node_modules/zdog/js/canvas-renderer.js","./svg-renderer":"../node_modules/zdog/js/svg-renderer.js"}],"../node_modules/zdog/js/dragger.js":[function(require,module,exports) {
/**
 * Dragger
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.Dragger = factory();
  }
}( this, function factory() {

// quick & dirty drag event stuff
// messes up if multiple pointers/touches

// check for browser window #85
var hasWindow = typeof window != 'undefined';
// event support, default to mouse events
var downEvent = 'mousedown';
var moveEvent = 'mousemove';
var upEvent = 'mouseup';
if ( hasWindow ) {
  if ( window.PointerEvent ) {
    // PointerEvent, Chrome
    downEvent = 'pointerdown';
    moveEvent = 'pointermove';
    upEvent = 'pointerup';
  } else if ( 'ontouchstart' in window ) {
    // Touch Events, iOS Safari
    downEvent = 'touchstart';
    moveEvent = 'touchmove';
    upEvent = 'touchend';
  }
}

function noop() {}

function Dragger( options ) {
  this.create( options || {} );
}

Dragger.prototype.create = function( options ) {
  this.onDragStart = options.onDragStart || noop;
  this.onDragMove = options.onDragMove || noop;
  this.onDragEnd = options.onDragEnd || noop;

  this.bindDrag( options.startElement );
};

Dragger.prototype.bindDrag = function( element ) {
  element = this.getQueryElement( element );
  if ( !element ) {
    return;
  }
  // disable browser gestures #53
  element.style.touchAction = 'none';
  element.addEventListener( downEvent, this );
};

Dragger.prototype.getQueryElement = function( element ) {
  if ( typeof element == 'string' ) {
    // with string, query selector
    element = document.querySelector( element );
  }
  return element;
};

Dragger.prototype.handleEvent = function( event ) {
  var method = this[ 'on' + event.type ];
  if ( method ) {
    method.call( this, event );
  }
};

Dragger.prototype.onmousedown =
Dragger.prototype.onpointerdown = function( event ) {
  this.dragStart( event, event );
};

Dragger.prototype.ontouchstart = function( event ) {
  this.dragStart( event, event.changedTouches[0] );
};

Dragger.prototype.dragStart = function( event, pointer ) {
  event.preventDefault();
  this.dragStartX = pointer.pageX;
  this.dragStartY = pointer.pageY;
  if ( hasWindow ) {
    window.addEventListener( moveEvent, this );
    window.addEventListener( upEvent, this );
  }
  this.onDragStart( pointer );
};

Dragger.prototype.ontouchmove = function( event ) {
  // HACK, moved touch may not be first
  this.dragMove( event, event.changedTouches[0] );
};

Dragger.prototype.onmousemove =
Dragger.prototype.onpointermove = function( event ) {
  this.dragMove( event, event );
};

Dragger.prototype.dragMove = function( event, pointer ) {
  event.preventDefault();
  var moveX = pointer.pageX - this.dragStartX;
  var moveY = pointer.pageY - this.dragStartY;
  this.onDragMove( pointer, moveX, moveY );
};

Dragger.prototype.onmouseup =
Dragger.prototype.onpointerup =
Dragger.prototype.ontouchend =
Dragger.prototype.dragEnd = function(/* event */) {
  window.removeEventListener( moveEvent, this );
  window.removeEventListener( upEvent, this );
  this.onDragEnd();
};

return Dragger;

}));

},{}],"../node_modules/zdog/js/illustration.js":[function(require,module,exports) {
/**
 * Illustration
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./anchor'),
        require('./dragger') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Illustration = factory( Zdog, Zdog.Anchor, Zdog.Dragger );
  }
}( this, function factory( utils, Anchor, Dragger ) {

function noop() {}
var TAU = utils.TAU;

var Illustration = Anchor.subclass({
  element: undefined,
  centered: true,
  zoom: 1,
  dragRotate: false,
  resize: false,
  onPrerender: noop,
  onDragStart: noop,
  onDragMove: noop,
  onDragEnd: noop,
  onResize: noop,
});

utils.extend( Illustration.prototype, Dragger.prototype );

Illustration.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  Dragger.prototype.create.call( this, options );
  this.setElement( this.element );
  this.setDragRotate( this.dragRotate );
  this.setResize( this.resize );
};

Illustration.prototype.setElement = function( element ) {
  element = this.getQueryElement( element );
  if ( !element ) {
    throw new Error( 'Zdog.Illustration element required. Set to ' + element );
  }

  var nodeName = element.nodeName.toLowerCase();
  if ( nodeName == 'canvas' ) {
    this.setCanvas( element );
  } else if ( nodeName == 'svg' ) {
    this.setSvg( element );
  }
};

Illustration.prototype.setSize = function( width, height ) {
  width = Math.round( width );
  height = Math.round( height );
  if ( this.isCanvas ) {
    this.setSizeCanvas( width, height );
  } else if ( this.isSvg ) {
    this.setSizeSvg( width, height );
  }
};

Illustration.prototype.setResize = function( resize ) {
  this.resize = resize;
  // create resize event listener
  if ( !this.resizeListener ) {
    this.resizeListener = this.onWindowResize.bind( this );
  }
  // add/remove event listener
  if ( resize ) {
    window.addEventListener( 'resize', this.resizeListener );
    this.onWindowResize();
  } else {
    window.removeEventListener( 'resize', this.resizeListener );
  }
};

// TODO debounce this?
Illustration.prototype.onWindowResize = function() {
  this.setMeasuredSize();
  this.onResize( this.width, this.height );
};

Illustration.prototype.setMeasuredSize = function() {
  var width, height;
  var isFullscreen = this.resize == 'fullscreen';
  if ( isFullscreen ) {
    width = window.innerWidth;
    height = window.innerHeight;
  } else {
    var rect = this.element.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
  }
  this.setSize( width, height );
};

// ----- render ----- //

Illustration.prototype.renderGraph = function( item ) {
  if ( this.isCanvas ) {
    this.renderGraphCanvas( item );
  } else if ( this.isSvg ) {
    this.renderGraphSvg( item );
  }
};

// combo method
Illustration.prototype.updateRenderGraph = function( item ) {
  this.updateGraph();
  this.renderGraph( item );
};

// ----- canvas ----- //

Illustration.prototype.setCanvas = function( element ) {
  this.element = element;
  this.isCanvas = true;
  // update related properties
  this.ctx = this.element.getContext('2d');
  // set initial size
  this.setSizeCanvas( element.width, element.height );
};

Illustration.prototype.setSizeCanvas = function( width, height ) {
  this.width = width;
  this.height = height;
  // up-rez for hi-DPI devices
  var pixelRatio = this.pixelRatio = window.devicePixelRatio || 1;
  this.element.width = this.canvasWidth = width * pixelRatio;
  this.element.height = this.canvasHeight = height * pixelRatio;
  var needsHighPixelRatioSizing = pixelRatio > 1 && !this.resize;
  if ( needsHighPixelRatioSizing ) {
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
  }
};

Illustration.prototype.renderGraphCanvas = function( item ) {
  item = item || this;
  this.prerenderCanvas();
  Anchor.prototype.renderGraphCanvas.call( item, this.ctx );
  this.postrenderCanvas();
};

Illustration.prototype.prerenderCanvas = function() {
  var ctx = this.ctx;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );
  ctx.save();
  if ( this.centered ) {
    var centerX = this.width/2 * this.pixelRatio;
    var centerY = this.height/2 * this.pixelRatio;
    ctx.translate( centerX, centerY );
  }
  var scale = this.pixelRatio * this.zoom;
  ctx.scale( scale, scale );
  this.onPrerender( ctx );
};

Illustration.prototype.postrenderCanvas = function() {
  this.ctx.restore();
};

// ----- svg ----- //

Illustration.prototype.setSvg = function( element ) {
  this.element = element;
  this.isSvg = true;
  this.pixelRatio = 1;
  // set initial size from width & height attributes
  var width = element.getAttribute('width');
  var height = element.getAttribute('height');
  this.setSizeSvg( width, height );
};

Illustration.prototype.setSizeSvg = function( width, height ) {
  this.width = width;
  this.height = height;
  var viewWidth = width / this.zoom;
  var viewHeight = height / this.zoom;
  var viewX = this.centered ? -viewWidth/2 : 0;
  var viewY = this.centered ? -viewHeight/2 : 0;
  this.element.setAttribute( 'viewBox', viewX + ' ' + viewY + ' ' +
    viewWidth + ' ' + viewHeight );
  if ( this.resize ) {
    // remove size attributes, let size be determined by viewbox
    this.element.removeAttribute('width');
    this.element.removeAttribute('height');
  } else {
    this.element.setAttribute( 'width', width );
    this.element.setAttribute( 'height', height );
  }
};

Illustration.prototype.renderGraphSvg = function( item ) {
  item = item || this;
  empty( this.element );
  this.onPrerender( this.element );
  Anchor.prototype.renderGraphSvg.call( item, this.element );
};

function empty( element ) {
  while ( element.firstChild ) {
    element.removeChild( element.firstChild );
  }
}

// ----- drag ----- //

Illustration.prototype.setDragRotate = function( item ) {
  if ( !item ) {
    return;
  } else if ( item === true ) {
    /* eslint consistent-this: "off" */
    item = this;
  }
  this.dragRotate = item;

  this.bindDrag( this.element );
};

Illustration.prototype.dragStart = function(/* event, pointer */) {
  this.dragStartRX = this.dragRotate.rotate.x;
  this.dragStartRY = this.dragRotate.rotate.y;
  Dragger.prototype.dragStart.apply( this, arguments );
};

Illustration.prototype.dragMove = function( event, pointer ) {
  var moveX = pointer.pageX - this.dragStartX;
  var moveY = pointer.pageY - this.dragStartY;
  var displaySize = Math.min( this.width, this.height );
  var moveRY = moveX / displaySize * TAU;
  var moveRX = moveY / displaySize * TAU;
  this.dragRotate.rotate.x = this.dragStartRX - moveRX;
  this.dragRotate.rotate.y = this.dragStartRY - moveRY;
  Dragger.prototype.dragMove.apply( this, arguments );
};

return Illustration;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./anchor":"../node_modules/zdog/js/anchor.js","./dragger":"../node_modules/zdog/js/dragger.js"}],"../node_modules/zdog/js/path-command.js":[function(require,module,exports) {
/**
 * PathCommand
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./vector') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.PathCommand = factory( Zdog.Vector );
  }
}( this, function factory( Vector ) {

function PathCommand( method, points, previousPoint ) {
  this.method = method;
  this.points = points.map( mapVectorPoint );
  this.renderPoints = points.map( mapNewVector );
  this.previousPoint = previousPoint;
  this.endRenderPoint = this.renderPoints[ this.renderPoints.length - 1 ];
  // arc actions come with previous point & corner point
  // but require bezier control points
  if ( method == 'arc' ) {
    this.controlPoints = [ new Vector(), new Vector() ];
  }
}

function mapVectorPoint( point ) {
  if ( point instanceof Vector ) {
    return point;
  } else {
    return new Vector( point );
  }
}

function mapNewVector( point ) {
  return new Vector( point );
}

PathCommand.prototype.reset = function() {
  // reset renderPoints back to orignal points position
  var points = this.points;
  this.renderPoints.forEach( function( renderPoint, i ) {
    var point = points[i];
    renderPoint.set( point );
  });
};

PathCommand.prototype.transform = function( translation, rotation, scale ) {
  this.renderPoints.forEach( function( renderPoint ) {
    renderPoint.transform( translation, rotation, scale );
  });
};

PathCommand.prototype.render = function( ctx, elem, renderer ) {
  return this[ this.method ]( ctx, elem, renderer );
};

PathCommand.prototype.move = function( ctx, elem, renderer ) {
  return renderer.move( ctx, elem, this.renderPoints[0] );
};

PathCommand.prototype.line = function( ctx, elem, renderer ) {
  return renderer.line( ctx, elem, this.renderPoints[0] );
};

PathCommand.prototype.bezier = function( ctx, elem, renderer ) {
  var cp0 = this.renderPoints[0];
  var cp1 = this.renderPoints[1];
  var end = this.renderPoints[2];
  return renderer.bezier( ctx, elem, cp0, cp1, end );
};

var arcHandleLength = 9/16;

PathCommand.prototype.arc = function( ctx, elem, renderer ) {
  var prev = this.previousPoint;
  var corner = this.renderPoints[0];
  var end = this.renderPoints[1];
  var cp0 = this.controlPoints[0];
  var cp1 = this.controlPoints[1];
  cp0.set( prev ).lerp( corner, arcHandleLength );
  cp1.set( end ).lerp( corner, arcHandleLength );
  return renderer.bezier( ctx, elem, cp0, cp1, end );
};

return PathCommand;

}));

},{"./vector":"../node_modules/zdog/js/vector.js"}],"../node_modules/zdog/js/shape.js":[function(require,module,exports) {
/**
 * Shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./path-command'), require('./anchor') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Shape = factory( Zdog, Zdog.Vector, Zdog.PathCommand, Zdog.Anchor );
  }
}( this, function factory( utils, Vector, PathCommand, Anchor ) {

var Shape = Anchor.subclass({
  stroke: 1,
  fill: false,
  color: '#333',
  closed: true,
  visible: true,
  path: [ {} ],
  front: { z: 1 },
  backface: true,
});

Shape.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
  // front
  this.front = new Vector( options.front || this.front );
  this.renderFront = new Vector( this.front );
  this.renderNormal = new Vector();
};

var actionNames = [
  'move',
  'line',
  'bezier',
  'arc',
];

Shape.prototype.updatePath = function() {
  this.setPath();
  this.updatePathCommands();
};

// place holder for Ellipse, Rect, etc.
Shape.prototype.setPath = function() {};

// parse path into PathCommands
Shape.prototype.updatePathCommands = function() {
  var previousPoint;
  this.pathCommands = this.path.map( function( pathPart, i ) {
    // pathPart can be just vector coordinates -> { x, y, z }
    // or path instruction -> { arc: [ {x0,y0,z0}, {x1,y1,z1} ] }
    var keys = Object.keys( pathPart );
    var method = keys[0];
    var points = pathPart[ method ];
    // default to line if no instruction
    var isInstruction = keys.length == 1 && actionNames.indexOf( method ) != -1;
    if ( !isInstruction ) {
      method = 'line';
      points = pathPart;
    }
    // munge single-point methods like line & move without arrays
    var isLineOrMove = method == 'line' || method == 'move';
    var isPointsArray = Array.isArray( points );
    if ( isLineOrMove && !isPointsArray ) {
      points = [ points ];
    }

    // first action is always move
    method = i === 0 ? 'move' : method;
    // arcs require previous last point
    var command = new PathCommand( method, points, previousPoint );
    // update previousLastPoint
    previousPoint = command.endRenderPoint;
    return command;
  });
};

// ----- update ----- //

Shape.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  // reset command render points
  this.pathCommands.forEach( function( command ) {
    command.reset();
  });
};

Shape.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathCommands.forEach( function( command ) {
    command.transform( translation, rotation, scale );
  });
  // transform children
  this.children.forEach( function( child ) {
    child.transform( translation, rotation, scale );
  });
};

Shape.prototype.updateSortValue = function() {
  // sort by average z of all points
  // def not geometrically correct, but works for me
  var pointCount = this.pathCommands.length;
  var firstPoint = this.pathCommands[0].endRenderPoint;
  var lastPoint = this.pathCommands[ pointCount - 1 ].endRenderPoint;
  // ignore the final point if self closing shape
  var isSelfClosing = pointCount > 2 && firstPoint.isSame( lastPoint );
  if ( isSelfClosing ) {
    pointCount -= 1;
  }

  var sortValueTotal = 0;
  for ( var i = 0; i < pointCount; i++ ) {
    sortValueTotal += this.pathCommands[i].endRenderPoint.z;
  }
  this.sortValue = sortValueTotal / pointCount;
};

// ----- render ----- //

Shape.prototype.render = function( ctx, renderer ) {
  var length = this.pathCommands.length;
  if ( !this.visible || !length ) {
    return;
  }
  // do not render if hiding backface
  this.isFacingBack = this.renderNormal.z > 0;
  if ( !this.backface && this.isFacingBack ) {
    return;
  }
  if ( !renderer ) {
    throw new Error( 'Zdog renderer required. Set to ' + renderer );
  }
  // render dot or path
  var isDot = length == 1;
  if ( renderer.isCanvas && isDot ) {
    this.renderCanvasDot( ctx, renderer );
  } else {
    this.renderPath( ctx, renderer );
  }
};

var TAU = utils.TAU;
// Safari does not render lines with no size, have to render circle instead
Shape.prototype.renderCanvasDot = function( ctx ) {
  var lineWidth = this.getLineWidth();
  if ( !lineWidth ) {
    return;
  }
  ctx.fillStyle = this.getRenderColor();
  var point = this.pathCommands[0].endRenderPoint;
  ctx.beginPath();
  var radius = lineWidth/2;
  ctx.arc( point.x, point.y, radius, 0, TAU );
  ctx.fill();
};

Shape.prototype.getLineWidth = function() {
  if ( !this.stroke ) {
    return 0;
  }
  if ( this.stroke == true ) {
    return 1;
  }
  return this.stroke;
};

Shape.prototype.getRenderColor = function() {
  // use backface color if applicable
  var isBackfaceColor = typeof this.backface == 'string' && this.isFacingBack;
  var color = isBackfaceColor ? this.backface : this.color;
  return color;
};

Shape.prototype.renderPath = function( ctx, renderer ) {
  var elem = this.getRenderElement( ctx, renderer );
  var isTwoPoints = this.pathCommands.length == 2 &&
    this.pathCommands[1].method == 'line';
  var isClosed = !isTwoPoints && this.closed;
  var color = this.getRenderColor();

  renderer.renderPath( ctx, elem, this.pathCommands, isClosed );
  renderer.stroke( ctx, elem, this.stroke, color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Shape.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path');
    this.svgElement.setAttribute( 'stroke-linecap', 'round' );
    this.svgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.svgElement;
};

return Shape;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./vector":"../node_modules/zdog/js/vector.js","./path-command":"../node_modules/zdog/js/path-command.js","./anchor":"../node_modules/zdog/js/anchor.js"}],"../node_modules/zdog/js/group.js":[function(require,module,exports) {
/**
 * Group
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./anchor') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Group = factory( Zdog.Anchor );
  }
}( this, function factory( Anchor ) {

var Group = Anchor.subclass({
  updateSort: false,
  visible: true,
});

// ----- update ----- //

Group.prototype.updateSortValue = function() {
  var sortValueTotal = 0;
  this.flatGraph.forEach( function( item ) {
    item.updateSortValue();
    sortValueTotal += item.sortValue;
  });
  // average sort value of all points
  // def not geometrically correct, but works for me
  this.sortValue = sortValueTotal / this.flatGraph.length;

  if ( this.updateSort ) {
    this.flatGraph.sort( Anchor.shapeSorter );
  }
};

// ----- render ----- //

Group.prototype.render = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }

  this.flatGraph.forEach( function( item ) {
    item.render( ctx, renderer );
  });
};

// actual group flatGraph only used inside group
Group.prototype.updateFlatGraph = function() {
  // do not include self
  var flatGraph = [];
  this.flatGraph = this.addChildFlatGraph( flatGraph );
};

// do not include children, group handles rendering & sorting internally
Group.prototype.getFlatGraph = function() {
  return [ this ];
};

return Group;

}));

},{"./anchor":"../node_modules/zdog/js/anchor.js"}],"../node_modules/zdog/js/rect.js":[function(require,module,exports) {
/**
 * Rect
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Rect = factory( Zdog.Shape );
  }
}( this, function factory( Shape ) {

var Rect = Shape.subclass({
  width: 1,
  height: 1,
});

Rect.prototype.setPath = function() {
  var x = this.width / 2;
  var y = this.height / 2;
  /* eslint key-spacing: "off" */
  this.path = [
    { x: -x, y: -y },
    { x:  x, y: -y },
    { x:  x, y:  y },
    { x: -x, y:  y },
  ];
};

return Rect;

}));

},{"./shape":"../node_modules/zdog/js/shape.js"}],"../node_modules/zdog/js/rounded-rect.js":[function(require,module,exports) {
/**
 * RoundedRect
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.RoundedRect = factory( Zdog.Shape );
  }
}( this, function factory( Shape ) {

var RoundedRect = Shape.subclass({
  width: 1,
  height: 1,
  cornerRadius: 0.25,
  closed: false,
});

RoundedRect.prototype.setPath = function() {
  /* eslint
     id-length: [ "error", { "min": 2, "exceptions": [ "x", "y" ] }],
     key-spacing: "off" */
  var xA = this.width / 2;
  var yA = this.height / 2;
  var shortSide = Math.min( xA, yA );
  var cornerRadius = Math.min( this.cornerRadius, shortSide );
  var xB = xA - cornerRadius;
  var yB = yA - cornerRadius;
  var path = [
    // top right corner
    { x: xB, y: -yA },
    { arc: [
      { x: xA, y: -yA },
      { x: xA, y: -yB },
    ]},
  ];
  // bottom right corner
  if ( yB ) {
    path.push({ x: xA, y: yB });
  }
  path.push({ arc: [
    { x: xA, y:  yA },
    { x: xB, y:  yA },
  ]});
  // bottom left corner
  if ( xB ) {
    path.push({ x: -xB, y: yA });
  }
  path.push({ arc: [
    { x: -xA, y:  yA },
    { x: -xA, y:  yB },
  ]});
  // top left corner
  if ( yB ) {
    path.push({ x: -xA, y: -yB });
  }
  path.push({ arc: [
    { x: -xA, y: -yA },
    { x: -xB, y: -yA },
  ]});

  // back to top right corner
  if ( xB ) {
    path.push({ x: xB, y: -yA });
  }

  this.path = path;
};

return RoundedRect;

}));

},{"./shape":"../node_modules/zdog/js/shape.js"}],"../node_modules/zdog/js/ellipse.js":[function(require,module,exports) {
/**
 * Ellipse
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Ellipse = factory( Zdog.Shape );
  }

}( this, function factory( Shape ) {

var Ellipse = Shape.subclass({
  diameter: 1,
  width: undefined,
  height: undefined,
  quarters: 4,
  closed: false,
});

Ellipse.prototype.setPath = function() {
  var width = this.width != undefined ? this.width : this.diameter;
  var height = this.height != undefined ? this.height : this.diameter;
  var x = width / 2;
  var y = height / 2;
  this.path = [
    { x: 0, y: -y },
    { arc: [ // top right
      { x: x, y: -y },
      { x: x, y: 0 },
    ]},
  ];
  // bottom right
  if ( this.quarters > 1 ) {
    this.path.push({ arc: [
      { x: x, y: y },
      { x: 0, y: y },
    ]});
  }
  // bottom left
  if ( this.quarters > 2 ) {
    this.path.push({ arc: [
      { x: -x, y: y },
      { x: -x, y: 0 },
    ]});
  }
  // top left
  if ( this.quarters > 3 ) {
    this.path.push({ arc: [
      { x: -x, y: -y },
      { x: 0, y: -y },
    ]});
  }
};

return Ellipse;

}));

},{"./shape":"../node_modules/zdog/js/shape.js"}],"../node_modules/zdog/js/polygon.js":[function(require,module,exports) {
/**
 * Shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./shape') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Polygon = factory( Zdog, Zdog.Shape );
  }
}( this, function factory( utils, Shape ) {

var Polygon = Shape.subclass({
  sides: 3,
  radius: 0.5,
});

var TAU = utils.TAU;

Polygon.prototype.setPath = function() {
  this.path = [];
  for ( var i=0; i < this.sides; i++ ) {
    var theta = i/this.sides * TAU - TAU/4;
    var x = Math.cos( theta ) * this.radius;
    var y = Math.sin( theta ) * this.radius;
    this.path.push({ x: x, y: y });
  }
};

return Polygon;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./shape":"../node_modules/zdog/js/shape.js"}],"../node_modules/zdog/js/hemisphere.js":[function(require,module,exports) {
/**
 * Hemisphere composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./anchor'), require('./ellipse') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Hemisphere = factory( Zdog, Zdog.Vector, Zdog.Anchor, Zdog.Ellipse );
  }
}( this, function factory( utils, Vector, Anchor, Ellipse ) {

var Hemisphere = Ellipse.subclass({
  fill: true,
});

var TAU = utils.TAU;

Hemisphere.prototype.create = function(/* options */) {
  // call super
  Ellipse.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Anchor({
    addTo: this,
    translate: { z: this.diameter/2 },
  });
  // vector used for calculation
  this.renderCentroid = new Vector();
};

Hemisphere.prototype.updateSortValue = function() {
  // centroid of hemisphere is 3/8 between origin and apex
  this.renderCentroid.set( this.renderOrigin )
    .lerp( this.apex.renderOrigin, 3/8 );
  this.sortValue = this.renderCentroid.z;
};

Hemisphere.prototype.render = function( ctx, renderer ) {
  this.renderDome( ctx, renderer );
  // call super
  Ellipse.prototype.render.apply( this, arguments );
};

Hemisphere.prototype.renderDome = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  var elem = this.getDomeRenderElement( ctx, renderer );
  var contourAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x );
  var domeRadius = this.diameter/2 * this.renderNormal.magnitude();
  var x = this.renderOrigin.x;
  var y = this.renderOrigin.y;

  if ( renderer.isCanvas ) {
    // canvas
    var startAngle = contourAngle + TAU/4;
    var endAngle = contourAngle - TAU/4;
    ctx.beginPath();
    ctx.arc( x, y, domeRadius, startAngle, endAngle );
  } else if ( renderer.isSvg ) {
    // svg
    contourAngle = (contourAngle - TAU/4) / TAU * 360;
    this.domeSvgElement.setAttribute( 'd', 'M ' + -domeRadius + ',0 A ' +
        domeRadius + ',' + domeRadius + ' 0 0 1 ' + domeRadius + ',0' );
    this.domeSvgElement.setAttribute( 'transform',
        'translate(' + x + ',' + y + ' ) rotate(' + contourAngle + ')' );
  }

  renderer.stroke( ctx, elem, this.stroke, this.color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, this.color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Hemisphere.prototype.getDomeRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.domeSvgElement ) {
    // create svgElement
    this.domeSvgElement = document.createElementNS( svgURI, 'path');
    this.domeSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.domeSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.domeSvgElement;
};

return Hemisphere;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./vector":"../node_modules/zdog/js/vector.js","./anchor":"../node_modules/zdog/js/anchor.js","./ellipse":"../node_modules/zdog/js/ellipse.js"}],"../node_modules/zdog/js/cylinder.js":[function(require,module,exports) {
/**
 * Cylinder composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'),
        require('./path-command'), require('./shape'), require('./group'),
        require('./ellipse') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Cylinder = factory( Zdog, Zdog.PathCommand, Zdog.Shape,
        Zdog.Group, Zdog.Ellipse );
  }
}( this, function factory( utils, PathCommand, Shape, Group, Ellipse ) {

function noop() {}

// ----- CylinderGroup ----- //

var CylinderGroup = Group.subclass({
  color: '#333',
  updateSort: true,
});

CylinderGroup.prototype.create = function() {
  Group.prototype.create.apply( this, arguments );
  this.pathCommands = [
    new PathCommand( 'move', [ {} ] ),
    new PathCommand( 'line', [ {} ] ),
  ];
};

CylinderGroup.prototype.render = function( ctx, renderer ) {
  this.renderCylinderSurface( ctx, renderer );
  Group.prototype.render.apply( this, arguments );
};

CylinderGroup.prototype.renderCylinderSurface = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  // render cylinder surface
  var elem = this.getRenderElement( ctx, renderer );
  var frontBase = this.frontBase;
  var rearBase = this.rearBase;
  var scale = frontBase.renderNormal.magnitude();
  var strokeWidth = frontBase.diameter * scale + frontBase.getLineWidth();
  // set path command render points
  this.pathCommands[0].renderPoints[0].set( frontBase.renderOrigin );
  this.pathCommands[1].renderPoints[0].set( rearBase.renderOrigin );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'butt'; // nice
  }
  renderer.renderPath( ctx, elem, this.pathCommands );
  renderer.stroke( ctx, elem, true, this.color, strokeWidth );
  renderer.end( ctx, elem );

  if ( renderer.isCanvas ) {
    ctx.lineCap = 'round'; // reset
  }
};

var svgURI = 'http://www.w3.org/2000/svg';

CylinderGroup.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path');
  }
  return this.svgElement;
};

// prevent double-creation in parent.copyGraph()
// only create in Cylinder.create()
CylinderGroup.prototype.copyGraph = noop;

// ----- CylinderEllipse ----- //

var CylinderEllipse = Ellipse.subclass();

CylinderEllipse.prototype.copyGraph = noop;

// ----- Cylinder ----- //

var Cylinder = Shape.subclass({
  diameter: 1,
  length: 1,
  frontFace: undefined,
  fill: true,
});

var TAU = utils.TAU;

Cylinder.prototype.create = function(/* options */) {
  // call super
  Shape.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  // CylinderGroup to render cylinder surface then bases
  this.group = new CylinderGroup({
    addTo: this,
    color: this.color,
    visible: this.visible,
  });
  var baseZ = this.length/2;
  var baseColor = this.backface || true;
  // front outside base
  this.frontBase = this.group.frontBase = new Ellipse({
    addTo: this.group,
    diameter: this.diameter,
    translate: { z: baseZ },
    rotate: { y: TAU/2 },
    color: this.color,
    stroke: this.stroke,
    fill: this.fill,
    backface: this.frontFace || baseColor,
    visible: this.visible,
  });
  // back outside base
  this.rearBase = this.group.rearBase = this.frontBase.copy({
    translate: { z: -baseZ },
    rotate: { y: 0 },
    backface: baseColor,
  });
};

// Cylinder shape does not render anything
Cylinder.prototype.render = function() {};

// ----- set child properties ----- //

var childProperties = [ 'stroke', 'fill', 'color', 'visible' ];
childProperties.forEach( function( property ) {
  // use proxy property for custom getter & setter
  var _prop = '_' + property;
  Object.defineProperty( Cylinder.prototype, property, {
    get: function() {
      return this[ _prop ];
    },
    set: function( value ) {
      this[ _prop ] = value;
      // set property on children
      if ( this.frontBase ) {
        this.frontBase[ property ] = value;
        this.rearBase[ property ] = value;
        this.group[ property ] = value;
      }
    },
  });
});

// TODO child property setter for backface, frontBaseColor, & rearBaseColor

return Cylinder;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./path-command":"../node_modules/zdog/js/path-command.js","./shape":"../node_modules/zdog/js/shape.js","./group":"../node_modules/zdog/js/group.js","./ellipse":"../node_modules/zdog/js/ellipse.js"}],"../node_modules/zdog/js/cone.js":[function(require,module,exports) {
/**
 * Cone composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./vector'),
        require('./path-command'), require('./anchor'), require('./ellipse') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Cone = factory( Zdog, Zdog.Vector, Zdog.PathCommand,
        Zdog.Anchor, Zdog.Ellipse );
  }
}( this, function factory( utils, Vector, PathCommand, Anchor, Ellipse ) {

var Cone = Ellipse.subclass({
  length: 1,
  fill: true,
});

var TAU = utils.TAU;

Cone.prototype.create = function(/* options */) {
  // call super
  Ellipse.prototype.create.apply( this, arguments );
  // composite shape, create child shapes
  this.apex = new Anchor({
    addTo: this,
    translate: { z: this.length },
  });

  // vectors used for calculation
  this.renderApex = new Vector();
  this.renderCentroid = new Vector();
  this.tangentA = new Vector();
  this.tangentB = new Vector();

  this.surfacePathCommands = [
    new PathCommand( 'move', [ {} ] ), // points set in renderConeSurface
    new PathCommand( 'line', [ {} ] ),
    new PathCommand( 'line', [ {} ] ),
  ];
};

Cone.prototype.updateSortValue = function() {
  // center of cone is one third of its length
  this.renderCentroid.set( this.renderOrigin )
    .lerp( this.apex.renderOrigin, 1/3 );
  this.sortValue = this.renderCentroid.z;
};

Cone.prototype.render = function( ctx, renderer ) {
  this.renderConeSurface( ctx, renderer );
  Ellipse.prototype.render.apply( this, arguments );
};

Cone.prototype.renderConeSurface = function( ctx, renderer ) {
  if ( !this.visible ) {
    return;
  }
  this.renderApex.set( this.apex.renderOrigin )
    .subtract( this.renderOrigin );

  var scale = this.renderNormal.magnitude();
  var apexDistance = this.renderApex.magnitude2d();
  var normalDistance = this.renderNormal.magnitude2d();
  // eccentricity
  var eccenAngle = Math.acos( normalDistance / scale );
  var eccen = Math.sin( eccenAngle );
  var radius = this.diameter/2 * scale;
  // does apex extend beyond eclipse of face
  var isApexVisible = radius * eccen < apexDistance;
  if ( !isApexVisible ) {
    return;
  }
  // update tangents
  var apexAngle = Math.atan2( this.renderNormal.y, this.renderNormal.x ) +
      TAU/2;
  var projectLength = apexDistance / eccen;
  var projectAngle = Math.acos( radius / projectLength );
  // set tangent points
  var tangentA = this.tangentA;
  var tangentB = this.tangentB;

  tangentA.x = Math.cos( projectAngle ) * radius * eccen;
  tangentA.y = Math.sin( projectAngle ) * radius;

  tangentB.set( this.tangentA );
  tangentB.y *= -1;

  tangentA.rotateZ( apexAngle );
  tangentB.rotateZ( apexAngle );
  tangentA.add( this.renderOrigin );
  tangentB.add( this.renderOrigin );

  this.setSurfaceRenderPoint( 0, tangentA );
  this.setSurfaceRenderPoint( 1, this.apex.renderOrigin );
  this.setSurfaceRenderPoint( 2, tangentB );

  // render
  var elem = this.getSurfaceRenderElement( ctx, renderer );
  renderer.renderPath( ctx, elem, this.surfacePathCommands );
  renderer.stroke( ctx, elem, this.stroke, this.color, this.getLineWidth() );
  renderer.fill( ctx, elem, this.fill, this.color );
  renderer.end( ctx, elem );
};

var svgURI = 'http://www.w3.org/2000/svg';

Cone.prototype.getSurfaceRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.surfaceSvgElement ) {
    // create svgElement
    this.surfaceSvgElement = document.createElementNS( svgURI, 'path');
    this.surfaceSvgElement.setAttribute( 'stroke-linecap', 'round' );
    this.surfaceSvgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.surfaceSvgElement;
};

Cone.prototype.setSurfaceRenderPoint = function( index, point ) {
  var renderPoint = this.surfacePathCommands[ index ].renderPoints[0];
  renderPoint.set( point );
};

return Cone;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./vector":"../node_modules/zdog/js/vector.js","./path-command":"../node_modules/zdog/js/path-command.js","./anchor":"../node_modules/zdog/js/anchor.js","./ellipse":"../node_modules/zdog/js/ellipse.js"}],"../node_modules/zdog/js/box.js":[function(require,module,exports) {
/**
 * Box composite shape
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./anchor'),
        require('./shape'), require('./rect') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Box = factory( Zdog, Zdog.Anchor, Zdog.Shape, Zdog.Rect );
  }
}( this, function factory( utils, Anchor, Shape, Rect ) {

// ----- BoxRect ----- //

var BoxRect = Rect.subclass();
// prevent double-creation in parent.copyGraph()
// only create in Box.create()
BoxRect.prototype.copyGraph = function() {};

// ----- Box ----- //

var TAU = utils.TAU;
var faceNames = [
  'frontFace',
  'rearFace',
  'leftFace',
  'rightFace',
  'topFace',
  'bottomFace',
];

var boxDefaults = utils.extend( {}, Shape.defaults );
delete boxDefaults.path;
faceNames.forEach( function( faceName ) {
  boxDefaults[ faceName ] = true;
});
utils.extend( boxDefaults, {
  width: 1,
  height: 1,
  depth: 1,
  fill: true,
});

var Box = Anchor.subclass( boxDefaults );

Box.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  this.updatePath();
  // HACK reset fill to trigger face setter
  this.fill = this.fill;
};

Box.prototype.updatePath = function() {
  // reset all faces to trigger setters
  faceNames.forEach( function( faceName ) {
    this[ faceName ] = this[ faceName ];
  }, this );
};

faceNames.forEach( function( faceName ) {
  var _faceName = '_' + faceName;
  Object.defineProperty( Box.prototype, faceName, {
    get: function() {
      return this[ _faceName ];
    },
    set: function( value ) {
      this[ _faceName ] = value;
      this.setFace( faceName, value );
    },
  });
});

Box.prototype.setFace = function( faceName, value ) {
  var rectProperty = faceName + 'Rect';
  var rect = this[ rectProperty ];
  // remove if false
  if ( !value ) {
    this.removeChild( rect );
    return;
  }
  // update & add face
  var options = this.getFaceOptions( faceName );
  options.color = typeof value == 'string' ? value : this.color;

  if ( rect ) {
    // update previous
    rect.setOptions( options );
  } else {
    // create new
    rect = this[ rectProperty ] = new BoxRect( options );
  }
  rect.updatePath();
  this.addChild( rect );
};

Box.prototype.getFaceOptions = function( faceName ) {
  return {
    frontFace: {
      width: this.width,
      height: this.height,
      translate: { z: this.depth/2 },
    },
    rearFace: {
      width: this.width,
      height: this.height,
      translate: { z: -this.depth/2 },
      rotate: { y: TAU/2 },
    },
    leftFace: {
      width: this.depth,
      height: this.height,
      translate: { x: -this.width/2 },
      rotate: { y: -TAU/4 },
    },
    rightFace: {
      width: this.depth,
      height: this.height,
      translate: { x: this.width/2 },
      rotate: { y: TAU/4 },
    },
    topFace: {
      width: this.width,
      height: this.depth,
      translate: { y: -this.height/2 },
      rotate: { x: -TAU/4 },
    },
    bottomFace: {
      width: this.width,
      height: this.depth,
      translate: { y: this.height/2 },
      rotate: { x: TAU/4 },
    },
  }[ faceName ];
};

// ----- set face properties ----- //

var childProperties = [ 'color', 'stroke', 'fill', 'backface', 'front',
  'visible' ];
childProperties.forEach( function( property ) {
  // use proxy property for custom getter & setter
  var _prop = '_' + property;
  Object.defineProperty( Box.prototype, property, {
    get: function() {
      return this[ _prop ];
    },
    set: function( value ) {
      this[ _prop ] = value;
      faceNames.forEach( function( faceName ) {
        var rect = this[ faceName + 'Rect' ];
        var isFaceColor = typeof this[ faceName ] == 'string';
        var isColorUnderwrite = property == 'color' && isFaceColor;
        if ( rect && !isColorUnderwrite ) {
          rect[ property ] = value;
        }
      }, this );
    },
  });
});

return Box;

}));

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./anchor":"../node_modules/zdog/js/anchor.js","./shape":"../node_modules/zdog/js/shape.js","./rect":"../node_modules/zdog/js/rect.js"}],"../node_modules/zdog/js/index.js":[function(require,module,exports) {
var define;
/**
 * Index
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
        require('./boilerplate'),
        require('./canvas-renderer'),
        require('./svg-renderer'),
        require('./vector'),
        require('./anchor'),
        require('./dragger'),
        require('./illustration'),
        require('./path-command'),
        require('./shape'),
        require('./group'),
        require('./rect'),
        require('./rounded-rect'),
        require('./ellipse'),
        require('./polygon'),
        require('./hemisphere'),
        require('./cylinder'),
        require('./cone'),
        require('./box')
    );
  } else if ( typeof define == 'function' && define.amd ) {
    /* globals define */ // AMD
    define( 'zdog', [], root.Zdog );
  }
})( this, function factory( Zdog, CanvasRenderer, SvgRenderer, Vector, Anchor,
    Dragger, Illustration, PathCommand, Shape, Group, Rect, RoundedRect,
    Ellipse, Polygon, Hemisphere, Cylinder, Cone, Box ) {

      Zdog.CanvasRenderer = CanvasRenderer;
      Zdog.SvgRenderer = SvgRenderer;
      Zdog.Vector = Vector;
      Zdog.Anchor = Anchor;
      Zdog.Dragger = Dragger;
      Zdog.Illustration = Illustration;
      Zdog.PathCommand = PathCommand;
      Zdog.Shape = Shape;
      Zdog.Group = Group;
      Zdog.Rect = Rect;
      Zdog.RoundedRect = RoundedRect;
      Zdog.Ellipse = Ellipse;
      Zdog.Polygon = Polygon;
      Zdog.Hemisphere = Hemisphere;
      Zdog.Cylinder = Cylinder;
      Zdog.Cone = Cone;
      Zdog.Box = Box;

      return Zdog;
});

},{"./boilerplate":"../node_modules/zdog/js/boilerplate.js","./canvas-renderer":"../node_modules/zdog/js/canvas-renderer.js","./svg-renderer":"../node_modules/zdog/js/svg-renderer.js","./vector":"../node_modules/zdog/js/vector.js","./anchor":"../node_modules/zdog/js/anchor.js","./dragger":"../node_modules/zdog/js/dragger.js","./illustration":"../node_modules/zdog/js/illustration.js","./path-command":"../node_modules/zdog/js/path-command.js","./shape":"../node_modules/zdog/js/shape.js","./group":"../node_modules/zdog/js/group.js","./rect":"../node_modules/zdog/js/rect.js","./rounded-rect":"../node_modules/zdog/js/rounded-rect.js","./ellipse":"../node_modules/zdog/js/ellipse.js","./polygon":"../node_modules/zdog/js/polygon.js","./hemisphere":"../node_modules/zdog/js/hemisphere.js","./cylinder":"../node_modules/zdog/js/cylinder.js","./cone":"../node_modules/zdog/js/cone.js","./box":"../node_modules/zdog/js/box.js"}],"../node_modules/zfont/dist/zfont.es.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*!
 * Zfont v1.2.7
 * Text plugin for Zdog
 * 2019 James Daniel
 * MIT Licensed 
 * github.com/jaames/zfont
 */
var Typr = {};

Typr.parse = function (buff) {
  var bin = Typr._bin;
  var data = new Uint8Array(buff);
  var offset = 0;
  var sfnt_version = bin.readFixed(data, offset);
  offset += 4;
  var numTables = bin.readUshort(data, offset);
  offset += 2;
  var searchRange = bin.readUshort(data, offset);
  offset += 2;
  var entrySelector = bin.readUshort(data, offset);
  offset += 2;
  var rangeShift = bin.readUshort(data, offset);
  offset += 2;
  var tags = ["cmap", "head", "hhea", "maxp", "hmtx", "name", "OS/2", "post", "loca", "glyf", "kern", "CFF ", "GPOS", "GSUB", "SVG "];
  var obj = {
    _data: data
  };
  var tabs = {};

  for (var i = 0; i < numTables; i++) {
    var tag = bin.readASCII(data, offset, 4);
    offset += 4;
    var checkSum = bin.readUint(data, offset);
    offset += 4;
    var toffset = bin.readUint(data, offset);
    offset += 4;
    var length = bin.readUint(data, offset);
    offset += 4;
    tabs[tag] = {
      offset: toffset,
      length: length
    };
  }

  for (var i = 0; i < tags.length; i++) {
    var t = tags[i];

    if (tabs[t]) {
      obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
  }

  return obj;
};

Typr._tabOffset = function (data, tab) {
  var bin = Typr._bin;
  var numTables = bin.readUshort(data, 4);
  var offset = 12;

  for (var i = 0; i < numTables; i++) {
    var tag = bin.readASCII(data, offset, 4);
    offset += 4;
    var checkSum = bin.readUint(data, offset);
    offset += 4;
    var toffset = bin.readUint(data, offset);
    offset += 4;
    var length = bin.readUint(data, offset);
    offset += 4;

    if (tag == tab) {
      return toffset;
    }
  }

  return 0;
};

Typr._bin = {
  readFixed: function (data, o) {
    return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
  },
  readF2dot14: function (data, o) {
    var num = Typr._bin.readShort(data, o);

    return num / 16384;
    var intg = num >> 14,
        frac = (num & 16383) / (16383 + 1);
    return intg > 0 ? intg + frac : intg - frac;
  },
  readInt: function (buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p + 3];
    a[1] = buff[p + 2];
    a[2] = buff[p + 1];
    a[3] = buff[p];
    return Typr._bin.t.int32[0];
  },
  readInt8: function (buff, p) {
    var a = Typr._bin.t.uint8;
    a[0] = buff[p];
    return Typr._bin.t.int8[0];
  },
  readShort: function (buff, p) {
    var a = Typr._bin.t.uint8;
    a[1] = buff[p];
    a[0] = buff[p + 1];
    return Typr._bin.t.int16[0];
  },
  readUshort: function (buff, p) {
    return buff[p] << 8 | buff[p + 1];
  },
  readUshorts: function (buff, p, len) {
    var arr = [];

    for (var i = 0; i < len; i++) {
      arr.push(Typr._bin.readUshort(buff, p + i * 2));
    }

    return arr;
  },
  readUint: function (buff, p) {
    var a = Typr._bin.t.uint8;
    a[3] = buff[p];
    a[2] = buff[p + 1];
    a[1] = buff[p + 2];
    a[0] = buff[p + 3];
    return Typr._bin.t.uint32[0];
  },
  readUint64: function (buff, p) {
    return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
  },
  readASCII: function (buff, p, l) {
    var s = "";

    for (var i = 0; i < l; i++) {
      s += String.fromCharCode(buff[p + i]);
    }

    return s;
  },
  readUnicode: function (buff, p, l) {
    var s = "";

    for (var i = 0; i < l; i++) {
      var c = buff[p++] << 8 | buff[p++];
      s += String.fromCharCode(c);
    }

    return s;
  },
  _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null,
  readUTF8: function (buff, p, l) {
    var tdec = Typr._bin._tdec;

    if (tdec && p == 0 && l == buff.length) {
      return tdec["decode"](buff);
    }

    return Typr._bin.readASCII(buff, p, l);
  },
  readBytes: function (buff, p, l) {
    var arr = [];

    for (var i = 0; i < l; i++) {
      arr.push(buff[p + i]);
    }

    return arr;
  },
  readASCIIArray: function (buff, p, l) {
    var s = [];

    for (var i = 0; i < l; i++) {
      s.push(String.fromCharCode(buff[p + i]));
    }

    return s;
  }
};
Typr._bin.t = {
  buff: new ArrayBuffer(8)
};
Typr._bin.t.int8 = new Int8Array(Typr._bin.t.buff);
Typr._bin.t.uint8 = new Uint8Array(Typr._bin.t.buff);
Typr._bin.t.int16 = new Int16Array(Typr._bin.t.buff);
Typr._bin.t.uint16 = new Uint16Array(Typr._bin.t.buff);
Typr._bin.t.int32 = new Int32Array(Typr._bin.t.buff);
Typr._bin.t.uint32 = new Uint32Array(Typr._bin.t.buff);
Typr._lctf = {};

Typr._lctf.parse = function (data, offset, length, font, subt) {
  var bin = Typr._bin;
  var obj = {};
  var offset0 = offset;
  var tableVersion = bin.readFixed(data, offset);
  offset += 4;
  var offScriptList = bin.readUshort(data, offset);
  offset += 2;
  var offFeatureList = bin.readUshort(data, offset);
  offset += 2;
  var offLookupList = bin.readUshort(data, offset);
  offset += 2;
  obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
  obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
  obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
  return obj;
};

Typr._lctf.readLookupList = function (data, offset, subt) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = [];
  var count = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < count; i++) {
    var noff = bin.readUshort(data, offset);
    offset += 2;

    var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);

    obj.push(lut);
  }

  return obj;
};

Typr._lctf.readLookupTable = function (data, offset, subt) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = {
    tabs: []
  };
  obj.ltype = bin.readUshort(data, offset);
  offset += 2;
  obj.flag = bin.readUshort(data, offset);
  offset += 2;
  var cnt = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < cnt; i++) {
    var noff = bin.readUshort(data, offset);
    offset += 2;
    var tab = subt(data, obj.ltype, offset0 + noff);
    obj.tabs.push(tab);
  }

  return obj;
};

Typr._lctf.numOfOnes = function (n) {
  var num = 0;

  for (var i = 0; i < 32; i++) {
    if ((n >>> i & 1) != 0) {
      num++;
    }
  }

  return num;
};

Typr._lctf.readClassDef = function (data, offset) {
  var bin = Typr._bin;
  var obj = [];
  var format = bin.readUshort(data, offset);
  offset += 2;

  if (format == 1) {
    var startGlyph = bin.readUshort(data, offset);
    offset += 2;
    var glyphCount = bin.readUshort(data, offset);
    offset += 2;

    for (var i = 0; i < glyphCount; i++) {
      obj.push(startGlyph + i);
      obj.push(startGlyph + i);
      obj.push(bin.readUshort(data, offset));
      offset += 2;
    }
  }

  if (format == 2) {
    var count = bin.readUshort(data, offset);
    offset += 2;

    for (var i = 0; i < count; i++) {
      obj.push(bin.readUshort(data, offset));
      offset += 2;
      obj.push(bin.readUshort(data, offset));
      offset += 2;
      obj.push(bin.readUshort(data, offset));
      offset += 2;
    }
  }

  return obj;
};

Typr._lctf.getInterval = function (tab, val) {
  for (var i = 0; i < tab.length; i += 3) {
    var start = tab[i],
        end = tab[i + 1],
        index = tab[i + 2];

    if (start <= val && val <= end) {
      return i;
    }
  }

  return -1;
};

Typr._lctf.readValueRecord = function (data, offset, valFmt) {
  var bin = Typr._bin;
  var arr = [];
  arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
  offset += valFmt & 1 ? 2 : 0;
  arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
  offset += valFmt & 2 ? 2 : 0;
  arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
  offset += valFmt & 4 ? 2 : 0;
  arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
  offset += valFmt & 8 ? 2 : 0;
  return arr;
};

Typr._lctf.readCoverage = function (data, offset) {
  var bin = Typr._bin;
  var cvg = {};
  cvg.fmt = bin.readUshort(data, offset);
  offset += 2;
  var count = bin.readUshort(data, offset);
  offset += 2;

  if (cvg.fmt == 1) {
    cvg.tab = bin.readUshorts(data, offset, count);
  }

  if (cvg.fmt == 2) {
    cvg.tab = bin.readUshorts(data, offset, count * 3);
  }

  return cvg;
};

Typr._lctf.coverageIndex = function (cvg, val) {
  var tab = cvg.tab;

  if (cvg.fmt == 1) {
    return tab.indexOf(val);
  }

  if (cvg.fmt == 2) {
    var ind = Typr._lctf.getInterval(tab, val);

    if (ind != -1) {
      return tab[ind + 2] + (val - tab[ind]);
    }
  }

  return -1;
};

Typr._lctf.readFeatureList = function (data, offset) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = [];
  var count = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < count; i++) {
    var tag = bin.readASCII(data, offset, 4);
    offset += 4;
    var noff = bin.readUshort(data, offset);
    offset += 2;
    obj.push({
      tag: tag.trim(),
      tab: Typr._lctf.readFeatureTable(data, offset0 + noff)
    });
  }

  return obj;
};

Typr._lctf.readFeatureTable = function (data, offset) {
  var bin = Typr._bin;
  var featureParams = bin.readUshort(data, offset);
  offset += 2;
  var lookupCount = bin.readUshort(data, offset);
  offset += 2;
  var indices = [];

  for (var i = 0; i < lookupCount; i++) {
    indices.push(bin.readUshort(data, offset + 2 * i));
  }

  return indices;
};

Typr._lctf.readScriptList = function (data, offset) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = {};
  var count = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < count; i++) {
    var tag = bin.readASCII(data, offset, 4);
    offset += 4;
    var noff = bin.readUshort(data, offset);
    offset += 2;
    obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
  }

  return obj;
};

Typr._lctf.readScriptTable = function (data, offset) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = {};
  var defLangSysOff = bin.readUshort(data, offset);
  offset += 2;
  obj.default = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
  var langSysCount = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < langSysCount; i++) {
    var tag = bin.readASCII(data, offset, 4);
    offset += 4;
    var langSysOff = bin.readUshort(data, offset);
    offset += 2;
    obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
  }

  return obj;
};

Typr._lctf.readLangSysTable = function (data, offset) {
  var bin = Typr._bin;
  var obj = {};
  var lookupOrder = bin.readUshort(data, offset);
  offset += 2;
  obj.reqFeature = bin.readUshort(data, offset);
  offset += 2;
  var featureCount = bin.readUshort(data, offset);
  offset += 2;
  obj.features = bin.readUshorts(data, offset, featureCount);
  return obj;
};

Typr.CFF = {};

Typr.CFF.parse = function (data, offset, length) {
  var bin = Typr._bin;
  data = new Uint8Array(data.buffer, offset, length);
  offset = 0;
  var major = data[offset];
  offset++;
  var minor = data[offset];
  offset++;
  var hdrSize = data[offset];
  offset++;
  var offsize = data[offset];
  offset++;
  var ninds = [];
  offset = Typr.CFF.readIndex(data, offset, ninds);
  var names = [];

  for (var i = 0; i < ninds.length - 1; i++) {
    names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
  }

  offset += ninds[ninds.length - 1];
  var tdinds = [];
  offset = Typr.CFF.readIndex(data, offset, tdinds);
  var topDicts = [];

  for (var i = 0; i < tdinds.length - 1; i++) {
    topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
  }

  offset += tdinds[tdinds.length - 1];
  var topdict = topDicts[0];
  var sinds = [];
  offset = Typr.CFF.readIndex(data, offset, sinds);
  var strings = [];

  for (var i = 0; i < sinds.length - 1; i++) {
    strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
  }

  offset += sinds[sinds.length - 1];
  Typr.CFF.readSubrs(data, offset, topdict);

  if (topdict.CharStrings) {
    offset = topdict.CharStrings;
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var cstr = [];

    for (var i = 0; i < sinds.length - 1; i++) {
      cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    }

    topdict.CharStrings = cstr;
  }

  if (topdict.Encoding) {
    topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
  }

  if (topdict.charset) {
    topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
  }

  if (topdict.Private) {
    offset = topdict.Private[1];
    topdict.Private = Typr.CFF.readDict(data, offset, offset + topdict.Private[0]);

    if (topdict.Private.Subrs) {
      Typr.CFF.readSubrs(data, offset + topdict.Private.Subrs, topdict.Private);
    }
  }

  var obj = {};

  for (var p in topdict) {
    if (["FamilyName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1) {
      obj[p] = strings[topdict[p] - 426 + 35];
    } else {
      obj[p] = topdict[p];
    }
  }

  return obj;
};

Typr.CFF.readSubrs = function (data, offset, obj) {
  var bin = Typr._bin;
  var gsubinds = [];
  offset = Typr.CFF.readIndex(data, offset, gsubinds);
  var bias,
      nSubrs = gsubinds.length;

  if (nSubrs < 1240) {
    bias = 107;
  } else if (nSubrs < 33900) {
    bias = 1131;
  } else {
    bias = 32768;
  }

  obj.Bias = bias;
  obj.Subrs = [];

  for (var i = 0; i < gsubinds.length - 1; i++) {
    obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  }
};

Typr.CFF.tableSE = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0];

Typr.CFF.glyphByUnicode = function (cff, code) {
  for (var i = 0; i < cff.charset.length; i++) {
    if (cff.charset[i] == code) {
      return i;
    }
  }

  return -1;
};

Typr.CFF.glyphBySE = function (cff, charcode) {
  if (charcode < 0 || charcode > 255) {
    return -1;
  }

  return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
};

Typr.CFF.readEncoding = function (data, offset, num) {
  var bin = Typr._bin;
  var array = [".notdef"];
  var format = data[offset];
  offset++;

  if (format == 0) {
    var nCodes = data[offset];
    offset++;

    for (var i = 0; i < nCodes; i++) {
      array.push(data[offset + i]);
    }
  } else {
    throw "error: unknown encoding format: " + format;
  }

  return array;
};

Typr.CFF.readCharset = function (data, offset, num) {
  var bin = Typr._bin;
  var charset = [".notdef"];
  var format = data[offset];
  offset++;

  if (format == 0) {
    for (var i = 0; i < num; i++) {
      var first = bin.readUshort(data, offset);
      offset += 2;
      charset.push(first);
    }
  } else if (format == 1 || format == 2) {
    while (charset.length < num) {
      var first = bin.readUshort(data, offset);
      offset += 2;
      var nLeft = 0;

      if (format == 1) {
        nLeft = data[offset];
        offset++;
      } else {
        nLeft = bin.readUshort(data, offset);
        offset += 2;
      }

      for (var i = 0; i <= nLeft; i++) {
        charset.push(first);
        first++;
      }
    }
  } else {
    throw "error: format: " + format;
  }

  return charset;
};

Typr.CFF.readIndex = function (data, offset, inds) {
  var bin = Typr._bin;
  var count = bin.readUshort(data, offset);
  offset += 2;
  var offsize = data[offset];
  offset++;

  if (offsize == 1) {
    for (var i = 0; i < count + 1; i++) {
      inds.push(data[offset + i]);
    }
  } else if (offsize == 2) {
    for (var i = 0; i < count + 1; i++) {
      inds.push(bin.readUshort(data, offset + i * 2));
    }
  } else if (offsize == 3) {
    for (var i = 0; i < count + 1; i++) {
      inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    }
  } else if (count != 0) {
    throw "unsupported offset size: " + offsize + ", count: " + count;
  }

  offset += (count + 1) * offsize;
  return offset - 1;
};

Typr.CFF.getCharString = function (data, offset, o) {
  var bin = Typr._bin;
  var b0 = data[offset],
      b1 = data[offset + 1],
      b2 = data[offset + 2],
      b3 = data[offset + 3],
      b4 = data[offset + 4];
  var vs = 1;
  var op = null,
      val = null;

  if (b0 <= 20) {
    op = b0;
    vs = 1;
  }

  if (b0 == 12) {
    op = b0 * 100 + b1;
    vs = 2;
  }

  if (21 <= b0 && b0 <= 27) {
    op = b0;
    vs = 1;
  }

  if (b0 == 28) {
    val = bin.readShort(data, offset + 1);
    vs = 3;
  }

  if (29 <= b0 && b0 <= 31) {
    op = b0;
    vs = 1;
  }

  if (32 <= b0 && b0 <= 246) {
    val = b0 - 139;
    vs = 1;
  }

  if (247 <= b0 && b0 <= 250) {
    val = (b0 - 247) * 256 + b1 + 108;
    vs = 2;
  }

  if (251 <= b0 && b0 <= 254) {
    val = -(b0 - 251) * 256 - b1 - 108;
    vs = 2;
  }

  if (b0 == 255) {
    val = bin.readInt(data, offset + 1) / 65535;
    vs = 5;
  }

  o.val = val != null ? val : "o" + op;
  o.size = vs;
};

Typr.CFF.readCharString = function (data, offset, length) {
  var end = offset + length;
  var bin = Typr._bin;
  var arr = [];

  while (offset < end) {
    var b0 = data[offset],
        b1 = data[offset + 1],
        b2 = data[offset + 2],
        b3 = data[offset + 3],
        b4 = data[offset + 4];
    var vs = 1;
    var op = null,
        val = null;

    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }

    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }

    if (b0 == 19 || b0 == 20) {
      op = b0;
      vs = 2;
    }

    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }

    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }

    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }

    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }

    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }

    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }

    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }

    arr.push(val != null ? val : "o" + op);
    offset += vs;
  }

  return arr;
};

Typr.CFF.readDict = function (data, offset, end) {
  var bin = Typr._bin;
  var dict = {};
  var carr = [];

  while (offset < end) {
    var b0 = data[offset],
        b1 = data[offset + 1],
        b2 = data[offset + 2],
        b3 = data[offset + 3],
        b4 = data[offset + 4];
    var vs = 1;
    var key = null,
        val = null;

    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }

    if (b0 == 29) {
      val = bin.readInt(data, offset + 1);
      vs = 5;
    }

    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }

    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }

    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }

    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
      throw "unknown number";
    }

    if (b0 == 30) {
      var nibs = [];
      vs = 1;

      while (true) {
        var b = data[offset + vs];
        vs++;
        var nib0 = b >> 4,
            nib1 = b & 15;

        if (nib0 != 15) {
          nibs.push(nib0);
        }

        if (nib1 != 15) {
          nibs.push(nib1);
        }

        if (nib1 == 15) {
          break;
        }
      }

      var s = "";
      var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];

      for (var i = 0; i < nibs.length; i++) {
        s += chars[nibs[i]];
      }

      val = parseFloat(s);
    }

    if (b0 <= 21) {
      var keys = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"];
      key = keys[b0];
      vs = 1;

      if (b0 == 12) {
        var keys = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", 0, 0, "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", 0, 0, 0, 0, 0, 0, "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
        key = keys[b1];
        vs = 2;
      }
    }

    if (key != null) {
      dict[key] = carr.length == 1 ? carr[0] : carr;
      carr = [];
    } else {
      carr.push(val);
    }

    offset += vs;
  }

  return dict;
};

Typr.cmap = {};

Typr.cmap.parse = function (data, offset, length) {
  data = new Uint8Array(data.buffer, offset, length);
  offset = 0;
  var bin = Typr._bin;
  var obj = {};
  var version = bin.readUshort(data, offset);
  offset += 2;
  var numTables = bin.readUshort(data, offset);
  offset += 2;
  var offs = [];
  obj.tables = [];

  for (var i = 0; i < numTables; i++) {
    var platformID = bin.readUshort(data, offset);
    offset += 2;
    var encodingID = bin.readUshort(data, offset);
    offset += 2;
    var noffset = bin.readUint(data, offset);
    offset += 4;
    var id = "p" + platformID + "e" + encodingID;
    var tind = offs.indexOf(noffset);

    if (tind == -1) {
      tind = obj.tables.length;
      var subt;
      offs.push(noffset);
      var format = bin.readUshort(data, noffset);

      if (format == 0) {
        subt = Typr.cmap.parse0(data, noffset);
      } else if (format == 4) {
        subt = Typr.cmap.parse4(data, noffset);
      } else if (format == 6) {
        subt = Typr.cmap.parse6(data, noffset);
      } else if (format == 12) {
        subt = Typr.cmap.parse12(data, noffset);
      } else {
        console.log("unknown format: " + format, platformID, encodingID, noffset);
      }

      obj.tables.push(subt);
    }

    if (obj[id] != null) {
      throw "multiple tables for one platform+encoding";
    }

    obj[id] = tind;
  }

  return obj;
};

Typr.cmap.parse0 = function (data, offset) {
  var bin = Typr._bin;
  var obj = {};
  obj.format = bin.readUshort(data, offset);
  offset += 2;
  var len = bin.readUshort(data, offset);
  offset += 2;
  var lang = bin.readUshort(data, offset);
  offset += 2;
  obj.map = [];

  for (var i = 0; i < len - 6; i++) {
    obj.map.push(data[offset + i]);
  }

  return obj;
};

Typr.cmap.parse4 = function (data, offset) {
  var bin = Typr._bin;
  var offset0 = offset;
  var obj = {};
  obj.format = bin.readUshort(data, offset);
  offset += 2;
  var length = bin.readUshort(data, offset);
  offset += 2;
  var language = bin.readUshort(data, offset);
  offset += 2;
  var segCountX2 = bin.readUshort(data, offset);
  offset += 2;
  var segCount = segCountX2 / 2;
  obj.searchRange = bin.readUshort(data, offset);
  offset += 2;
  obj.entrySelector = bin.readUshort(data, offset);
  offset += 2;
  obj.rangeShift = bin.readUshort(data, offset);
  offset += 2;
  obj.endCount = bin.readUshorts(data, offset, segCount);
  offset += segCount * 2;
  offset += 2;
  obj.startCount = bin.readUshorts(data, offset, segCount);
  offset += segCount * 2;
  obj.idDelta = [];

  for (var i = 0; i < segCount; i++) {
    obj.idDelta.push(bin.readShort(data, offset));
    offset += 2;
  }

  obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
  offset += segCount * 2;
  obj.glyphIdArray = [];

  while (offset < offset0 + length) {
    obj.glyphIdArray.push(bin.readUshort(data, offset));
    offset += 2;
  }

  return obj;
};

Typr.cmap.parse6 = function (data, offset) {
  var bin = Typr._bin;
  var obj = {};
  obj.format = bin.readUshort(data, offset);
  offset += 2;
  var length = bin.readUshort(data, offset);
  offset += 2;
  var language = bin.readUshort(data, offset);
  offset += 2;
  obj.firstCode = bin.readUshort(data, offset);
  offset += 2;
  var entryCount = bin.readUshort(data, offset);
  offset += 2;
  obj.glyphIdArray = [];

  for (var i = 0; i < entryCount; i++) {
    obj.glyphIdArray.push(bin.readUshort(data, offset));
    offset += 2;
  }

  return obj;
};

Typr.cmap.parse12 = function (data, offset) {
  var bin = Typr._bin;
  var obj = {};
  obj.format = bin.readUshort(data, offset);
  offset += 2;
  offset += 2;
  var length = bin.readUint(data, offset);
  offset += 4;
  var lang = bin.readUint(data, offset);
  offset += 4;
  var nGroups = bin.readUint(data, offset);
  offset += 4;
  obj.groups = [];

  for (var i = 0; i < nGroups; i++) {
    var off = offset + i * 12;
    var startCharCode = bin.readUint(data, off + 0);
    var endCharCode = bin.readUint(data, off + 4);
    var startGlyphID = bin.readUint(data, off + 8);
    obj.groups.push([startCharCode, endCharCode, startGlyphID]);
  }

  return obj;
};

Typr.glyf = {};

Typr.glyf.parse = function (data, offset, length, font) {
  var obj = [];

  for (var g = 0; g < font.maxp.numGlyphs; g++) {
    obj.push(null);
  }

  return obj;
};

Typr.glyf._parseGlyf = function (font, g) {
  var bin = Typr._bin;
  var data = font._data;
  var offset = Typr._tabOffset(data, "glyf") + font.loca[g];

  if (font.loca[g] == font.loca[g + 1]) {
    return null;
  }

  var gl = {};
  gl.noc = bin.readShort(data, offset);
  offset += 2;
  gl.xMin = bin.readShort(data, offset);
  offset += 2;
  gl.yMin = bin.readShort(data, offset);
  offset += 2;
  gl.xMax = bin.readShort(data, offset);
  offset += 2;
  gl.yMax = bin.readShort(data, offset);
  offset += 2;

  if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) {
    return null;
  }

  if (gl.noc > 0) {
    gl.endPts = [];

    for (var i = 0; i < gl.noc; i++) {
      gl.endPts.push(bin.readUshort(data, offset));
      offset += 2;
    }

    var instructionLength = bin.readUshort(data, offset);
    offset += 2;

    if (data.length - offset < instructionLength) {
      return null;
    }

    gl.instructions = bin.readBytes(data, offset, instructionLength);
    offset += instructionLength;
    var crdnum = gl.endPts[gl.noc - 1] + 1;
    gl.flags = [];

    for (var i = 0; i < crdnum; i++) {
      var flag = data[offset];
      offset++;
      gl.flags.push(flag);

      if ((flag & 8) != 0) {
        var rep = data[offset];
        offset++;

        for (var j = 0; j < rep; j++) {
          gl.flags.push(flag);
          i++;
        }
      }
    }

    gl.xs = [];

    for (var i = 0; i < crdnum; i++) {
      var i8 = (gl.flags[i] & 2) != 0,
          same = (gl.flags[i] & 16) != 0;

      if (i8) {
        gl.xs.push(same ? data[offset] : -data[offset]);
        offset++;
      } else {
        if (same) {
          gl.xs.push(0);
        } else {
          gl.xs.push(bin.readShort(data, offset));
          offset += 2;
        }
      }
    }

    gl.ys = [];

    for (var i = 0; i < crdnum; i++) {
      var i8 = (gl.flags[i] & 4) != 0,
          same = (gl.flags[i] & 32) != 0;

      if (i8) {
        gl.ys.push(same ? data[offset] : -data[offset]);
        offset++;
      } else {
        if (same) {
          gl.ys.push(0);
        } else {
          gl.ys.push(bin.readShort(data, offset));
          offset += 2;
        }
      }
    }

    var x = 0,
        y = 0;

    for (var i = 0; i < crdnum; i++) {
      x += gl.xs[i];
      y += gl.ys[i];
      gl.xs[i] = x;
      gl.ys[i] = y;
    }
  } else {
    var ARG_1_AND_2_ARE_WORDS = 1 << 0;
    var ARGS_ARE_XY_VALUES = 1 << 1;
    var WE_HAVE_A_SCALE = 1 << 3;
    var MORE_COMPONENTS = 1 << 5;
    var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
    var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
    var WE_HAVE_INSTRUCTIONS = 1 << 8;
    gl.parts = [];
    var flags;

    do {
      flags = bin.readUshort(data, offset);
      offset += 2;
      var part = {
        m: {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          tx: 0,
          ty: 0
        },
        p1: -1,
        p2: -1
      };
      gl.parts.push(part);
      part.glyphIndex = bin.readUshort(data, offset);
      offset += 2;

      if (flags & ARG_1_AND_2_ARE_WORDS) {
        var arg1 = bin.readShort(data, offset);
        offset += 2;
        var arg2 = bin.readShort(data, offset);
        offset += 2;
      } else {
        var arg1 = bin.readInt8(data, offset);
        offset++;
        var arg2 = bin.readInt8(data, offset);
        offset++;
      }

      if (flags & ARGS_ARE_XY_VALUES) {
        part.m.tx = arg1;
        part.m.ty = arg2;
      } else {
        part.p1 = arg1;
        part.p2 = arg2;
      }

      if (flags & WE_HAVE_A_SCALE) {
        part.m.a = part.m.d = bin.readF2dot14(data, offset);
        offset += 2;
      } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
        part.m.a = bin.readF2dot14(data, offset);
        offset += 2;
        part.m.d = bin.readF2dot14(data, offset);
        offset += 2;
      } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
        part.m.a = bin.readF2dot14(data, offset);
        offset += 2;
        part.m.b = bin.readF2dot14(data, offset);
        offset += 2;
        part.m.c = bin.readF2dot14(data, offset);
        offset += 2;
        part.m.d = bin.readF2dot14(data, offset);
        offset += 2;
      }
    } while (flags & MORE_COMPONENTS);

    if (flags & WE_HAVE_INSTRUCTIONS) {
      var numInstr = bin.readUshort(data, offset);
      offset += 2;
      gl.instr = [];

      for (var i = 0; i < numInstr; i++) {
        gl.instr.push(data[offset]);
        offset++;
      }
    }
  }

  return gl;
};

Typr.GPOS = {};

Typr.GPOS.parse = function (data, offset, length, font) {
  return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
};

Typr.GPOS.subt = function (data, ltype, offset) {
  if (ltype != 2) {
    return null;
  }

  var bin = Typr._bin,
      offset0 = offset,
      tab = {};
  tab.format = bin.readUshort(data, offset);
  offset += 2;
  var covOff = bin.readUshort(data, offset);
  offset += 2;
  tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
  tab.valFmt1 = bin.readUshort(data, offset);
  offset += 2;
  tab.valFmt2 = bin.readUshort(data, offset);
  offset += 2;

  var ones1 = Typr._lctf.numOfOnes(tab.valFmt1);

  var ones2 = Typr._lctf.numOfOnes(tab.valFmt2);

  if (tab.format == 1) {
    tab.pairsets = [];
    var count = bin.readUshort(data, offset);
    offset += 2;

    for (var i = 0; i < count; i++) {
      var psoff = bin.readUshort(data, offset);
      offset += 2;
      psoff += offset0;
      var pvcount = bin.readUshort(data, psoff);
      psoff += 2;
      var arr = [];

      for (var j = 0; j < pvcount; j++) {
        var gid2 = bin.readUshort(data, psoff);
        psoff += 2;
        var value1, value2;

        if (tab.valFmt1 != 0) {
          value1 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt1);
          psoff += ones1 * 2;
        }

        if (tab.valFmt2 != 0) {
          value2 = Typr._lctf.readValueRecord(data, psoff, tab.valFmt2);
          psoff += ones2 * 2;
        }

        arr.push({
          gid2: gid2,
          val1: value1,
          val2: value2
        });
      }

      tab.pairsets.push(arr);
    }
  }

  if (tab.format == 2) {
    var classDef1 = bin.readUshort(data, offset);
    offset += 2;
    var classDef2 = bin.readUshort(data, offset);
    offset += 2;
    var class1Count = bin.readUshort(data, offset);
    offset += 2;
    var class2Count = bin.readUshort(data, offset);
    offset += 2;
    tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
    tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
    tab.matrix = [];

    for (var i = 0; i < class1Count; i++) {
      var row = [];

      for (var j = 0; j < class2Count; j++) {
        var value1 = null,
            value2 = null;

        if (tab.valFmt1 != 0) {
          value1 = Typr._lctf.readValueRecord(data, offset, tab.valFmt1);
          offset += ones1 * 2;
        }

        if (tab.valFmt2 != 0) {
          value2 = Typr._lctf.readValueRecord(data, offset, tab.valFmt2);
          offset += ones2 * 2;
        }

        row.push({
          val1: value1,
          val2: value2
        });
      }

      tab.matrix.push(row);
    }
  }

  return tab;
};

Typr.GSUB = {};

Typr.GSUB.parse = function (data, offset, length, font) {
  return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
};

Typr.GSUB.subt = function (data, ltype, offset) {
  var bin = Typr._bin,
      offset0 = offset,
      tab = {};

  if (ltype != 1 && ltype != 4 && ltype != 5) {
    return null;
  }

  tab.fmt = bin.readUshort(data, offset);
  offset += 2;
  var covOff = bin.readUshort(data, offset);
  offset += 2;
  tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);

  if (ltype == 1) {
    if (tab.fmt == 1) {
      tab.delta = bin.readShort(data, offset);
      offset += 2;
    } else if (tab.fmt == 2) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      tab.newg = bin.readUshorts(data, offset, cnt);
      offset += tab.newg.length * 2;
    }
  } else if (ltype == 4) {
    tab.vals = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;

    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
    }
  } else if (ltype == 5) {
    if (tab.fmt == 2) {
      var cDefOffset = bin.readUshort(data, offset);
      offset += 2;
      tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
      tab.scset = [];
      var subClassSetCount = bin.readUshort(data, offset);
      offset += 2;

      for (var i = 0; i < subClassSetCount; i++) {
        var scsOff = bin.readUshort(data, offset);
        offset += 2;
        tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
      }
    } else {
      console.log("unknown table format", tab.fmt);
    }
  }

  return tab;
};

Typr.GSUB.readSubClassSet = function (data, offset) {
  var rUs = Typr._bin.readUshort,
      offset0 = offset,
      lset = [];
  var cnt = rUs(data, offset);
  offset += 2;

  for (var i = 0; i < cnt; i++) {
    var loff = rUs(data, offset);
    offset += 2;
    lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
  }

  return lset;
};

Typr.GSUB.readSubClassRule = function (data, offset) {
  var rUs = Typr._bin.readUshort,
      rule = {};
  var gcount = rUs(data, offset);
  offset += 2;
  var scount = rUs(data, offset);
  offset += 2;
  rule.input = [];

  for (var i = 0; i < gcount - 1; i++) {
    rule.input.push(rUs(data, offset));
    offset += 2;
  }

  rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
  return rule;
};

Typr.GSUB.readSubstLookupRecords = function (data, offset, cnt) {
  var rUs = Typr._bin.readUshort;
  var out = [];

  for (var i = 0; i < cnt; i++) {
    out.push(rUs(data, offset), rUs(data, offset + 2));
    offset += 4;
  }

  return out;
};

Typr.GSUB.readChainSubClassSet = function (data, offset) {
  var bin = Typr._bin,
      offset0 = offset,
      lset = [];
  var cnt = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < cnt; i++) {
    var loff = bin.readUshort(data, offset);
    offset += 2;
    lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
  }

  return lset;
};

Typr.GSUB.readChainSubClassRule = function (data, offset) {
  var bin = Typr._bin,
      rule = {};
  var pps = ["backtrack", "input", "lookahead"];

  for (var pi = 0; pi < pps.length; pi++) {
    var cnt = bin.readUshort(data, offset);
    offset += 2;

    if (pi == 1) {
      cnt--;
    }

    rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
    offset += rule[pps[pi]].length * 2;
  }

  var cnt = bin.readUshort(data, offset);
  offset += 2;
  rule.subst = bin.readUshorts(data, offset, cnt * 2);
  offset += rule.subst.length * 2;
  return rule;
};

Typr.GSUB.readLigatureSet = function (data, offset) {
  var bin = Typr._bin,
      offset0 = offset,
      lset = [];
  var lcnt = bin.readUshort(data, offset);
  offset += 2;

  for (var j = 0; j < lcnt; j++) {
    var loff = bin.readUshort(data, offset);
    offset += 2;
    lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
  }

  return lset;
};

Typr.GSUB.readLigature = function (data, offset) {
  var bin = Typr._bin,
      lig = {
    chain: []
  };
  lig.nglyph = bin.readUshort(data, offset);
  offset += 2;
  var ccnt = bin.readUshort(data, offset);
  offset += 2;

  for (var k = 0; k < ccnt - 1; k++) {
    lig.chain.push(bin.readUshort(data, offset));
    offset += 2;
  }

  return lig;
};

Typr.head = {};

Typr.head.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {};
  var tableVersion = bin.readFixed(data, offset);
  offset += 4;
  obj.fontRevision = bin.readFixed(data, offset);
  offset += 4;
  var checkSumAdjustment = bin.readUint(data, offset);
  offset += 4;
  var magicNumber = bin.readUint(data, offset);
  offset += 4;
  obj.flags = bin.readUshort(data, offset);
  offset += 2;
  obj.unitsPerEm = bin.readUshort(data, offset);
  offset += 2;
  obj.created = bin.readUint64(data, offset);
  offset += 8;
  obj.modified = bin.readUint64(data, offset);
  offset += 8;
  obj.xMin = bin.readShort(data, offset);
  offset += 2;
  obj.yMin = bin.readShort(data, offset);
  offset += 2;
  obj.xMax = bin.readShort(data, offset);
  offset += 2;
  obj.yMax = bin.readShort(data, offset);
  offset += 2;
  obj.macStyle = bin.readUshort(data, offset);
  offset += 2;
  obj.lowestRecPPEM = bin.readUshort(data, offset);
  offset += 2;
  obj.fontDirectionHint = bin.readShort(data, offset);
  offset += 2;
  obj.indexToLocFormat = bin.readShort(data, offset);
  offset += 2;
  obj.glyphDataFormat = bin.readShort(data, offset);
  offset += 2;
  return obj;
};

Typr.hhea = {};

Typr.hhea.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {};
  var tableVersion = bin.readFixed(data, offset);
  offset += 4;
  obj.ascender = bin.readShort(data, offset);
  offset += 2;
  obj.descender = bin.readShort(data, offset);
  offset += 2;
  obj.lineGap = bin.readShort(data, offset);
  offset += 2;
  obj.advanceWidthMax = bin.readUshort(data, offset);
  offset += 2;
  obj.minLeftSideBearing = bin.readShort(data, offset);
  offset += 2;
  obj.minRightSideBearing = bin.readShort(data, offset);
  offset += 2;
  obj.xMaxExtent = bin.readShort(data, offset);
  offset += 2;
  obj.caretSlopeRise = bin.readShort(data, offset);
  offset += 2;
  obj.caretSlopeRun = bin.readShort(data, offset);
  offset += 2;
  obj.caretOffset = bin.readShort(data, offset);
  offset += 2;
  offset += 4 * 2;
  obj.metricDataFormat = bin.readShort(data, offset);
  offset += 2;
  obj.numberOfHMetrics = bin.readUshort(data, offset);
  offset += 2;
  return obj;
};

Typr.hmtx = {};

Typr.hmtx.parse = function (data, offset, length, font) {
  var bin = Typr._bin;
  var obj = {};
  obj.aWidth = [];
  obj.lsBearing = [];
  var aw = 0,
      lsb = 0;

  for (var i = 0; i < font.maxp.numGlyphs; i++) {
    if (i < font.hhea.numberOfHMetrics) {
      aw = bin.readUshort(data, offset);
      offset += 2;
      lsb = bin.readShort(data, offset);
      offset += 2;
    }

    obj.aWidth.push(aw);
    obj.lsBearing.push(lsb);
  }

  return obj;
};

Typr.kern = {};

Typr.kern.parse = function (data, offset, length, font) {
  var bin = Typr._bin;
  var version = bin.readUshort(data, offset);
  offset += 2;

  if (version == 1) {
    return Typr.kern.parseV1(data, offset - 2, length, font);
  }

  var nTables = bin.readUshort(data, offset);
  offset += 2;
  var map = {
    glyph1: [],
    rval: []
  };

  for (var i = 0; i < nTables; i++) {
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    var coverage = bin.readUshort(data, offset);
    offset += 2;
    var format = coverage >>> 8;
    format &= 15;

    if (format == 0) {
      offset = Typr.kern.readFormat0(data, offset, map);
    } else {
      throw "unknown kern table format: " + format;
    }
  }

  return map;
};

Typr.kern.parseV1 = function (data, offset, length, font) {
  var bin = Typr._bin;
  var version = bin.readFixed(data, offset);
  offset += 4;
  var nTables = bin.readUint(data, offset);
  offset += 4;
  var map = {
    glyph1: [],
    rval: []
  };

  for (var i = 0; i < nTables; i++) {
    var length = bin.readUint(data, offset);
    offset += 4;
    var coverage = bin.readUshort(data, offset);
    offset += 2;
    var tupleIndex = bin.readUshort(data, offset);
    offset += 2;
    var format = coverage >>> 8;
    format &= 15;

    if (format == 0) {
      offset = Typr.kern.readFormat0(data, offset, map);
    } else {
      throw "unknown kern table format: " + format;
    }
  }

  return map;
};

Typr.kern.readFormat0 = function (data, offset, map) {
  var bin = Typr._bin;
  var pleft = -1;
  var nPairs = bin.readUshort(data, offset);
  offset += 2;
  var searchRange = bin.readUshort(data, offset);
  offset += 2;
  var entrySelector = bin.readUshort(data, offset);
  offset += 2;
  var rangeShift = bin.readUshort(data, offset);
  offset += 2;

  for (var j = 0; j < nPairs; j++) {
    var left = bin.readUshort(data, offset);
    offset += 2;
    var right = bin.readUshort(data, offset);
    offset += 2;
    var value = bin.readShort(data, offset);
    offset += 2;

    if (left != pleft) {
      map.glyph1.push(left);
      map.rval.push({
        glyph2: [],
        vals: []
      });
    }

    var rval = map.rval[map.rval.length - 1];
    rval.glyph2.push(right);
    rval.vals.push(value);
    pleft = left;
  }

  return offset;
};

Typr.loca = {};

Typr.loca.parse = function (data, offset, length, font) {
  var bin = Typr._bin;
  var obj = [];
  var ver = font.head.indexToLocFormat;
  var len = font.maxp.numGlyphs + 1;

  if (ver == 0) {
    for (var i = 0; i < len; i++) {
      obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    }
  }

  if (ver == 1) {
    for (var i = 0; i < len; i++) {
      obj.push(bin.readUint(data, offset + (i << 2)));
    }
  }

  return obj;
};

Typr.maxp = {};

Typr.maxp.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {};
  var ver = bin.readUint(data, offset);
  offset += 4;
  obj.numGlyphs = bin.readUshort(data, offset);
  offset += 2;

  if (ver == 65536) {
    obj.maxPoints = bin.readUshort(data, offset);
    offset += 2;
    obj.maxContours = bin.readUshort(data, offset);
    offset += 2;
    obj.maxCompositePoints = bin.readUshort(data, offset);
    offset += 2;
    obj.maxCompositeContours = bin.readUshort(data, offset);
    offset += 2;
    obj.maxZones = bin.readUshort(data, offset);
    offset += 2;
    obj.maxTwilightPoints = bin.readUshort(data, offset);
    offset += 2;
    obj.maxStorage = bin.readUshort(data, offset);
    offset += 2;
    obj.maxFunctionDefs = bin.readUshort(data, offset);
    offset += 2;
    obj.maxInstructionDefs = bin.readUshort(data, offset);
    offset += 2;
    obj.maxStackElements = bin.readUshort(data, offset);
    offset += 2;
    obj.maxSizeOfInstructions = bin.readUshort(data, offset);
    offset += 2;
    obj.maxComponentElements = bin.readUshort(data, offset);
    offset += 2;
    obj.maxComponentDepth = bin.readUshort(data, offset);
    offset += 2;
  }

  return obj;
};

Typr.name = {};

Typr.name.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {};
  var format = bin.readUshort(data, offset);
  offset += 2;
  var count = bin.readUshort(data, offset);
  offset += 2;
  var stringOffset = bin.readUshort(data, offset);
  offset += 2;
  var offset0 = offset;

  for (var i = 0; i < count; i++) {
    var platformID = bin.readUshort(data, offset);
    offset += 2;
    var encodingID = bin.readUshort(data, offset);
    offset += 2;
    var languageID = bin.readUshort(data, offset);
    offset += 2;
    var nameID = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    var noffset = bin.readUshort(data, offset);
    offset += 2;
    var plat = "p" + platformID;

    if (obj[plat] == null) {
      obj[plat] = {};
    }

    var names = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"];
    var cname = names[nameID];
    var soff = offset0 + count * 12 + noffset;
    var str;

    if (platformID == 0) {
      str = bin.readUnicode(data, soff, length / 2);
    } else if (platformID == 3 && encodingID == 0) {
      str = bin.readUnicode(data, soff, length / 2);
    } else if (encodingID == 0) {
      str = bin.readASCII(data, soff, length);
    } else if (encodingID == 1) {
      str = bin.readUnicode(data, soff, length / 2);
    } else if (encodingID == 3) {
      str = bin.readUnicode(data, soff, length / 2);
    } else if (platformID == 1) {
      str = bin.readASCII(data, soff, length);
      console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
    } else {
      throw "unknown encoding " + encodingID + ", platformID: " + platformID;
    }

    obj[plat][cname] = str;
    obj[plat]._lang = languageID;
  }

  for (var p in obj) {
    if (obj[p].postScriptName != null && obj[p]._lang == 1033) {
      return obj[p];
    }
  }

  for (var p in obj) {
    if (obj[p].postScriptName != null && obj[p]._lang == 3084) {
      return obj[p];
    }
  }

  for (var p in obj) {
    if (obj[p].postScriptName != null) {
      return obj[p];
    }
  }

  var tname;

  for (var p in obj) {
    tname = p;
    break;
  }

  console.log("returning name table with languageID " + obj[tname]._lang);
  return obj[tname];
};

Typr["OS/2"] = {};

Typr["OS/2"].parse = function (data, offset, length) {
  var bin = Typr._bin;
  var ver = bin.readUshort(data, offset);
  offset += 2;
  var obj = {};

  if (ver == 0) {
    Typr["OS/2"].version0(data, offset, obj);
  } else if (ver == 1) {
    Typr["OS/2"].version1(data, offset, obj);
  } else if (ver == 2 || ver == 3 || ver == 4) {
    Typr["OS/2"].version2(data, offset, obj);
  } else if (ver == 5) {
    Typr["OS/2"].version5(data, offset, obj);
  } else {
    throw "unknown OS/2 table version: " + ver;
  }

  return obj;
};

Typr["OS/2"].version0 = function (data, offset, obj) {
  var bin = Typr._bin;
  obj.xAvgCharWidth = bin.readShort(data, offset);
  offset += 2;
  obj.usWeightClass = bin.readUshort(data, offset);
  offset += 2;
  obj.usWidthClass = bin.readUshort(data, offset);
  offset += 2;
  obj.fsType = bin.readUshort(data, offset);
  offset += 2;
  obj.ySubscriptXSize = bin.readShort(data, offset);
  offset += 2;
  obj.ySubscriptYSize = bin.readShort(data, offset);
  offset += 2;
  obj.ySubscriptXOffset = bin.readShort(data, offset);
  offset += 2;
  obj.ySubscriptYOffset = bin.readShort(data, offset);
  offset += 2;
  obj.ySuperscriptXSize = bin.readShort(data, offset);
  offset += 2;
  obj.ySuperscriptYSize = bin.readShort(data, offset);
  offset += 2;
  obj.ySuperscriptXOffset = bin.readShort(data, offset);
  offset += 2;
  obj.ySuperscriptYOffset = bin.readShort(data, offset);
  offset += 2;
  obj.yStrikeoutSize = bin.readShort(data, offset);
  offset += 2;
  obj.yStrikeoutPosition = bin.readShort(data, offset);
  offset += 2;
  obj.sFamilyClass = bin.readShort(data, offset);
  offset += 2;
  obj.panose = bin.readBytes(data, offset, 10);
  offset += 10;
  obj.ulUnicodeRange1 = bin.readUint(data, offset);
  offset += 4;
  obj.ulUnicodeRange2 = bin.readUint(data, offset);
  offset += 4;
  obj.ulUnicodeRange3 = bin.readUint(data, offset);
  offset += 4;
  obj.ulUnicodeRange4 = bin.readUint(data, offset);
  offset += 4;
  obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
  offset += 4;
  obj.fsSelection = bin.readUshort(data, offset);
  offset += 2;
  obj.usFirstCharIndex = bin.readUshort(data, offset);
  offset += 2;
  obj.usLastCharIndex = bin.readUshort(data, offset);
  offset += 2;
  obj.sTypoAscender = bin.readShort(data, offset);
  offset += 2;
  obj.sTypoDescender = bin.readShort(data, offset);
  offset += 2;
  obj.sTypoLineGap = bin.readShort(data, offset);
  offset += 2;
  obj.usWinAscent = bin.readUshort(data, offset);
  offset += 2;
  obj.usWinDescent = bin.readUshort(data, offset);
  offset += 2;
  return offset;
};

Typr["OS/2"].version1 = function (data, offset, obj) {
  var bin = Typr._bin;
  offset = Typr["OS/2"].version0(data, offset, obj);
  obj.ulCodePageRange1 = bin.readUint(data, offset);
  offset += 4;
  obj.ulCodePageRange2 = bin.readUint(data, offset);
  offset += 4;
  return offset;
};

Typr["OS/2"].version2 = function (data, offset, obj) {
  var bin = Typr._bin;
  offset = Typr["OS/2"].version1(data, offset, obj);
  obj.sxHeight = bin.readShort(data, offset);
  offset += 2;
  obj.sCapHeight = bin.readShort(data, offset);
  offset += 2;
  obj.usDefault = bin.readUshort(data, offset);
  offset += 2;
  obj.usBreak = bin.readUshort(data, offset);
  offset += 2;
  obj.usMaxContext = bin.readUshort(data, offset);
  offset += 2;
  return offset;
};

Typr["OS/2"].version5 = function (data, offset, obj) {
  var bin = Typr._bin;
  offset = Typr["OS/2"].version2(data, offset, obj);
  obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
  offset += 2;
  obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
  offset += 2;
  return offset;
};

Typr.post = {};

Typr.post.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {};
  obj.version = bin.readFixed(data, offset);
  offset += 4;
  obj.italicAngle = bin.readFixed(data, offset);
  offset += 4;
  obj.underlinePosition = bin.readShort(data, offset);
  offset += 2;
  obj.underlineThickness = bin.readShort(data, offset);
  offset += 2;
  return obj;
};

Typr.SVG = {};

Typr.SVG.parse = function (data, offset, length) {
  var bin = Typr._bin;
  var obj = {
    entries: []
  };
  var offset0 = offset;
  var tableVersion = bin.readUshort(data, offset);
  offset += 2;
  var svgDocIndexOffset = bin.readUint(data, offset);
  offset += 4;
  var reserved = bin.readUint(data, offset);
  offset += 4;
  offset = svgDocIndexOffset + offset0;
  var numEntries = bin.readUshort(data, offset);
  offset += 2;

  for (var i = 0; i < numEntries; i++) {
    var startGlyphID = bin.readUshort(data, offset);
    offset += 2;
    var endGlyphID = bin.readUshort(data, offset);
    offset += 2;
    var svgDocOffset = bin.readUint(data, offset);
    offset += 4;
    var svgDocLength = bin.readUint(data, offset);
    offset += 4;
    var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
    var svg = bin.readUTF8(sbuf, 0, sbuf.length);

    for (var f = startGlyphID; f <= endGlyphID; f++) {
      obj.entries[f] = svg;
    }
  }

  return obj;
};

Typr.SVG.toPath = function (str) {
  var pth = {
    cmds: [],
    crds: []
  };

  if (str == null) {
    return pth;
  }

  var prsr = new DOMParser();
  var doc = prsr["parseFromString"](str, "image/svg+xml");
  var svg = doc.firstChild;

  while (svg.tagName != "svg") {
    svg = svg.nextSibling;
  }

  var vb = svg.getAttribute("viewBox");

  if (vb) {
    vb = vb.trim().split(" ").map(parseFloat);
  } else {
    vb = [0, 0, 1e3, 1e3];
  }

  Typr.SVG._toPath(svg.children, pth);

  for (var i = 0; i < pth.crds.length; i += 2) {
    var x = pth.crds[i],
        y = pth.crds[i + 1];
    x -= vb[0];
    y -= vb[1];
    y = -y;
    pth.crds[i] = x;
    pth.crds[i + 1] = y;
  }

  return pth;
};

Typr.SVG._toPath = function (nds, pth, fill) {
  for (var ni = 0; ni < nds.length; ni++) {
    var nd = nds[ni],
        tn = nd.tagName;
    var cfl = nd.getAttribute("fill");

    if (cfl == null) {
      cfl = fill;
    }

    if (tn == "g") {
      Typr.SVG._toPath(nd.children, pth, cfl);
    } else if (tn == "path") {
      pth.cmds.push(cfl ? cfl : "#000000");
      var d = nd.getAttribute("d");

      var toks = Typr.SVG._tokens(d);

      Typr.SVG._toksToPath(toks, pth);

      pth.cmds.push("X");
    } else if (tn == "defs") ;else {
      console.log(tn, nd);
    }
  }
};

Typr.SVG._tokens = function (d) {
  var ts = [],
      off = 0,
      rn = false,
      cn = "";

  while (off < d.length) {
    var cc = d.charCodeAt(off),
        ch = d.charAt(off);
    off++;
    var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";

    if (rn) {
      if (ch == "-") {
        ts.push(parseFloat(cn));
        cn = ch;
      } else if (isNum) {
        cn += ch;
      } else {
        ts.push(parseFloat(cn));

        if (ch != "," && ch != " ") {
          ts.push(ch);
        }

        rn = false;
      }
    } else {
      if (isNum) {
        cn = ch;
        rn = true;
      } else if (ch != "," && ch != " ") {
        ts.push(ch);
      }
    }
  }

  if (rn) {
    ts.push(parseFloat(cn));
  }

  return ts;
};

Typr.SVG._toksToPath = function (ts, pth) {
  var i = 0,
      x = 0,
      y = 0,
      ox = 0,
      oy = 0;
  var pc = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    S: 4,
    C: 6
  };
  var cmds = pth.cmds,
      crds = pth.crds;

  while (i < ts.length) {
    var cmd = ts[i];
    i++;

    if (cmd == "z") {
      cmds.push("Z");
      x = ox;
      y = oy;
    } else {
      var cmu = cmd.toUpperCase();

      var ps = pc[cmu],
          reps = Typr.SVG._reps(ts, i, ps);

      for (var j = 0; j < reps; j++) {
        var xi = 0,
            yi = 0;

        if (cmd != cmu) {
          xi = x;
          yi = y;
        }

        if (cmu == "M") {
          x = xi + ts[i++];
          y = yi + ts[i++];
          cmds.push("M");
          crds.push(x, y);
          ox = x;
          oy = y;
        } else if (cmu == "L") {
          x = xi + ts[i++];
          y = yi + ts[i++];
          cmds.push("L");
          crds.push(x, y);
        } else if (cmu == "H") {
          x = xi + ts[i++];
          cmds.push("L");
          crds.push(x, y);
        } else if (cmu == "V") {
          y = yi + ts[i++];
          cmds.push("L");
          crds.push(x, y);
        } else if (cmu == "C") {
          var x1 = xi + ts[i++],
              y1 = yi + ts[i++],
              x2 = xi + ts[i++],
              y2 = yi + ts[i++],
              x3 = xi + ts[i++],
              y3 = yi + ts[i++];
          cmds.push("C");
          crds.push(x1, y1, x2, y2, x3, y3);
          x = x3;
          y = y3;
        } else if (cmu == "S") {
          var co = Math.max(crds.length - 4, 0);
          var x1 = x + x - crds[co],
              y1 = y + y - crds[co + 1];
          var x2 = xi + ts[i++],
              y2 = yi + ts[i++],
              x3 = xi + ts[i++],
              y3 = yi + ts[i++];
          cmds.push("C");
          crds.push(x1, y1, x2, y2, x3, y3);
          x = x3;
          y = y3;
        } else {
          console.log("Unknown SVG command " + cmd);
        }
      }
    }
  }
};

Typr.SVG._reps = function (ts, off, ps) {
  var i = off;

  while (i < ts.length) {
    if (typeof ts[i] == "string") {
      break;
    }

    i += ps;
  }

  return (i - off) / ps;
};

if (Typr == null) {
  Typr = {};
}

if (Typr.U == null) {
  Typr.U = {};
}

Typr.U.codeToGlyph = function (font, code) {
  var cmap = font.cmap;
  var tind = -1;

  if (cmap.p0e4 != null) {
    tind = cmap.p0e4;
  } else if (cmap.p3e1 != null) {
    tind = cmap.p3e1;
  } else if (cmap.p1e0 != null) {
    tind = cmap.p1e0;
  }

  if (tind == -1) {
    throw "no familiar platform and encoding!";
  }

  var tab = cmap.tables[tind];

  if (tab.format == 0) {
    if (code >= tab.map.length) {
      return 0;
    }

    return tab.map[code];
  } else if (tab.format == 4) {
    var sind = -1;

    for (var i = 0; i < tab.endCount.length; i++) {
      if (code <= tab.endCount[i]) {
        sind = i;
        break;
      }
    }

    if (sind == -1) {
      return 0;
    }

    if (tab.startCount[sind] > code) {
      return 0;
    }

    var gli = 0;

    if (tab.idRangeOffset[sind] != 0) {
      gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
    } else {
      gli = code + tab.idDelta[sind];
    }

    return gli & 65535;
  } else if (tab.format == 12) {
    if (code > tab.groups[tab.groups.length - 1][1]) {
      return 0;
    }

    for (var i = 0; i < tab.groups.length; i++) {
      var grp = tab.groups[i];

      if (grp[0] <= code && code <= grp[1]) {
        return grp[2] + (code - grp[0]);
      }
    }

    return 0;
  } else {
    throw "unknown cmap table format " + tab.format;
  }
};

Typr.U.glyphToPath = function (font, gid) {
  var path = {
    cmds: [],
    crds: []
  };

  if (font.SVG && font.SVG.entries[gid]) {
    var p = font.SVG.entries[gid];

    if (p == null) {
      return path;
    }

    if (typeof p == "string") {
      p = Typr.SVG.toPath(p);
      font.SVG.entries[gid] = p;
    }

    return p;
  } else if (font.CFF) {
    var state = {
      x: 0,
      y: 0,
      stack: [],
      nStems: 0,
      haveWidth: false,
      width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0,
      open: false
    };

    Typr.U._drawCFF(font.CFF.CharStrings[gid], state, font.CFF, path);
  } else if (font.glyf) {
    Typr.U._drawGlyf(gid, font, path);
  }

  return path;
};

Typr.U._drawGlyf = function (gid, font, path) {
  var gl = font.glyf[gid];

  if (gl == null) {
    gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
  }

  if (gl != null) {
    if (gl.noc > -1) {
      Typr.U._simpleGlyph(gl, path);
    } else {
      Typr.U._compoGlyph(gl, font, path);
    }
  }
};

Typr.U._simpleGlyph = function (gl, p) {
  for (var c = 0; c < gl.noc; c++) {
    var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
    var il = gl.endPts[c];

    for (var i = i0; i <= il; i++) {
      var pr = i == i0 ? il : i - 1;
      var nx = i == il ? i0 : i + 1;
      var onCurve = gl.flags[i] & 1;
      var prOnCurve = gl.flags[pr] & 1;
      var nxOnCurve = gl.flags[nx] & 1;
      var x = gl.xs[i],
          y = gl.ys[i];

      if (i == i0) {
        if (onCurve) {
          if (prOnCurve) {
            Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
          } else {
            Typr.U.P.moveTo(p, x, y);
            continue;
          }
        } else {
          if (prOnCurve) {
            Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
          } else {
            Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y) / 2);
          }
        }
      }

      if (onCurve) {
        if (prOnCurve) {
          Typr.U.P.lineTo(p, x, y);
        }
      } else {
        if (nxOnCurve) {
          Typr.U.P.qcurveTo(p, x, y, gl.xs[nx], gl.ys[nx]);
        } else {
          Typr.U.P.qcurveTo(p, x, y, (x + gl.xs[nx]) / 2, (y + gl.ys[nx]) / 2);
        }
      }
    }

    Typr.U.P.closePath(p);
  }
};

Typr.U._compoGlyph = function (gl, font, p) {
  for (var j = 0; j < gl.parts.length; j++) {
    var path = {
      cmds: [],
      crds: []
    };
    var prt = gl.parts[j];

    Typr.U._drawGlyf(prt.glyphIndex, font, path);

    var m = prt.m;

    for (var i = 0; i < path.crds.length; i += 2) {
      var x = path.crds[i],
          y = path.crds[i + 1];
      p.crds.push(x * m.a + y * m.b + m.tx);
      p.crds.push(x * m.c + y * m.d + m.ty);
    }

    for (var i = 0; i < path.cmds.length; i++) {
      p.cmds.push(path.cmds[i]);
    }
  }
};

Typr.U._getGlyphClass = function (g, cd) {
  var intr = Typr._lctf.getInterval(cd, g);

  return intr == -1 ? 0 : cd[intr + 2];
};

Typr.U.getPairAdjustment = function (font, g1, g2) {
  if (font.GPOS) {
    var ltab = null;

    for (var i = 0; i < font.GPOS.featureList.length; i++) {
      var fl = font.GPOS.featureList[i];

      if (fl.tag == "kern") {
        for (var j = 0; j < fl.tab.length; j++) {
          if (font.GPOS.lookupList[fl.tab[j]].ltype == 2) {
            ltab = font.GPOS.lookupList[fl.tab[j]];
          }
        }
      }
    }

    if (ltab) {
      for (var i = 0; i < ltab.tabs.length; i++) {
        var tab = ltab.tabs[i];

        var ind = Typr._lctf.coverageIndex(tab.coverage, g1);

        if (ind == -1) {
          continue;
        }

        var adj;

        if (tab.format == 1) {
          var right = tab.pairsets[ind];

          for (var j = 0; j < right.length; j++) {
            if (right[j].gid2 == g2) {
              adj = right[j];
            }
          }

          if (adj == null) {
            continue;
          }
        } else if (tab.format == 2) {
          var c1 = Typr.U._getGlyphClass(g1, tab.classDef1);

          var c2 = Typr.U._getGlyphClass(g2, tab.classDef2);

          var adj = tab.matrix[c1][c2];
        }

        return adj.val1[2];
      }
    }
  }

  if (font.kern) {
    var ind1 = font.kern.glyph1.indexOf(g1);

    if (ind1 != -1) {
      var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);

      if (ind2 != -1) {
        return font.kern.rval[ind1].vals[ind2];
      }
    }
  }

  return 0;
};

Typr.U.stringToGlyphs = function (font, str) {
  var gls = [];

  for (var i = 0; i < str.length; i++) {
    var cc = str.codePointAt(i);

    if (cc > 65535) {
      i++;
    }

    gls.push(Typr.U.codeToGlyph(font, cc));
  }

  var gsub = font["GSUB"];

  if (gsub == null) {
    return gls;
  }

  var llist = gsub.lookupList,
      flist = gsub.featureList;
  var wsep = '\n\t" ,.:;!?()  ،';
  var R = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
  var L = "ꡲ્૗";

  for (var ci = 0; ci < gls.length; ci++) {
    var gl = gls[ci];
    var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
    var srgt = ci == gls.length - 1 || wsep.indexOf(str[ci + 1]) != -1;

    if (!slft && R.indexOf(str[ci - 1]) != -1) {
      slft = true;
    }

    if (!srgt && R.indexOf(str[ci]) != -1) {
      srgt = true;
    }

    if (!srgt && L.indexOf(str[ci + 1]) != -1) {
      srgt = true;
    }

    if (!slft && L.indexOf(str[ci]) != -1) {
      slft = true;
    }

    var feat = null;

    if (slft) {
      feat = srgt ? "isol" : "init";
    } else {
      feat = srgt ? "fina" : "medi";
    }

    for (var fi = 0; fi < flist.length; fi++) {
      if (flist[fi].tag != feat) {
        continue;
      }

      for (var ti = 0; ti < flist[fi].tab.length; ti++) {
        var tab = llist[flist[fi].tab[ti]];

        if (tab.ltype != 1) {
          continue;
        }

        Typr.U._applyType1(gls, ci, tab);
      }
    }
  }

  var cligs = ["rlig", "liga", "mset"];

  for (var ci = 0; ci < gls.length; ci++) {
    var gl = gls[ci];
    var rlim = Math.min(3, gls.length - ci - 1);

    for (var fi = 0; fi < flist.length; fi++) {
      var fl = flist[fi];

      if (cligs.indexOf(fl.tag) == -1) {
        continue;
      }

      for (var ti = 0; ti < fl.tab.length; ti++) {
        var tab = llist[fl.tab[ti]];

        for (var j = 0; j < tab.tabs.length; j++) {
          if (tab.tabs[j] == null) {
            continue;
          }

          var ind = Typr._lctf.coverageIndex(tab.tabs[j].coverage, gl);

          if (ind == -1) {
            continue;
          }

          if (tab.ltype == 4) {
            var vals = tab.tabs[j].vals[ind];

            for (var k = 0; k < vals.length; k++) {
              var lig = vals[k],
                  rl = lig.chain.length;

              if (rl > rlim) {
                continue;
              }

              var good = true;

              for (var l = 0; l < rl; l++) {
                if (lig.chain[l] != gls[ci + (1 + l)]) {
                  good = false;
                }
              }

              if (!good) {
                continue;
              }

              gls[ci] = lig.nglyph;

              for (var l = 0; l < rl; l++) {
                gls[ci + l + 1] = -1;
              }
            }
          } else if (tab.ltype == 5) {
            var ltab = tab.tabs[j];

            if (ltab.fmt != 2) {
              continue;
            }

            var cind = Typr._lctf.getInterval(ltab.cDef, gl);

            var cls = ltab.cDef[cind + 2],
                scs = ltab.scset[cls];

            for (var i = 0; i < scs.length; i++) {
              var sc = scs[i],
                  inp = sc.input;

              if (inp.length > rlim) {
                continue;
              }

              var good = true;

              for (var l = 0; l < inp.length; l++) {
                var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l]);

                if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l]) {
                  good = false;
                  break;
                }
              }

              if (!good) {
                continue;
              }

              var lrs = sc.substLookupRecords;

              for (var k = 0; k < lrs.length; k += 2) {
                var gi = lrs[k],
                    tabi = lrs[k + 1];
              }
            }
          }
        }
      }
    }
  }

  return gls;
};

Typr.U._applyType1 = function (gls, ci, tab) {
  var gl = gls[ci];

  for (var j = 0; j < tab.tabs.length; j++) {
    var ttab = tab.tabs[j];

    var ind = Typr._lctf.coverageIndex(ttab.coverage, gl);

    if (ind == -1) {
      continue;
    }

    if (ttab.fmt == 1) {
      gls[ci] = gls[ci] + ttab.delta;
    } else {
      gls[ci] = ttab.newg[ind];
    }
  }
};

Typr.U.glyphsToPath = function (font, gls, clr) {
  var tpath = {
    cmds: [],
    crds: []
  };
  var x = 0;

  for (var i = 0; i < gls.length; i++) {
    var gid = gls[i];

    if (gid == -1) {
      continue;
    }

    var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
    var path = Typr.U.glyphToPath(font, gid);

    for (var j = 0; j < path.crds.length; j += 2) {
      tpath.crds.push(path.crds[j] + x);
      tpath.crds.push(path.crds[j + 1]);
    }

    if (clr) {
      tpath.cmds.push(clr);
    }

    for (var j = 0; j < path.cmds.length; j++) {
      tpath.cmds.push(path.cmds[j]);
    }

    if (clr) {
      tpath.cmds.push("X");
    }

    x += font.hmtx.aWidth[gid];

    if (i < gls.length - 1) {
      x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
  }

  return tpath;
};

Typr.U.pathToSVG = function (path, prec) {
  if (prec == null) {
    prec = 5;
  }

  var out = [],
      co = 0,
      lmap = {
    M: 2,
    L: 2,
    Q: 4,
    C: 6
  };

  for (var i = 0; i < path.cmds.length; i++) {
    var cmd = path.cmds[i],
        cn = co + (lmap[cmd] ? lmap[cmd] : 0);
    out.push(cmd);

    while (co < cn) {
      var c = path.crds[co++];
      out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
    }
  }

  return out.join("");
};

Typr.U.pathToContext = function (path, ctx) {
  var c = 0,
      crds = path.crds;

  for (var j = 0; j < path.cmds.length; j++) {
    var cmd = path.cmds[j];

    if (cmd == "M") {
      ctx.moveTo(crds[c], crds[c + 1]);
      c += 2;
    } else if (cmd == "L") {
      ctx.lineTo(crds[c], crds[c + 1]);
      c += 2;
    } else if (cmd == "C") {
      ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
      c += 6;
    } else if (cmd == "Q") {
      ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
      c += 4;
    } else if (cmd.charAt(0) == "#") {
      ctx.beginPath();
      ctx.fillStyle = cmd;
    } else if (cmd == "Z") {
      ctx.closePath();
    } else if (cmd == "X") {
      ctx.fill();
    }
  }
};

Typr.U.P = {};

Typr.U.P.moveTo = function (p, x, y) {
  p.cmds.push("M");
  p.crds.push(x, y);
};

Typr.U.P.lineTo = function (p, x, y) {
  p.cmds.push("L");
  p.crds.push(x, y);
};

Typr.U.P.curveTo = function (p, a, b, c, d, e, f) {
  p.cmds.push("C");
  p.crds.push(a, b, c, d, e, f);
};

Typr.U.P.qcurveTo = function (p, a, b, c, d) {
  p.cmds.push("Q");
  p.crds.push(a, b, c, d);
};

Typr.U.P.closePath = function (p) {
  p.cmds.push("Z");
};

Typr.U._drawCFF = function (cmds, state, font, p) {
  var stack = state.stack;
  var nStems = state.nStems,
      haveWidth = state.haveWidth,
      width = state.width,
      open = state.open;
  var i = 0;
  var x = state.x,
      y = state.y,
      c1x = 0,
      c1y = 0,
      c2x = 0,
      c2y = 0,
      c3x = 0,
      c3y = 0,
      c4x = 0,
      c4y = 0,
      jpx = 0,
      jpy = 0;
  var o = {
    val: 0,
    size: 0
  };

  while (i < cmds.length) {
    Typr.CFF.getCharString(cmds, i, o);
    var v = o.val;
    i += o.size;

    if (v == "o1" || v == "o18") {
      var hasWidthArg;
      hasWidthArg = stack.length % 2 !== 0;

      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
      }

      nStems += stack.length >> 1;
      stack.length = 0;
      haveWidth = true;
    } else if (v == "o3" || v == "o23") {
      var hasWidthArg;
      hasWidthArg = stack.length % 2 !== 0;

      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
      }

      nStems += stack.length >> 1;
      stack.length = 0;
      haveWidth = true;
    } else if (v == "o4") {
      if (stack.length > 1 && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
        haveWidth = true;
      }

      if (open) {
        Typr.U.P.closePath(p);
      }

      y += stack.pop();
      Typr.U.P.moveTo(p, x, y);
      open = true;
    } else if (v == "o5") {
      while (stack.length > 0) {
        x += stack.shift();
        y += stack.shift();
        Typr.U.P.lineTo(p, x, y);
      }
    } else if (v == "o6" || v == "o7") {
      var count = stack.length;
      var isX = v == "o6";

      for (var j = 0; j < count; j++) {
        var sval = stack.shift();

        if (isX) {
          x += sval;
        } else {
          y += sval;
        }

        isX = !isX;
        Typr.U.P.lineTo(p, x, y);
      }
    } else if (v == "o8" || v == "o24") {
      var count = stack.length;
      var index = 0;

      while (index + 6 <= count) {
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        index += 6;
      }

      if (v == "o24") {
        x += stack.shift();
        y += stack.shift();
        Typr.U.P.lineTo(p, x, y);
      }
    } else if (v == "o11") {
      break;
    } else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
      if (v == "o1234") {
        c1x = x + stack.shift();
        c1y = y;
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        jpx = c2x + stack.shift();
        jpy = c2y;
        c3x = jpx + stack.shift();
        c3y = c2y;
        c4x = c3x + stack.shift();
        c4y = y;
        x = c4x + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
        Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
      }

      if (v == "o1235") {
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        jpx = c2x + stack.shift();
        jpy = c2y + stack.shift();
        c3x = jpx + stack.shift();
        c3y = jpy + stack.shift();
        c4x = c3x + stack.shift();
        c4y = c3y + stack.shift();
        x = c4x + stack.shift();
        y = c4y + stack.shift();
        stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
        Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
      }

      if (v == "o1236") {
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        jpx = c2x + stack.shift();
        jpy = c2y;
        c3x = jpx + stack.shift();
        c3y = c2y;
        c4x = c3x + stack.shift();
        c4y = c3y + stack.shift();
        x = c4x + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
        Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
      }

      if (v == "o1237") {
        c1x = x + stack.shift();
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        jpx = c2x + stack.shift();
        jpy = c2y + stack.shift();
        c3x = jpx + stack.shift();
        c3y = jpy + stack.shift();
        c4x = c3x + stack.shift();
        c4y = c3y + stack.shift();

        if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
          x = c4x + stack.shift();
        } else {
          y = c4y + stack.shift();
        }

        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
        Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y);
      }
    } else if (v == "o14") {
      if (stack.length > 0 && !haveWidth) {
        width = stack.shift() + font.nominalWidthX;
        haveWidth = true;
      }

      if (stack.length == 4) {
        var adx = stack.shift();
        var ady = stack.shift();
        var bchar = stack.shift();
        var achar = stack.shift();
        var bind = Typr.CFF.glyphBySE(font, bchar);
        var aind = Typr.CFF.glyphBySE(font, achar);

        Typr.U._drawCFF(font.CharStrings[bind], state, font, p);

        state.x = adx;
        state.y = ady;

        Typr.U._drawCFF(font.CharStrings[aind], state, font, p);
      }

      if (open) {
        Typr.U.P.closePath(p);
        open = false;
      }
    } else if (v == "o19" || v == "o20") {
      var hasWidthArg;
      hasWidthArg = stack.length % 2 !== 0;

      if (hasWidthArg && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
      }

      nStems += stack.length >> 1;
      stack.length = 0;
      haveWidth = true;
      i += nStems + 7 >> 3;
    } else if (v == "o21") {
      if (stack.length > 2 && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
        haveWidth = true;
      }

      y += stack.pop();
      x += stack.pop();

      if (open) {
        Typr.U.P.closePath(p);
      }

      Typr.U.P.moveTo(p, x, y);
      open = true;
    } else if (v == "o22") {
      if (stack.length > 1 && !haveWidth) {
        width = stack.shift() + font.Private.nominalWidthX;
        haveWidth = true;
      }

      x += stack.pop();

      if (open) {
        Typr.U.P.closePath(p);
      }

      Typr.U.P.moveTo(p, x, y);
      open = true;
    } else if (v == "o25") {
      while (stack.length > 6) {
        x += stack.shift();
        y += stack.shift();
        Typr.U.P.lineTo(p, x, y);
      }

      c1x = x + stack.shift();
      c1y = y + stack.shift();
      c2x = c1x + stack.shift();
      c2y = c1y + stack.shift();
      x = c2x + stack.shift();
      y = c2y + stack.shift();
      Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
    } else if (v == "o26") {
      if (stack.length % 2) {
        x += stack.shift();
      }

      while (stack.length > 0) {
        c1x = x;
        c1y = y + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x;
        y = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      }
    } else if (v == "o27") {
      if (stack.length % 2) {
        y += stack.shift();
      }

      while (stack.length > 0) {
        c1x = x + stack.shift();
        c1y = y;
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y = c2y;
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
      }
    } else if (v == "o10" || v == "o29") {
      var obj = v == "o10" ? font.Private : font;

      if (stack.length == 0) {
        console.log("error: empty stack");
      } else {
        var ind = stack.pop();
        var subr = obj.Subrs[ind + obj.Bias];
        state.x = x;
        state.y = y;
        state.nStems = nStems;
        state.haveWidth = haveWidth;
        state.width = width;
        state.open = open;

        Typr.U._drawCFF(subr, state, font, p);

        x = state.x;
        y = state.y;
        nStems = state.nStems;
        haveWidth = state.haveWidth;
        width = state.width;
        open = state.open;
      }
    } else if (v == "o30" || v == "o31") {
      var count,
          count1 = stack.length;
      var index = 0;
      var alternate = v == "o31";
      count = count1 & ~2;
      index += count1 - count;

      while (index < count) {
        if (alternate) {
          c1x = x + stack.shift();
          c1y = y;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          y = c2y + stack.shift();

          if (count - index == 5) {
            x = c2x + stack.shift();
            index++;
          } else {
            x = c2x;
          }

          alternate = false;
        } else {
          c1x = x;
          c1y = y + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();

          if (count - index == 5) {
            y = c2y + stack.shift();
            index++;
          } else {
            y = c2y;
          }

          alternate = true;
        }

        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y);
        index += 4;
      }
    } else if ((v + "").charAt(0) == "o") {
      console.log("Unknown operation: " + v, cmds);
      throw v;
    } else {
      stack.push(v);
    }
  }

  state.x = x;
  state.y = y;
  state.nStems = nStems;
  state.haveWidth = haveWidth;
  state.width = width;
  state.open = open;
};

var typr_js = Typr;
var TEXT_NEWLINE_REGEXP = /\r?\n/;

function registerFontClass(Zdog) {
  // Zdog.Font class
  var ZdogFont = function ZdogFont(props) {
    var this$1 = this; // Set missing props to default values

    props = Zdog.extend({
      src: ''
    }, props);
    this.src = props.src;
    this.font = null;
    this._hasLoaded = false;
    this._loadCallbacks = []; // Add this font instance to the internal font list

    Zdog.FontList.push(this); // Begin loading font file

    this._fetchFontResource(this.src).then(function (buffer) {
      var font = typr_js.parse(buffer); // check font fields to see if the font was parsed correctly

      if (!font.head || !font.hmtx || !font.hhea || !font.glyf) {
        // get a list of missing font fields (only checks for ones that zfont uses)
        var missingFields = ['head', 'hmtx', 'hhea', 'glyf'].filter(function (field) {
          return !font[field];
        });
        throw new Error("Typr.js could not parse this font (unable to find " + missingFields.join(', ') + ")");
      }

      return font;
    }).then(function (font) {
      this$1.font = font;
      this$1._hasLoaded = true;

      this$1._loadCallbacks.forEach(function (callback) {
        return callback();
      });
    }).catch(function (err) {
      throw new Error("Unable to load font from " + this$1.src + ":\n" + err);
    });
  };

  ZdogFont.prototype.waitForLoad = function waitForLoad() {
    var this$1 = this;
    return new Promise(function (resolve, reject) {
      // If the font is loaded, we can resolve right away
      if (this$1._hasLoaded && this$1._hasLoaded) {
        resolve();
      } // Otherwise, wait for it to load
      else {
          this$1._loadCallbacks.push(resolve);
        }
    });
  };

  ZdogFont.prototype.getFontScale = function getFontScale(fontSize) {
    if (!this._hasLoaded) {
      return null;
    } else {
      return 1 / this.font.head.unitsPerEm * fontSize;
    }
  };

  ZdogFont.prototype.measureText = function measureText(text, fontSize) {
    var this$1 = this;
    if (fontSize === void 0) fontSize = 64;

    if (!this._hasLoaded) {
      return null;
    }

    var lines = Array.isArray(text) ? text : text.split(TEXT_NEWLINE_REGEXP);
    var font = this.font;
    var advanceWidthTable = font.hmtx.aWidth;
    var fontScale = this.getFontScale(fontSize);
    var descender = font.hhea.descender;
    var ascender = font.hhea.ascender;
    var lineGap = font.hhea.lineGap;
    var lineWidths = lines.map(function (line) {
      var glyphs = typr_js.U.stringToGlyphs(this$1.font, line);
      return glyphs.reduce(function (advanceWidth, glyphId) {
        // stringToGlyphs returns an array on glyph IDs that is the same length as the text string
        // an ID can sometimes be -1 in cases where multiple characters are merged into a single ligature
        if (glyphId > -1 && glyphId < advanceWidthTable.length) {
          advanceWidth += advanceWidthTable[glyphId];
        }

        return advanceWidth;
      }, 0);
    });
    var width = Math.max.apply(Math, lineWidths);
    var lineHeight = 0 - descender + ascender;
    var height = lineHeight * lines.length; // Multiply by fontScale to convert from font units to pixels

    return {
      width: width * fontScale,
      height: height * fontScale,
      lineHeight: lineHeight * fontScale,
      lineWidths: lineWidths.map(function (width) {
        return width * fontScale;
      }),
      descender: descender * fontScale,
      ascender: ascender * fontScale
    };
  };

  ZdogFont.prototype.getTextPath = function getTextPath(text, fontSize, x, y, z, alignX, alignY) {
    var this$1 = this;
    if (fontSize === void 0) fontSize = 64;
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    if (alignX === void 0) alignX = 'left';
    if (alignY === void 0) alignY = 'bottom';

    if (!this._hasLoaded) {
      return [];
    }

    var lines = Array.isArray(text) ? text : text.split(TEXT_NEWLINE_REGEXP);
    var measurements = this.measureText(text, fontSize);
    var lineWidths = measurements.lineWidths;
    var lineHeight = measurements.lineHeight;
    return lines.map(function (line, lineIndex) {
      var ref = this$1.getTextOrigin(Object.assign({}, measurements, {
        width: lineWidths[lineIndex]
      }), x, y, z, alignX, alignY);
      var _x = ref[0];
      var _y = ref[1];
      var _z = ref[2];
      y += lineHeight;
      var glyphs = typr_js.U.stringToGlyphs(this$1.font, line);
      var path = typr_js.U.glyphsToPath(this$1.font, glyphs);
      return this$1._convertPathCommands(path, fontSize, _x, _y, z);
    }).flat();
  };

  ZdogFont.prototype.getTextGlyphs = function getTextGlyphs(text, fontSize, x, y, z, alignX, alignY) {
    var this$1 = this;
    if (fontSize === void 0) fontSize = 64;
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    if (alignX === void 0) alignX = 'left';
    if (alignY === void 0) alignY = 'bottom';

    if (!this._hasLoaded) {
      return [];
    }

    var measurements = this.measureText(text, fontSize);
    var advanceWidthTable = this.font.hmtx.aWidth;
    var fontScale = this.getFontScale(fontSize);
    var lineWidths = measurements.lineWidths;
    var lineHeight = measurements.lineHeight;
    var lines = Array.isArray(text) ? text : text.split(TEXT_NEWLINE_REGEXP);
    return lines.map(function (line, lineIndex) {
      var glyphs = typr_js.U.stringToGlyphs(this$1.font, line);
      var ref = this$1.getTextOrigin(Object.assign({}, measurements, {
        width: lineWidths[lineIndex]
      }), x, y, z, alignX, alignY);
      var _x = ref[0];
      var _y = ref[1];
      var _z = ref[2];
      y += lineHeight;
      return glyphs.filter(function (glyph) {
        return glyph !== -1;
      }).map(function (glyphId) {
        var path = typr_js.U.glyphToPath(this$1.font, glyphId);
        var shape = {
          translate: {
            x: _x,
            y: _y,
            z: _z
          },
          path: this$1._convertPathCommands(path, fontSize, 0, 0, 0)
        };
        _x += advanceWidthTable[glyphId] * fontScale;
        return shape;
      });
    }).flat();
  };

  ZdogFont.prototype.getTextOrigin = function getTextOrigin(measuement, x, y, z, alignX, alignY) {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    if (alignX === void 0) alignX = 'left';
    if (alignY === void 0) alignY = 'bottom';
    var width = measuement.width;
    var height = measuement.height;
    var lineHeight = measuement.lineHeight;

    switch (alignX) {
      case 'right':
        x -= width;
        break;

      case 'center':
        x -= width / 2;
        break;

      default:
        break;
    }

    switch (alignY) {
      case 'middle':
        y -= height / 2 - lineHeight;
        break;

      case 'bottom':
      default:
        y -= height - lineHeight;
        break;
    }

    return [x, y, z];
  }; // Convert Typr.js path commands to Zdog commands
  // Also apply font size scaling and coordinate adjustment
  // https://github.com/photopea/Typr.js
  // https://zzz.dog/shapes#shape-path-commands


  ZdogFont.prototype._convertPathCommands = function _convertPathCommands(path, fontSize, x, y, z) {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    var yDir = -1;
    var xDir = 1;
    var fontScale = this.getFontScale(fontSize);
    var commands = path.cmds; // Apply font scale to all coords

    var coords = path.crds.map(function (coord) {
      return coord * fontScale;
    }); // Convert coords to Zdog commands

    var startCoord = null;
    var coordOffset = 0;
    return commands.map(function (cmd) {
      var result = null;

      if (!startCoord) {
        startCoord = {
          x: x + coords[coordOffset] * xDir,
          y: y + coords[coordOffset + 1] * yDir,
          z: z
        };
      }

      switch (cmd) {
        case 'M':
          // moveTo command
          result = {
            move: {
              x: x + coords[coordOffset] * xDir,
              y: y + coords[coordOffset + 1] * yDir,
              z: z
            }
          };
          coordOffset += 2;
          return result;

        case 'L':
          // lineTo command
          result = {
            line: {
              x: x + coords[coordOffset] * xDir,
              y: y + coords[coordOffset + 1] * yDir,
              z: z
            }
          };
          coordOffset += 2;
          return result;

        case 'C':
          // curveTo command
          result = {
            bezier: [{
              x: x + coords[coordOffset] * xDir,
              y: y + coords[coordOffset + 1] * yDir,
              z: z
            }, {
              x: x + coords[coordOffset + 2] * xDir,
              y: y + coords[coordOffset + 3] * yDir,
              z: z
            }, {
              x: x + coords[coordOffset + 4] * xDir,
              y: y + coords[coordOffset + 5] * yDir,
              z: z
            }]
          };
          coordOffset += 6;
          return result;

        case 'Q':
          // arcTo command
          result = {
            arc: [{
              x: x + coords[coordOffset] * xDir,
              y: y + coords[coordOffset + 1] * yDir,
              z: z
            }, {
              x: x + coords[coordOffset + 2] * xDir,
              y: y + coords[coordOffset + 3] * yDir,
              z: z
            }]
          };
          coordOffset += 4;
          return result;

        case 'Z':
          // close path
          if (startCoord) {
            result = {
              line: startCoord
            };
            startCoord = null;
          }

          return result;
        // unhandled type
        // currently, #rrggbb and X types (used in multicolor fonts) aren't supported

        default:
          return result;
      }
    }).filter(function (cmd) {
      return cmd !== null;
    }); // filter out null commands
  };

  ZdogFont.prototype._fetchFontResource = function _fetchFontResource(source) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest(); // Fetch as an arrayBuffer for Typr.parse

      request.responseType = 'arraybuffer';
      request.open('GET', source, true);

      request.onreadystatechange = function (e) {
        if (request.readyState === 4) {
          if (request.status >= 200 && request.status < 300) {
            resolve(request.response);
          } else {
            reject("HTTP error " + request.status + ": " + request.statusText);
          }
        }
      };

      request.send(null);
    });
  };

  Zdog.Font = ZdogFont;
  return Zdog;
}

function objectWithoutProperties(obj, exclude) {
  var target = {};

  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k];

  return target;
}

function registerTextClass(Zdog) {
  // Zdog.Text class
  var ZdogText = /*@__PURE__*/function (superclass) {
    function ZdogText(props) {
      // Set missing props to default values
      props = Zdog.extend({
        font: null,
        value: '',
        fontSize: 64,
        textAlign: 'left',
        textBaseline: 'bottom'
      }, props); // Split props

      var font = props.font;
      var value = props.value;
      var fontSize = props.fontSize;
      var textAlign = props.textAlign;
      var textBaseline = props.textBaseline;
      var rest = objectWithoutProperties(props, ["font", "value", "fontSize", "textAlign", "textBaseline"]);
      var shapeProps = rest; // Create shape object

      superclass.call(this, Object.assign({}, shapeProps, {
        closed: true,
        visible: false,
        // hide until font is loaded
        path: [{}]
      }));
      this._font = null;
      this._value = value;
      this._fontSize = fontSize;
      this._textAlign = textAlign;
      this._textBaseline = textBaseline;
      this.font = font;
    }

    if (superclass) ZdogText.__proto__ = superclass;
    ZdogText.prototype = Object.create(superclass && superclass.prototype);
    ZdogText.prototype.constructor = ZdogText;
    var prototypeAccessors = {
      font: {
        configurable: true
      },
      value: {
        configurable: true
      },
      fontSize: {
        configurable: true
      },
      textAlign: {
        configurable: true
      },
      textBaseline: {
        configurable: true
      }
    };

    ZdogText.prototype.updateText = function updateText() {
      var path = this.font.getTextPath(this.value, this.fontSize, 0, 0, 0, this.textAlign, this.textBaseline);

      if (path.length == 0) {
        // zdog doesn't know what to do with empty path arrays
        this.path = [{}];
        this.visible = false;
      } else {
        this.path = path;
        this.visible = true;
      }

      this.updatePath();
    };

    prototypeAccessors.font.set = function (newFont) {
      var this$1 = this;
      this._font = newFont;
      this.font.waitForLoad().then(function () {
        this$1.updateText();
        this$1.visible = true; // Find root Zdog.Illustration instance

        var root = this$1.addTo;

        while (root.addTo !== undefined) {
          root = root.addTo;
        } // Update render graph


        if (root && typeof root.updateRenderGraph === 'function') {
          root.updateRenderGraph();
        }
      });
    };

    prototypeAccessors.font.get = function () {
      return this._font;
    };

    prototypeAccessors.value.set = function (newValue) {
      this._value = newValue;
      this.updateText();
    };

    prototypeAccessors.value.get = function () {
      return this._value;
    };

    prototypeAccessors.fontSize.set = function (newSize) {
      this._fontSize = newSize;
      this.updateText();
    };

    prototypeAccessors.fontSize.get = function () {
      return this._fontSize;
    };

    prototypeAccessors.textAlign.set = function (newValue) {
      this._textAlign = newValue;
      this.updateText();
    };

    prototypeAccessors.textAlign.get = function () {
      return this._textAlign;
    };

    prototypeAccessors.textBaseline.set = function (newValue) {
      this._textBaseline = newValue;
      this.updateText();
    };

    prototypeAccessors.textBaseline.get = function () {
      return this._textBaseline;
    };

    Object.defineProperties(ZdogText.prototype, prototypeAccessors);
    return ZdogText;
  }(Zdog.Shape);

  ZdogText.optionKeys = ZdogText.optionKeys.concat(['font', 'fontSize', 'value', 'textAlign', 'textBaseline']);
  Zdog.Text = ZdogText;
  return Zdog;
}

function objectWithoutProperties$1(obj, exclude) {
  var target = {};

  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k];

  return target;
}

function registerTextGroupClass(Zdog) {
  // Zdog.TextGroup class
  var ZdogTextGroup = /*@__PURE__*/function (superclass) {
    function ZdogTextGroup(props) {
      // Set missing props to default values
      props = Zdog.extend({
        font: null,
        value: '',
        fontSize: 64,
        textAlign: 'left',
        textBaseline: 'bottom',
        color: '#333',
        fill: false,
        stroke: 1
      }, props); // Split props

      var font = props.font;
      var value = props.value;
      var fontSize = props.fontSize;
      var textAlign = props.textAlign;
      var textBaseline = props.textBaseline;
      var color = props.color;
      var fill = props.fill;
      var stroke = props.stroke;
      var rest = objectWithoutProperties$1(props, ["font", "value", "fontSize", "textAlign", "textBaseline", "color", "fill", "stroke"]);
      var groupProps = rest; // Create group object

      superclass.call(this, Object.assign({}, groupProps, {
        visible: false
      }));
      this._font = null;
      this._value = value;
      this._fontSize = fontSize;
      this._textAlign = textAlign;
      this._textBaseline = textBaseline;
      this._color = color;
      this._fill = fill;
      this._stroke = stroke;
      this.font = font;
    }

    if (superclass) ZdogTextGroup.__proto__ = superclass;
    ZdogTextGroup.prototype = Object.create(superclass && superclass.prototype);
    ZdogTextGroup.prototype.constructor = ZdogTextGroup;
    var prototypeAccessors = {
      font: {
        configurable: true
      },
      value: {
        configurable: true
      },
      fontSize: {
        configurable: true
      },
      textAlign: {
        configurable: true
      },
      textBaseline: {
        configurable: true
      },
      color: {
        configurable: true
      },
      fill: {
        configurable: true
      },
      stroke: {
        configurable: true
      }
    };

    ZdogTextGroup.prototype.updateText = function updateText() {
      var this$1 = this; // Remove old children

      while (this.children.length > 0) {
        this.removeChild(this.children[0]);
      } // Get text paths for each glyph


      var glyphs = this.font.getTextGlyphs(this.value, this.fontSize, 0, 0, 0, this.textAlign, this.textBaseline); // Convert glyphs to new shapes

      glyphs.filter(function (shape) {
        return shape.path.length > 0;
      }).forEach(function (shape) {
        this$1.addChild(new Zdog.Shape({
          translate: shape.translate,
          path: shape.path,
          color: this$1.color,
          fill: this$1.fill,
          stroke: this$1.stroke,
          closed: true
        }));
      });
      this.updateFlatGraph();
    };

    prototypeAccessors.font.set = function (newFont) {
      var this$1 = this;
      this._font = newFont;

      this._font.waitForLoad().then(function () {
        this$1.updateText();
        this$1.visible = true; // Find root Zdog.Illustration instance

        var root = this$1.addTo;

        while (root.addTo !== undefined) {
          root = root.addTo;
        } // Update render graph


        if (root && typeof root.updateRenderGraph === 'function') {
          root.updateRenderGraph();
        }
      });
    };

    prototypeAccessors.font.get = function () {
      return this._font;
    };

    prototypeAccessors.value.set = function (newValue) {
      this._value = newValue;
      this.updateText();
    };

    prototypeAccessors.value.get = function () {
      return this._value;
    };

    prototypeAccessors.fontSize.set = function (newSize) {
      this._fontSize = newSize;
      this.updateText();
    };

    prototypeAccessors.fontSize.get = function () {
      return this._fontSize;
    };

    prototypeAccessors.textAlign.set = function (newValue) {
      this._textAlign = newValue;
      this.updateText();
    };

    prototypeAccessors.textAlign.get = function () {
      return this._textAlign;
    };

    prototypeAccessors.textBaseline.set = function (newValue) {
      this._textBaseline = newValue;
      this.updateText();
    };

    prototypeAccessors.textBaseline.get = function () {
      return this._textBaseline;
    };

    prototypeAccessors.color.set = function (newColor) {
      this._color = newColor;
      this.children.forEach(function (child) {
        return child.color = newColor;
      });
    };

    prototypeAccessors.color.get = function () {
      return this._color;
    };

    prototypeAccessors.fill.set = function (newFill) {
      this._fill = newFill;
      this.children.forEach(function (child) {
        return child.fill = newFill;
      });
    };

    prototypeAccessors.fill.get = function () {
      return this._fill;
    };

    prototypeAccessors.stroke.set = function (newStroke) {
      this._stroke = newStroke;
      this.children.forEach(function (child) {
        return child.stroke = newStroke;
      });
    };

    prototypeAccessors.stroke.get = function () {
      return this._stroke;
    };

    Object.defineProperties(ZdogTextGroup.prototype, prototypeAccessors);
    return ZdogTextGroup;
  }(Zdog.Group);

  ZdogTextGroup.optionKeys = ZdogTextGroup.optionKeys.concat(['color', 'fill', 'stroke', 'font', 'fontSize', 'value', 'textAlign', 'textBaseline']);
  Zdog.TextGroup = ZdogTextGroup;
  return Zdog;
}

var index = {
  init: function init(Zdog) {
    // Global font list to keep track of all fonts
    Zdog.FontList = []; // Helper to wait for all fonts to load

    Zdog.waitForFonts = function () {
      return Promise.all(Zdog.FontList.map(function (font) {
        return font.waitForLoad();
      }));
    }; // Register Zfont classes onto the Zdog object


    registerFontClass(Zdog);
    registerTextClass(Zdog);
    registerTextGroupClass(Zdog);
    return Zdog;
  },
  version: "1.2.7"
};
var _default = index;
exports.default = _default;
},{}],"zdog.js":[function(require,module,exports) {
"use strict";

var _zdog = _interopRequireDefault(require("zdog"));

var _zfont = _interopRequireDefault(require("zfont"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_zfont.default.init(_zdog.default); // create illo


var illo = new _zdog.default.Illustration({
  // set canvas with selector
  element: '.zdog-canvas',
  translate: {
    x: 1,
    y: 6
  }
});
var myFont = new _zdog.default.Font({
  src: './Soxe2banh.TTF'
});
new _zdog.default.Text({
  addTo: illo,
  font: myFont,
  value: '5',
  fontSize: 28,
  color: '#fff',
  fill: true,
  textAlign: 'center',
  textBaseline: 'middle'
}); // update & render

function animate() {
  illo.updateRenderGraph();
  requestAnimationFrame(animate);
}

animate();
},{"zdog":"../node_modules/zdog/js/index.js","zfont":"../node_modules/zfont/dist/zfont.es.js"}],"C:/Users/CHUNG/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50511" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/CHUNG/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","zdog.js"], null)
//# sourceMappingURL=/zdog.9397cb88.js.map