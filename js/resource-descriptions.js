String.prototype.format = function(args) {
    var s = this;
    for (var i in args) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, args[i]);
    }
    return s;
}
function one_of() {
    var choices = arguments;
    return function() {
        return choices;
    }
}
function regions() {
    return ['AK','AL','AR','AS','AZ','CA','CO','CT','DC','DE','FL','GA','GU','HI','IA','ID',
           'IL','IN','KS','KY','LA','MA','MD','ME','MH','MI','MN','MO','MS','MT','NC','ND',
           'NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','PR','PW','RI','SC','SD','TN',
           'TX','UT','VA','VI','VT','WA','WI','WV','WY'];
}
function na() {
    return [];
}
function between(a, b) {
    return function() {
        var list = [];
        for( var i=a;i<b;i++) list.push(String(i));
        return list;
    }
}
function account_numbers() {
    // this will fetch your numbers, the first time.
    // TODO: add refresh button in settings
    if (!localStorage['account_numbers']) {
        localStorage['account_numbers'] = [];
        var sid   = localStorage['account_sid'];
        var token = localStorage['account_token'];
        var response = $.ajax({
            url: API_METHODS['List Incoming Phone Numbers']['url'].format({sid: sid})+".json",
            username: sid,
            password: token,
            success: function(data) {
                var numbers = [];
                for (num_info in data['incoming_phone_numbers']) {
                    var ipn = data['incoming_phone_numbers'][num_info];
                    numbers.push(ipn['phone_number']);
                }
                localStorage['account_numbers'] = numbers;
            }
        });
    }
    // returns too soon to work on the first load, but should work after
    return localStorage['account_numbers'].split(",");
}
function GET_or_POST() {
    return ["GET", "POST"];
}

/*
 * Add API Methods here:
 *  Key: name for the menu
 *  Values:
 * 	  required: Keys are any required arguments, values are functions that return a list for auto-complete
 * 	  optional: Keys are any optional arguments, values are functions that return a list for auto-complete
 * 	  url: The full url we're going to send to.  TODO: add extra url {parameters}, removed redundant https://api.twilio.com/
 * 	  method: HTTP Method to use for this action
 */

var API_METHODS = {
    'Outgoing SMS': {
        'required': {'To':na, 'From':account_numbers, 'Body':na},
        'optional': {'StatusCallback':na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/SMS/Messages',
        'method': 'POST',
    },
    'Outgoing Call': {
        'required': {'To':na, 'From':account_numbers, 'Url':na},
        'optional': {'Method':GET_or_POST, 'FallbackUrl':na, 'FallbackMethod':GET_or_POST, 'StatusCallback':na, 
            'StatusCallbackMethod':GET_or_POST, 'SendDigits': one_of("Yes", "No"), 'IfMachine':na, 'Timeout':one_of("60")},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/Calls',
        'method': 'POST',
    },
    'Lookup Account': {
        'required': {},
        'optional': {},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}',
        'method': 'GET'
    },
    'Modify Account': {
        'required': {},
        'optional': {'FriendlyName':na, 'Status':one_of('active', 'closed', 'suspended')},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}',
        'method': 'GET'
    },
    'Create Subaccount': {
        'required': {},
        'optional': {'FriendlyName':na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts',
        'method':'POST'
    },
    'Find Phone Number (US)': {
        'required': {},
        'optional': {'AreaCode': na, 'Contains': na, 'InRegion': regions, 'InPostalCode': na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/AvailablePhoneNumbers/US/Local',
        'method': 'GET',
    },
    'List Outgoing Caller IDs': {
        'required': {},
        'optional': {'PhoneNumber':account_numbers, 'FriendlyName':na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/OutgoingCallerIds',
        'method': 'GET'
    },
    'List Incoming Phone Numbers': {
        'required': {},
        'optional': {'PhoneNumber':account_numbers, 'FriendlyName':na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/IncomingPhoneNumbers',
        'method': 'GET',
    },
    'Add Caller ID': {
        'required': {'PhoneNumber':na},
        'optional': {'FriendlyName': na, 'CallDelay': between(0,60), 'Extension': na},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/OutgoingCallerIds',
        'method': 'POST',
    },


    'Recordings List': {
        'required':  {},
        'optional': {},
        'url': 'https://api.twilio.com/2010-04-01/Accounts/{sid}/Recordings',
        'method': 'GET',
    },
};
