MD.Keyboard = function () {
  const keys = {
    "v": { name: "Select tool", label: "tools.select_tool", cb: () => state.set("canvasMode", "select") },
    "q": { name: "Freehand tool", label: "tools.pencil_tool", cb: () => state.set("canvasMode", "fhpath") },
    "l": { name: "Line tool", label: "tools.line_tool", cb: () => state.set("canvasMode", "line") },
    "r": { name: "Rectangle tool", label: "tools.rectangle_tool", cb: () => state.set("canvasMode", "rect") },
    "o": { name: "Ellipse tool", label: "tools.ellipse_tool", cb: () => state.set("canvasMode", "ellipse") },
    "s": { name: "Shape tool", label: "tools.shape_tool", cb: () => state.set("canvasMode", "shapelib") },
    "p": { name: "Path tool", label: "tools.path_tool", cb: () => state.set("canvasMode", "path") },
    "t": { name: "Text tool", label: "tools.text_tool", cb: () => state.set("canvasMode", "text") },
    "z": { name: "Zoom tool", label: "tools.zoom_tool", cb: () => state.set("canvasMode", "zoom") },
    // "e": { name: "Eyedropper tool",     cb: ()=> state.set("canvasMode", "eyedropper")},
    // "x": { name: "Focus fill/stroke", label: "tools.ellipse_tool", cb: () => editor.focusPaint() },
    // "shift_x": { name: "Switch fill/stroke", cb: () => editor.switchPaint() },
    "alt": { name: false, cb: () => $("#workarea").toggleClass("out", state.get("canvasMode") === "zoom") },
    "cmd_s": { name: "Save SVG File", label: "modal.shortcuts.save_svg_file", cb: () => editor.save() },
    "cmd_z": { name: "Undo", label: "menu.edit.undo", cb: () => editor.undo() },
    "cmd_y": { name: "Redo", label: "menu.edit.redo", cb: () => editor.redo() },
    "cmd_shift_z": { name: "Redo", label: "menu.edit.redo", cb: () => editor.redo() },
    "cmd_c": { name: "Copy", label: "menu.edit.copy", cb: () => editor.copySelected() },
    "cmd_x": { name: "Cut", label: "menu.edit.cut", cb: () => editor.cutSelected() },
    "cmd_v": { name: "Paste", label: "menu.edit.paste", cb: () => editor.pasteSelected() },
    "cmd_d": { name: "Duplicate", label: "menu.edit.duplicate", cb: () => editor.duplicateSelected() },
    "cmd_u": { name: "View source", label: "menu.view.source", cb: () => editor.source() },
    "cmd_a": { name: "Select All", label: "modal.shortcuts.select_all", cb: () => svgCanvas.selectAllInCurrentLayer() },
    "cmd_b": { name: "Set bold text", label: "modal.shortcuts.set_bold_text", cb: () => editor.text.setBold() },
    "cmd_i": { name: "Set italic text", label: "modal.shortcuts.set_italic_text", cb: () => editor.text.setItalic() },
    "cmd_g": { name: "Group selected", label: "modal.shortcuts.group_selected", cb: () => editor.groupSelected() },
    "cmd_shift_g": { name: "Ungroup", label: "modal.shortcuts.ungroup", cb: () => editor.ungroupSelected() },
    "cmd_o": { name: "Open SVG File", label: "menu.file.open_svg", cb: () => editor.import.open() },
    "cmd_k": { name: "Place image", label: "menu.file.place_image", cb: () => editor.import.place() },
    "backspace": { name: "Delete", label: "modal.shortcuts.delete", cb: () => editor.deleteSelected() },
    "delete": { name: "Delete", label: "modal.shortcuts.delete", cb: () => editor.deleteSelected() },
    "ctrl_arrowleft": { name: "Rotate -1deg", label: "modal.shortcuts.rotate-1deg", cb: () => editor.rotateSelected(0, 1) },
    "ctrl_arrowright": { name: "Rotate +1deg", label: "modal.shortcuts.rotate1deg", cb: () => editor.rotateSelected(1, 1) },
    "ctrl_shift_arrowleft": { name: "Rotate -5deg", label: "modal.shortcuts.rotate-5deg", cb: () => editor.rotateSelected(0, 5) },
    "ctrl_shift_arrowright": { name: "Rotate +5deg ", label: "modal.shortcuts.rotate5deg", cb: () => editor.rotateSelected(1, 5) },
    "shift_o": { name: "Next item", label: "modal.shortcuts.next_item", cb: () => svgCanvas.cycleElement(0) },
    "shift_p": { name: "Prev item", label: "modal.shortcuts.previous_item", cb: () => svgCanvas.cycleElement(1) },
    "shift_r": { name: "Show/hide rulers", label: "modal.shortcuts.show_hide_rulers", cb: () => editor.rulers.toggleRulers() },
    "cmd_+": { name: "Zoom in", label: "modal.shortcuts.zoom_in", cb: () => editor.zoom.multiply(1.5) },
    "cmd_-": { name: "Zoom out", label: "modal.shortcuts.zoom_out", cb: () => editor.zoom.multiply(0.75) },
    "cmd_=": { name: "Actual size", label: "modal.shortcuts.actual_size", cb: () => editor.zoom.reset() },
    "arrowleft": { name: "Nudge left", label: "modal.shortcuts.nudge_left", cb: () => editor.moveSelected(-1, 0) },
    "arrowright": { name: "Nudge right", label: "modal.shortcuts.nudge_right", cb: () => editor.moveSelected(1, 0) },
    "arrowup": { name: "Nudge up", label: "modal.shortcuts.nudge_up", cb: () => editor.moveSelected(0, -1) },
    "arrowdown": { name: "Nudge down", label: "modal.shortcuts.nudge_down", cb: () => editor.moveSelected(0, 1) },
    "shift_arrowleft": { name: "Jump left", label: "modal.shortcuts.jump_left", cb: () => editor.moveSelected(state.get("canvasSnapStep") * -1, 0) },
    "shift_arrowright": { name: "Jump right", label: "modal.shortcuts.jump_right", cb: () => editor.moveSelected(state.get("canvasSnapStep") * 1, 0) },
    "shift_arrowup": { name: "Jump up", label: "modal.shortcuts.jump_up", cb: () => editor.moveSelected(0, state.get("canvasSnapStep") * -1) },
    "shift_arrowdown": { name: "Jump down", label: "modal.shortcuts.jump_down", cb: () => editor.moveSelected(0, state.get("canvasSnapStep") * 1) },
    "cmd_arrowup": { name: "Bring forward", label: "menu.object.bring_forward", cb: () => editor.moveUpSelected() },
    "cmd_arrowdown": { name: "Send backward", label: "menu.object.send_backward", cb: () => editor.moveDownSelected() },
    "cmd_shift_arrowup": { name: "Bring to front", label: "menu.object.bring_to_front", cb: () => editor.moveToTopSelected() },
    "cmd_shift_arrowdown": { name: "Send to back", label: "menu.object.send_to_back", cb: () => editor.moveToBottomSelected() },
    "escape": { name: false, cb: () => editor.escapeMode() },
    "enter": { name: false, cb: () => editor.escapeMode() },
    " ": { name: "Pan canvas", label: "modal.shortcuts.pan_canvas", cb: (e) => editor.pan.startPan(e) },
  };

  document.addEventListener("keydown", function (e) {
    const exceptions = $(":focus").length || $("#color_picker").is(":visible");
    if (exceptions) return false;
    const modKey = !svgedit.browser.isMac() ? "ctrlKey" : "metaKey";
    const cmd = e[modKey] ? "cmd_" : "";
    const shift = e.shiftKey ? "shift_" : "";
    const key = cmd + shift + e.key.toLowerCase();
    const canvasMode = state.get("canvasMode");

    const modalIsOpen = Object.values(editor.modal).filter((modal) => {
      const isHidden = modal.el.classList.contains("hidden");
      if (!isHidden && key === "cmd_enter") modal.confirm();
      if (!isHidden && key === "escape") modal.close();
      return !isHidden;
    }).length;

    // keyboard shortcut exists for app
    if (!modalIsOpen && keys[key]) {
      e.preventDefault();
      keys[key].cb();
    }
  });

  document.addEventListener("keyup", function (e) {
    if ($("#color_picker").is(":visible")) return e;
    const canvasMode = state.get("canvasMode");
    const key = e.key.toLowerCase();
    const keys = {
      "alt": () => $("#workarea").removeClass("out"),
      " ": () => editor.pan.stopPan(),
    }
    if (keys[key]) {
      e.preventDefault();
      keys[key]();
    }
  })

  // modal shortcuts
  const shortcutEl = document.getElementById("shortcuts");
  const docFrag = document.createDocumentFragment();
  for (const key in keys) {
    const name = keys[key].name;
    const label = keys[key].label;
    if (!name) continue;
    const shortcut = document.createElement("div");
    shortcut.classList.add("shortcut")
    const chords = key.split("_");
    const shortcutKeys = document.createElement("div");
    shortcutKeys.classList.add("shortcut-keys")
    chords.forEach(key => {
      const shortcutKey = document.createElement("div");
      shortcutKey.classList.add("shortcut-key");
      if (key === "arrowright") key = "→";
      if (key === "arrowleft") key = "←";
      if (key === "arrowup") key = "↑";
      if (key === "arrowdown") key = "↓";
      if (key === " ") key = "SPACEBAR";
      if (key === "shift") key = "⇧";
      if (key === "cmd") key = svgedit.browser.isMac() ? "⌘" : "Ctrl";
      shortcutKey.textContent = key;
      shortcutKeys.appendChild(shortcutKey);
      shortcut.appendChild(shortcutKeys);
    });

    const shortcutName = document.createElement("div");
    shortcutName.classList.add("shortcut-name");
    shortcutName.textContent = name;
    shortcutName.setAttribute("data-i18n", label);
    shortcutKeys.appendChild(shortcutName);

    docFrag.appendChild(shortcutKeys);
  }

  shortcutEl.appendChild(docFrag);


}