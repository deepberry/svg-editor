MD.Shapelib = function(){
  var current_d, cur_shape_id;
  var canv = svgCanvas;
  var cur_shape;
  var start_x, start_y;
  var svgroot = canv.getRootElem();
  var lastBBox = {};

  // 关闭dialog
  $(document).on("mousedown", function(e){
    if (!e.target.closest("#tools_shapelib"))
      $("#tools_shapelib").hide();
  })
  
  // This populates the category list
  var categories = {
    // basic: 'Basic',
    common: "Common",
    // object: 'Objects',
    // symbol: 'Symbols',
    // arrow: 'Arrows',
    // flowchart: 'Flowchart',
    // nature: 'Nature',
    // game: 'Cards & Chess',
    // dialog_balloon: 'Dialog baloons',
    // music: 'Music',
    // weather: 'Weather &amp; Time',
    // ui: 'User Interface',
    // social: 'Social Web',
    // devices: "Devices",
  };
  
  var library = {
    'common': {
      data: {
        "horizontal_rect": "M 0 0 H 300 V 125 H 0 z",
        "vertical_rect": "M 100 0 V 400 H 225 V 0 z",
      },
      buttons: [],
      fnKeys: {
        "horizontal_rect": "horizontal_rect",
        "vertical_rect": "vertical_rect",
      }
    }
  };
  
  var cur_lib = library.common;
  current_d = cur_lib.data.horizontal_rect;

  var mode_id = 'shapelib';
  
  function loadIcons() {
    $('#shape_buttons').empty();
    
    // Show lib ones
    $('#shape_buttons').append(cur_lib.buttons);
  }
  
  // 加载图形库
  function loadLibrary(cat_id) {
  
    var lib = library[cat_id];
    
    if(!lib) {
      $('#shape_buttons').html('Loading...');
      $.getJSON('shapelib/' + cat_id + '.json', function(result, textStatus) {
        cur_lib = library[cat_id] = {
          data: result.data,
          size: result.size,
          fill: result.fill
        }
        makeButtons(cat_id, result);
        loadIcons();
      });
      return;
    }
    
    cur_lib = lib;
    if(!lib.buttons.length) makeButtons(cat_id, lib);
    loadIcons();
  }
  // 生成图形库按钮
  function makeButtons(cat, shapes) {
    var size = cur_lib.size || 300;
    var fill = cur_lib.fill || false;
    var off = size * .05;
    var vb = [-off, -off, size + off*2, size + off*2].join(' ');
    var stroke = fill ? 0: (size/30);
    
    var shape_icon = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"><path /><\/svg>',
      'text/xml');

    var width = 40;
    var height = 40;
    shape_icon.documentElement.setAttribute('width', width);
    shape_icon.documentElement.setAttribute('height', height);
    var svg_elem = $(document.importNode(shape_icon.documentElement,true));
  
    var data = shapes.data;
    
    cur_lib.buttons = [];
  
    for(var id in data) {
      var path_d = data[id];
      var icon = svg_elem.clone();
      icon.find('path').attr('d', path_d);
      
      var icon_btn = icon.wrap('<div class="tool_button">').parent().attr({
        id: mode_id + '_' + id,
        title: id,
        'data-action': cur_lib.fnKeys && cur_lib.fnKeys[id] || null,
        fill: "#043d75"
      });
      
      // Store for later use
      cur_lib.buttons.push(icon_btn[0]);
    }
    
  }
  
  return {
    callback: function() {
    
      var btn_div = $('<div id="shape_buttons">');
      $('#tools_shapelib > *').wrapAll(btn_div);
      
      var shower = $('#tool_shapelib');

      loadLibrary('common');
      
      // Do mouseup on parent element rather than each button
      $('#shape_buttons').mouseup(function(evt) {
        var btn = $(evt.target).closest('div.tool_button');
        
        if(!btn.length) return;
        
        var copy = btn.children().clone().attr({width: 24, height: 24});
        shower.children(':not(.flyout_arrow_horiz)').remove();
        shower
          .append(copy)
          .attr('data-curopt', '#' + btn[0].id) // This sets the current mode
          .mouseup();
        canv.setMode(mode_id);
        
        cur_shape_id = btn[0].id.substr((mode_id+'_').length);
        current_d = cur_lib.data[cur_shape_id];

        const action = btn[0].getAttribute("data-action");
        if (action && editor[action]) {
          editor[action]();
        }
        
        $('.tools_flyout').fadeOut();

      });

      var shape_cats = $('<div id="shape_cats">');
      var cat_str = '';
      
      $.each(categories, function(id, label) {
        cat_str += `<div data-cat='${id}' data-i18n='shape.${id}'></div>`;
      });
      shape_cats.html(cat_str)
      $("[data-cat]", shape_cats)
        .on('click', function(e) {
          var catlink = $(this);
          catlink.siblings().removeClass('current');
          catlink.addClass('current');
          loadLibrary(catlink.attr('data-cat'));
      });
      
      shape_cats.children().eq(0).addClass('current');
      
      $('#tools_shapelib').prepend(shape_cats);

      shower.mouseup(function() {
        canv.setMode(current_d ? mode_id : 'select');
      });

  
    },
    mouseDown: function(opts) {
      var mode = canv.getMode();
      if(mode !== mode_id) return;
      
      var e = opts.event;
      var x = start_x = opts.start_x;
      var y = start_y = opts.start_y;
      var cur_style = canv.getStyle();
      // 绘制svg
      cur_shape = canv.addSvgElementFromJson({
        "element": "path",
        "curStyles": true,
        "attr": {
          "d": current_d,
          "id": canv.getNextId(),
          "opacity": cur_style.opacity / 2,
          "style": "pointer-events:none",
          "class": `db-shape db-shape-${cur_shape_id}`
        }
      });
      cur_shape.setAttribute("d", current_d);
      // Make sure shape uses absolute values
      if(/[a-z]/.test(current_d)) {
        current_d = cur_lib.data[cur_shape_id] = canv.pathActions.convertPath(cur_shape);
        cur_shape.setAttribute('d', current_d);
        canv.pathActions.fixEnd(cur_shape);
      }
      
      cur_shape.setAttribute('transform', "translate(" + x + "," + y + ") scale(0.005) translate(" + -x + "," + -y + ")");      
      canv.recalculateDimensions(cur_shape);
      var tlist = canv.getTransformList(cur_shape);
      lastBBox = cur_shape.getBBox();
      totalScale = {
        sx: 1,
        sy: 1
      };
      return {
        started: true
      }
      // current_d
    },
    mouseMove: function(opts) {
      var mode = canv.getMode();
      if(mode !== mode_id) return;
      
      var zoom = canv.getZoom();
      var evt = opts.event
      
      var x = opts.mouse_x/zoom;
      var y = opts.mouse_y/zoom;
      
      var tlist = canv.getTransformList(cur_shape),
        box = cur_shape.getBBox(), 
        left = box.x, top = box.y, width = box.width,
        height = box.height;
      var dx = (x-start_x), dy = (y-start_y);

      var newbox = {
        'x': Math.min(start_x,x),
        'y': Math.min(start_y,y),
        'width': Math.abs(x-start_x),
        'height': Math.abs(y-start_y)
      };

      var ts = null,
        tx = 0, ty = 0,
        sy = height ? (height+dy)/height : 1, 
        sx = width ? (width+dx)/width : 1;

      var sx = newbox.width / lastBBox.width;
      var sy = newbox.height / lastBBox.height;
      
      sx = sx || 1;
      sy = sy || 1;
      
      // Not perfect, but mostly works...
      
      if(x < start_x) {
        tx = lastBBox.width;
      }
      if(y < start_y) ty = lastBBox.height;
      
      // update the transform list with translate,scale,translate
      var translateOrigin = svgroot.createSVGTransform(),
        scale = svgroot.createSVGTransform(),
        translateBack = svgroot.createSVGTransform();
        
      translateOrigin.setTranslate(-(left+tx), -(top+ty));
      if(evt.shiftKey) {
        replaced = true
        var max = Math.min(Math.abs(sx), Math.abs(sy));
        sx = max * (sx < 0 ? -1 : 1);
        sy = max * (sy < 0 ? -1 : 1);
        if (totalScale.sx != totalScale.sy) {
          var multiplierX = (totalScale.sx > totalScale.sy) ? 1 : totalScale.sx/totalScale.sy;
          var multiplierY = (totalScale.sy > totalScale.sx) ? 1 : totalScale.sy/totalScale.sx;
          sx *= multiplierY
          sy *= multiplierX
        }
      }
      totalScale.sx *= sx;
      totalScale.sy *= sy;
      scale.setScale(sx,sy);
      translateBack.setTranslate(left+tx, top+ty);
      var N = tlist.numberOfItems;
      tlist.appendItem(translateBack);
      tlist.appendItem(scale);
      tlist.appendItem(translateOrigin);

      canv.recalculateDimensions(cur_shape);
      lastBBox = cur_shape.getBBox();
    },
    mouseUp: function(opts) {
      var mode = canv.getMode();
      if(mode !== mode_id) return;
      
      if(opts.mouse_x == start_x && opts.mouse_y == start_y) {
        return {
          keep: false,
          element: cur_shape,
          started: false
        }
      }

      return {
        keep: true,
        element: cur_shape,
        started: false
      }
    }   
  }
}