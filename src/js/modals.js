// globals
const svgCanvas = new $.SvgCanvas(document.getElementById("svgcanvas"));
const editor = new MD.Editor();
const state = new State();

editor.modal = {
  about: new MD.Modal({
    html: `
      <h1>About this application</h1>
      <p>Method Draw is a simple <a href="https://github.com/methodofaction/Method-Draw">open source</a> vector drawing application. Method Draw was forked from <a href="https://github.com/SVG-Edit/svgedit">SVG-Edit</a> several years ago with the goal of improving and modernizing the interface.</p>
      <p>At this time (2021), the author (<a href="http://method.ac/writing">Mark MacKay</a>) is working on improving stability and improving the codebase, which contains a lot of legacy practices. The goal is to create a vector editor suitable for simple graphic design tasks.</p>
      `
  }),
  source: new MD.Modal({
    html: `
      <div id="svg_source_editor">
        <div id="svg_source_overlay" class="overlay"></div>
        <div id="svg_source_container">
          <form>
            <textarea id="svg_source_textarea" spellcheck="false"></textarea>
          </form>
          <div id="tool_source_back" class="toolbar_button">
            <button id="tool_source_cancel" class="cancel" data-i18n="modal.source.cancel">Cancel</button>
            <button id="tool_source_save" class="ok" data-i18n="modal.source.apply_change">Apply Changes</button>
          </div>
        </div>
    </div>`,
    js: function (el) {
      el.children[0].classList.add("modal-item-source");
      el.querySelector("#tool_source_save").addEventListener("click", function () {
        var saveChanges = function () {
          svgCanvas.clearSelection();
          $('#svg_source_textarea').blur();
          editor.zoom.multiply(1);
          editor.rulers.update();
          editor.paintBox.fill.prep();
          editor.paintBox.stroke.prep();
          editor.modal.source.close();
        }

        if (!svgCanvas.setSvgString($('#svg_source_textarea').val())) {
          $.confirm("There were parsing errors in your SVG source.\nRevert back to original SVG source?", function (ok) {
            if (!ok) return false;
            saveChanges();
          });
        } else {
          saveChanges();
        }
      })
      el.querySelector("#tool_source_cancel").addEventListener("click", function () {
        editor.modal.source.close();
      });
    }
  }),
  configure: new MD.Modal({
    html: `
      <h1 data-i18n="modal.configure.name" style="text-align:center">Configuration</h1>
      <div id="configuration">
        <button class="warning" data-i18n="modal.configure.erase_all_data">Erase all data</button>
        </div>
      </div>`,
    js: function (el) {
      const input = el.querySelector("#configuration button.warning");
      input.addEventListener("click", function () {
        state.clean();
      })
    }
  }),
  donate: new MD.Modal({
    html: `
      <h1>Donate</h1>
      <p>
        Method Draw relies on your generous donations for continued development.
        <a href="https://method.ac/donate/">Donate now</a> if you find this application useful.
      </p>`
  }),
  shortcuts: new MD.Modal({
    html: `
      <h1 data-i18n="modal.shortcuts.name">Shortcuts</h1>
      <div id="shortcuts"></div>`,
    js: function (el) {
      el.children[0].classList.add("modal-item-wide");
    }
  }),
  // 横向矩形
  horizontal_rect: new MD.Modal({
    html: `
      <div class="m-rect-dialog">
        <div class="m-rect-dialog__content">
          <label for="rect_rows" data-i18n="modal.horizontal_rect.name"></label>
          <textarea rows="1" type="text" class="u-input" id="rect_rows" data-i18n="[placeholder]modal.horizontal_rect.name" required name="rect_Rows" value="5"></textarea>
        </div>
        <div id="tool_horizontal_rect" class="toolbar_button">
          <button id="horizontal_rect_cancel" class="cancel" data-i18n="modal.source.cancel">Cancel</button>
          <button id="horizontal_rect_save" class="ok" data-i18n="modal.horizontal_rect.confirm">Confirm</button>
        </div>
      </div>`,
    js: function (el) {
      el.querySelector("#horizontal_rect_cancel").addEventListener("click", function () {
        editor.modal.horizontal_rect.close();
      });

      el.querySelector("#horizontal_rect_save").addEventListener("click", function () {
        // get the value jquery way
        const rows = $("#rect_rows").val();

        // 根据输入的行数，生成svg，
        // 1. 生成一个矩形
        // 2. 根据行数在矩形内画线
        // 3. 保存svg
        // 4. 关闭modal
        // 5. 清空输入框

        const canv = svgCanvas;
        const width = 300,height=200;

        const group = canv.addSvgElementFromJson({
          "element": "g",
          "curStyles": true,
          "attr": {
            "style": "pointer-events:none"
          }
        });

        const cur_shape = canv.addSvgElementFromJson({
          "element": "rect",
          "curStyles": true,
          "attr": {
            "x": 20,
            "y": 20,
            "width": width,
            "height": height,
            "id": canv.getNextId(),
            "style": "pointer-events:none",
            "stroke-width": "1",
            "fill": "none"
          }
        });

        group.append(cur_shape);

        // 循环加入线条 rows表示行数
        for(let i = 1; i <= rows; i++) {
          // 计算间隔
          const gap = height / (~~rows + 1);
          // 画线
          const line = canv.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": {
              "x1": 20,
              "y1": 20 + i * gap,
              "x2": width + 20,
              "y2": 20 + i * gap,
              "id": canv.getNextId(),
              "style": "pointer-events:none",
              "stroke-width": "1",
              "fill": "none"
            }
          });
          group.append(line);
        }

        canv.recalculateDimensions(group);

        editor.modal.horizontal_rect.close();

        // 切换至选择模式
        $("#tool_select").click();
      });
    }
  }),
  // 纵向矩形
  vertical_rect: new MD.Modal({
    html: `
      <div class="m-rect-dialog">
        <div class="m-rect-dialog__content">
          <label for="rect_rows_v" data-i18n="modal.horizontal_rect.name"></label>
          <textarea rows="1" type="text" class="u-input" id="rect_rows_v" data-i18n="[placeholder]modal.horizontal_rect.name" required name="rect_rows_v" value="5"></textarea>
        </div>
        <div id="tool_vertical_rect" class="toolbar_button">
          <button id="vertical_rect_cancel" class="cancel" data-i18n="modal.source.cancel">Cancel</button>
          <button id="vertical_rect_save" class="ok" data-i18n="modal.horizontal_rect.confirm">Confirm</button>
        </div>
      </div>`,
    js: function (el) {
      el.querySelector("#vertical_rect_cancel").addEventListener("click", function () {
        editor.modal.vertical_rect.close();
      });

      el.querySelector("#vertical_rect_save").addEventListener("click", function () {
        // get the value jquery way
        const rows = $("#rect_rows_v").val();

        // 根据输入的行数，生成svg，
        // 1. 生成一个矩形
        // 2. 根据行数在矩形内画线
        // 3. 保存svg
        // 4. 关闭modal
        // 5. 清空输入框

        const canv = svgCanvas;
        const width=200,height=300;

        const group = canv.addSvgElementFromJson({
          "element": "g",
          "curStyles": true,
          "attr": {
            "style": "pointer-events:none"
          }
        });

        const cur_shape = canv.addSvgElementFromJson({
          "element": "rect",
          "curStyles": true,
          "attr": {
            "x": 20,
            "y": 20,
            "width": width,
            "height": height,
            "id": canv.getNextId(),
            "style": "pointer-events:none",
            "stroke-width": "1",
            "fill": "none"
          }
        });

        group.append(cur_shape);

        // 循环加入线条 rows表示行数
        for(let i = 1; i <= rows; i++) {
          // 计算间隔
          const gap = width / (~~rows + 1);
          // 画线
          const line = canv.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": {
              "x1": 20 + i * gap,
              "y1": 20,
              "x2": 20 + i * gap,
              "y2": height+20,
              "id": canv.getNextId(),
              "style": "pointer-events:none",
              "stroke-width": "1",
              "fill": "none"
            }
          });
          group.append(line);
        }

        canv.recalculateDimensions(group);
        editor.modal.vertical_rect.close();

        // 切换至选择模式
        $("#tool_select").click();
      });
    }
  }),
};