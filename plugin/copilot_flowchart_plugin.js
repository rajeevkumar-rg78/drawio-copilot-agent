(function () {
  function install(ui) {

    ui.actions.addAction("copilotConvertPhoto", function () {

      var apiUrl = prompt("Enter backend URL:",
        "https://REPLACE_WITH_YOUR_BACKEND/image-to-drawio");

      if (!apiUrl) return;

      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png,image/jpeg";

      input.onchange = async function (evt) {
        var file = evt.target.files[0];
        var form = new FormData();
        form.append("image", file);

        var res = await fetch(apiUrl, {
          method: "POST",
          body: form
        });

        var xml = await res.text();
        var doc = mxUtils.parseXml(xml);
        var modelNode = doc.getElementsByTagName("mxGraphModel")[0];

        var codec = new mxCodec(doc);
        codec.decode(modelNode, ui.editor.graph.getModel());

        mxUtils.alert("Flowchart created.");
      };

      input.click();
    });

    var old = ui.menus.createMenus;
    ui.menus.createMenus = function () {
      old.apply(this, arguments);
      var extras = ui.menus.get("extras");
      extras.funct = (function (orig) {
        return function (menu, parent) {
          orig.apply(this, arguments);
          ui.menus.addMenuItem(menu, "copilotConvertPhoto", parent);
        };
      })(extras.funct);
    };

    ui.menus.createMenus();
  }

  Draw.loadPlugin(function (ui) {
    install(ui);
  });
})();
