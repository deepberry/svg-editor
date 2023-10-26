MD.Toolbar = function(){

  // tools left
  $("#tools_left .tool_button").on("click", function(){ 
    const mode = this.getAttribute("data-mode");
    state.set("canvasMode", mode)
    if (mode === "shapelib") showShapeLib()
    if (mode === "device") showDeviceLib()
  });

  function setMode(mode) {
    $(".tool_button").removeClass("current");
    $("#tool_" + mode).addClass("current");
    $("#workarea").attr("class", mode);
    svgCanvas.setMode(mode);
  }

  function showShapeLib(){
    $("#tools_device").hide();
    $("#tools_shapelib").show();
  }

  function showDeviceLib(){
    $("#tools_shapelib").hide();
    $("#tools_device").show();
  }

  this.setMode = setMode;
}