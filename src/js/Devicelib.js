MD.Devicelib = function(){
    var current_d, cur_shape_id;
    var canv = svgCanvas;
    var cur_shape;
    var start_x, start_y;
    var svgroot = canv.getRootElem();
    var lastBBox = {};
  
    // 关闭dialog
    $(document).on("mousedown", function(e){
      if (!e.target.closest("#tools_device"))
        $("#tools_device").hide();
    })
    
    // This populates the category list
    var categories = {
      devices: "Devices",
    };
    
    var library = {
      'basic': {
        data: {
          "power": "M246.083 173.961c-4.986.208-8.934 4.224-8.934 9.141 0 7.41-3.186 13.296-9.418 17.521a112.938 112.938 0 01-7.202 4.501c-3.324 1.939-6.787 3.601-10.249 5.332-4.363 2.147-8.864 4.432-13.019 7.064-15.028 9.626-22.161 20.014-23.269 33.726-.139 1.662-.97 3.601-4.224 3.601h-39.543c-2.424 0-3.947-1.385-4.086-3.74-.831-11.704-6.648-21.33-18.283-30.332-4.709-3.67-9.972-6.233-15.512-9.003-1.593-.762-3.186-1.593-4.778-2.424l-.762-.416c-5.471-2.839-11.219-5.748-16.136-9.972-5.055-4.294-7.618-9.834-7.618-16.482V86.079c0-1.454.139-2.909 1.247-4.017 1.108-1.108 2.701-1.316 3.878-1.316h163.643c1.247 0 2.77.139 3.947 1.316 1.108 1.108 1.247 2.632 1.247 4.017a2325.027 2325.027 0 000 31.025v5.54c0 6.302 3.809 10.526 9.557 10.526 5.609 0 9.349-4.294 9.349-10.526V72.367c0-6.717-3.74-10.457-10.596-10.457h-31.994c-1.177 0-2.701-.139-3.878-1.247-1.108-1.177-1.247-2.701-1.247-3.947V38.918c0-8.864 0-17.729.139-26.524.139-6.648-2.147-10.388-7.548-12.327h-3.947c-5.402 1.939-7.687 5.54-7.548 12.05.139 8.864.139 17.798.139 26.662v17.936c0 1.316-.139 2.839-1.247 4.017-1.108 1.108-2.701 1.316-3.947 1.316h-68.491c-1.247 0-2.77-.139-3.878-1.316-1.108-1.108-1.247-2.632-1.247-4.017v-17.59c0-8.934 0-17.867.139-26.801.139-6.648-2.147-10.388-7.548-12.327h-3.947c-5.402 1.939-7.687 5.54-7.548 12.05.139 8.795.139 17.521.139 26.316v18.352c0 1.247-.139 2.839-1.247 3.947s-2.632 1.247-4.017 1.247c-5.125 0-10.249-.069-15.305-.069H55.086c-7.202.208-10.873 3.809-10.873 10.942v110.111c0 3.186.277 6.094.831 8.934 2.078 10.111 8.102 18.352 18.975 25.831 6.233 4.294 13.227 7.756 19.945 11.08l3.74 1.87c6.163 3.047 10.734 6.371 14.404 10.388 3.809 4.224 5.54 8.657 5.263 13.643-.139 2.285-.069 4.571 0 6.856v2.216c.069 6.163 3.947 10.042 10.18 10.042H136.111c1.108 0 2.493.139 3.532 1.247 1.108 1.108 1.177 2.632 1.108 3.601-.139 3.324-.069 6.717 0 10.111v1.385c.069 5.679 4.017 9.834 9.418 9.903 5.332 0 9.349-4.224 9.418-9.765v-.762c0-3.532.139-7.133 0-10.665 0-1.039 0-2.562 1.108-3.74 1.108-1.108 2.562-1.247 3.809-1.247 3.393 0 6.717.069 10.111.069h8.864c5.263-.069 9.211-4.017 9.418-9.349v-1.524c.139-2.147.208-4.224 0-6.163-1.108-9.834 4.778-15.859 9.349-19.529a49.215 49.215 0 018.31-5.471 477.741 477.741 0 018.38-4.294c4.917-2.493 10.042-5.055 14.82-7.964 12.396-7.548 19.183-16.205 21.399-27.216.693-3.255 1.177-6.787.762-10.111-.623-4.64-4.64-8.102-9.765-8.102l-.069-.206zm-115.582 29.502c-.208.415-.554 1.108-.485 1.385.277.346.554.485 1.039.485.277 0 .693 0 1.108-.208.762-.208 1.454-.831 2.216-1.524l54.017-49.792c2.701-2.493 3.393-4.986 2.147-7.964-.762-1.87-2.216-4.017-6.994-4.017h-28.255v-2.493c0-1.87.831-3.047 1.593-4.155l4.017-6.787c2.216-3.67 4.432-7.41 6.579-11.15.9-1.593 1.039-3.186.346-4.432-.693-1.247-2.216-1.939-4.155-2.008h-25.9c-2.008 0-3.324.762-4.294 2.562l-22.161 41.759c-1.108 2.147-1.385 4.155-.9 6.302 1.108 4.64 4.778 7.479 9.765 7.548H147.4s-2.839 6.163-3.186 6.856l-13.85 27.632h.137z",
        },
        buttons: []
      },
    };
    
    var cur_lib = library.basic;
    current_d = cur_lib.data.power;
  
    var mode_id = 'devicelib';
    
    function loadIcons() {
      $('#device_buttons').empty();
      
      // Show lib ones
      $('#device_buttons').append(cur_lib.buttons);
    }
    
    // 加载图形库
    function loadLibrary(cat_id) {
    
      var lib = library[cat_id];
      
      if(!lib) {
        $('#device_buttons').html('Loading...');
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
      
        var btn_div = $('<div id="device_buttons">');
        $('#tools_device > *').wrapAll(btn_div);
        
        var shower = $('#tool_device');
  
        loadLibrary('basic');
        
        // Do mouseup on parent element rather than each button
        $('#device_buttons').mouseup(function(evt) {
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
        
        $('#tools_device').prepend(shape_cats);
  
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
            "class": `db-device db-device-${cur_shape_id}`
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