Draw.loadPlugin(function(ui) {

  // Confirm plugin loads
  console.log("Copilot plugin loaded");

  // Add action
  ui.actions.addAction("copilotConvertPhoto", function() {
    mxUtils.alert("Copilot menu works ✅");
  });

  // Wait until menus are ready
  ui.addListener(mxEvent.INIT, function() {

    var extras = ui.menus.get("extras");

    if (extras != null) {
      extras.addItem("Copilot Convert Photo", null, function() {
        ui.actions.get("copilotConvertPhoto").funct();
      });
    }

  });

});
