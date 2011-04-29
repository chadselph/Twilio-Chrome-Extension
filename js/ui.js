var inputs = null;
var options = null;
var optional_parameters = null;

function init() {
    inputs = $("#inputs");
    options = $("#methods");
    optional_parameters = $("#optional_parameters");
    build_menu();
}
function build_menu() {
   $("a.settings").attr("href", chrome.extension.getURL( "options.html" ));
   for (method in API_METHODS) {
       options.append($("<option>").html(method));
   }
   optional_parameters.change(function(){
     /*
      * Adds an optional parameter to the form
      */
        var option = this.value;
        if (option != "") {
            var node = make_parameter_node(option, "optional");
            var rm_button = $("<img src='img/minus.png?1'>");
            rm_button.click(function() {
                var option = $(this).parent().children("input").attr("name");
                $(this).parent().remove();
                optional_parameters.append($("<option>").html(option));
            });
            node.append(rm_button);
            inputs.children(".generated").append( node );
            $(this).children("option[value="+option+"]").remove();
        }
    });
    update_params();
};
function update_params() {
    inputs.children(".generated").children().remove();
    optional_parameters.children("option").remove();
    var name = options.val();
    var params = API_METHODS[name]['required'];
    for (var i in params) {
        var param = params[i];
        inputs.children(".generated").append( make_parameter_node(i, "required", param) );
    }
    optional_parameters.append($("<option>").html("-- Add Optional Parameter --").val(""));
    var optional_params = API_METHODS[name]['optional'];
    for (var key in optional_params) {
        var default_val = optional_params[key];
        optional_parameters.append($("<option>").html(key));
    }
}
function make_parameter_node(name, type, suggestions_call) {
    if (!suggestions_call) {
        var suggestions_call = API_METHODS[options.val()][type][name];
    }
    var input_box = $("<input>").attr("name", name).autocomplete(suggestions_call(), {matchContains: true, minChars:0, mustMatch:false});
    var node = $("<div>").addClass(type).addClass("option").append($("<label>").html(name)).append(input_box);
    return node;        
}
function api_call(name, output_format) {
    if (!name) name = options.val();
    if (!output_format) output_format = "json";
    var params = API_METHODS[name];
    var sid   = localStorage['account_sid'];
    var token = localStorage['account_token'];
    var url = params['url'].format({AccountSid: sid})+"."+output_format;
    var data = inputs.serialize();
    var req = new XMLHttpRequest();
    $.ajax({
        contentType: "application/x-www-form-urlencoded",
        type: params['method'],
        url: url,
        username: sid,
        password: token,
        success: display_response,
        error: display_error,
        data: data,
    });
}
function display_response(resp, status, xhr) {
    if ( xhr.responseXML ) {
        resp = xhr.responseText;
    } else if ($.type(resp) == "object") {
        resp = JSON.stringify(resp, null, 4);
    }
    $('#response').val(resp);
}
function display_error(xhr, status, errorName) {
    $("#response").val(xhr.responseText);
}

