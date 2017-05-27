Handlebars.registerHelper("contains", function (value, object) {
  return object.indexOf(value) > -1;
});

Handlebars.registerHelper("check", function(value) {
  if (value) {
    return new Handlebars.SafeString("<i class=\"fa fa-check\" aria-hidden=\"true\"></i>");
  }
  return new Handlebars.SafeString("<i class=\"fa fa-times\" aria-hidden=\"true\"></i>");
});

function on_ready(template, data) {
  var url_params = {};
  var search = window.location.search.substring(1).split("&");
  $.each(search, function (_, value) {
    var items = value.split("=");
    if (items[0] == "" || items[1] == undefined) {
      return;
    }
    url_params[items[0]] = items[1];
  });

  var filtered_data = {};
  filtered_data["records"] = data["records"];
  filtered_data["providers"] = {};

  $.each(data["providers"],function (p_key, p_value) {
    for (u_key in url_params) {
      if (p_value["records"].indexOf(u_key) < 0) {
        return;
      }
    }
    filtered_data["providers"][p_key] = data["providers"][p_key];
  });

  var page = template({"data":filtered_data, "arguments": url_params});
  $("#pageContent").html(page);


  $.each($(".filter_toggle"), function (_, item) {
    var type = item.dataset["type"];
    item = $(item);
    if (type in url_params) {
      item.prop('checked', true);
    }
  });

  componentHandler.upgradeDom();


  function on_change(event) {
    var type = event.target.dataset["type"];
    if (type in url_params) {
      delete url_params[type];
    } else {
      url_params[type] = true;
    }
    var newSearch = "?";
    $.each(Object.keys(url_params).sort(), function(_, key){
      newSearch += key;
      newSearch += "=true&";
    });
      if (newSearch == "?") {
        window.location = "./";
      } else {
        window.location.search = newSearch.substring(0, newSearch.length - 1);
      }
  }

  $.each($(".filter_toggle"), function (_, item) {
    c = item.parentElement;
    $(c).change(on_change);
  });
}

$.get("index.hbs", null, function (data) {
  var template = Handlebars.compile(data);
  $.get("data.json", null, function(data) {
    on_ready(template, data);
  }, "json")
}, "html");
