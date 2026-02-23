Draw.loadPlugin(function(ui) {

  console.log("Copilot plugin loaded");

  // Create action
  ui.actions.addAction("copilotConvertPhoto", function() {
    mxUtils.alert("Copilot menu works ✅");
  });

  // Proper way to add menu item
  var oldCreateMenus = ui.menus.createMenus;

  ui.menus.createMenus = function() {
    oldCreateMenus.apply(this, arguments);

    var menu = ui.menus.get('extras');

    if (menu != null) {
      ui.menus.addMenuItem(menu, 'copilotConvertPhoto');
    }
  };

});
