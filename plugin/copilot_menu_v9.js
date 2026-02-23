Draw.loadPlugin(function (ui) {
  // Action + visible label
  ui.actions.addAction("copilotTest", function () {
    mxUtils.alert("✅ Copilot menu works");
  });

  // Make sure the menu text shows up
  var act = ui.actions.get("copilotTest");
  if (act) act.label = "Copilot Test";

  // Inject into Extras menu when menus are created
  var oldCreateMenus = ui.menus.createMenus;
  ui.menus.createMenus = function () {
    oldCreateMenus.apply(this, arguments);

    var extrasMenu = ui.menus.get("extras");
    if (extrasMenu) {
      // This API is compatible with desktop builds (unlike extras.addItem)
      ui.menus.addMenuItem(extrasMenu, "copilotTest");
    }
  };

  // Force rebuild once (helps some builds)
  try { ui.menus.createMenus(); } catch (e) {}
});
