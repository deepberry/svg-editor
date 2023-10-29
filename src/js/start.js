var env = getEnv();
var API = {
  'preview': 'https://gray.api.deepberry.cn',
  'build': 'https://api.deepberry.cn',
  'undefined': "http://localhost:10090"
}[env]

editor.keyboard = new MD.Keyboard();
editor.menu = new MD.Menu();
editor.toolbar = new MD.Toolbar();
editor.rulers = new MD.Rulers();
editor.canvas = new MD.Canvas();
editor.text = new MD.Text();
editor.panel = new MD.Panel();
editor.zoom = new MD.Zoom();
editor.paintBox = {
  fill: new MD.PaintBox('#fill_color', 'fill'),
  stroke: new MD.PaintBox('#stroke_color', 'stroke'),
  canvas: new MD.PaintBox('#canvas_color', 'canvas')
};
editor.palette = new MD.Palette();
editor.pan = new MD.Pan();

editor.import = new MD.Import();
editor.contextMenu = new MD.ContextMenu();
editor.darkmode = new MD.Darkmode();
editor.title = new MD.Title();

// bind the selected event to our function that handles updates to the UI
svgCanvas.bind("selected", editor.selectedChanged);
svgCanvas.bind("transition", editor.elementTransition);
svgCanvas.bind("changed", editor.elementChanged);
svgCanvas.bind("exported", editor.exportHandler);
svgCanvas.bind("zoomed", editor.zoom.changed);
svgCanvas.bind("contextset", editor.contextChanged);
svgCanvas.bind("extension_added", editor.extensionAdded);
svgCanvas.textActions.setInputElem($("#text")[0]);
const shapeLib = svgCanvas.addExtension.apply(this, ["shapes", MD.Shapelib]);
const deviceLib = svgCanvas.addExtension.apply(this, ["devices", MD.Devicelib]);
const eyedropper = svgCanvas.addExtension.apply(this, ["eyedropper", MD.Eyedropper]);
state.set("canvasId", t("Untitled"));
state.set("canvasMode", "select");
// state.set("canvasMode", state.get("canvasMode"));

// set token & dashboard_id
const token = utils.findGetParameter("__token");
const dashboard_id = utils.findGetParameter("__dashboard_id");

if (token) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("dashboard_id", dashboard_id);

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  fetch(`${API}/api/titan/overview/dashboard/map/` + dashboard_id, {
    method: "GET",
    headers: headers,
  }).then(r => r.json()).then(r => {
    if (r.code == 0 && r.data && r.data.svg) {
      const data = r.data;
      const svg = data.svg;
      const svgString = decodeURIComponent(svg);
      // console.log("svgString", svgString);
      svgCanvas.setSvgString(svgString);
    } else {
      // svgCanvas.clear();
      svgCanvas.setSvgString(state.get("canvasContent"));
    }
  }).catch(e => {
    svgCanvas.clear();
    svgCanvas.setSvgString(state.get("canvasContent"));
  })
} else {
  if (sessionStorage.getItem('dashboard_id') != dashboard_id) {
    svgCanvas.clear();
  }
  svgCanvas.setSvgString(state.get("canvasContent"));
}

state.set("canvasTitle", svgCanvas.getDocumentTitle());

document.body.classList.remove("loading");
document.getElementById("svgcanvas").removeAttribute("title");
