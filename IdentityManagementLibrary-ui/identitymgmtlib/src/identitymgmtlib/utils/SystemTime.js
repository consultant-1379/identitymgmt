define([
    'i18n/AdvancedDateTime'
], function(advancedDateTime) {

    var _timezone = 'UTC'; // default time zone, if not fetched from server
    var _hourInMilliseconds = 3600000;

    return {

        updateTimezone: function(timezone) {
            _timezone = timezone;
        },

        getTimezone: function() {
            return _timezone;
        },

        formatTimestampImport: function(timestamp) {
            var date = getDateFromTimestamp(timestamp);
            return advancedDateTime(date).mode('international');
        },


        /**
         * Formats the time with the correct locale according to provided server location.
         *
         * @method formatTimestampWithTimezone
         * @param {Integer} timestamp
         * @param {String} server location
         * @return {String} formattedTime
         */
        formatTimestampWithTimezone: function(timestamp) {
            var date = getDateFromTimestamp(timestamp);
            return advancedDateTime(date).mode("locale").tz(_timezone).format("DTSZ");
        },

        formatLdapTimestamp: function(value) {
            return Date.UTC(parseInt(value.substr(0,4), 10),parseInt(value.substr(4,2), 10) - 1,
                parseInt(value.substr(6,2), 10),parseInt(value.substr(8,2), 10),
                parseInt(value.substr(10,2), 10),parseInt(value.substr(12,2), 10));
        },

        isAfter: function(timestamp, number) {
            if ( timestamp === null  || timestamp === undefined ) {
                return false;
            }
            var value = advancedDateTime(getDateFromTimestamp(timestamp)).tz(_timezone).value();
            var now = advancedDateTime(new Date()).tz(_timezone).value();
            return (now - value < number*24*3600000);
        },

        getDateWithTimezone: function(dataStr) {
            return advancedDateTime(new Date(dataStr)).mode("locale").tz(_timezone).format("DTSZ");
        },

        getDate: function(dataStr) {
            return advancedDateTime(new Date(dataStr)).mode("locale").format("DTS");
        }
    };

    function formatTimeforParse(timestamp) {
        //2019-01-01T00:00:00.000+00:00
        return timestamp.substr(0,4) + "-" +
               timestamp.substr(4,2) + "-" +
               timestamp.substr(6,2) + 'T' +
               timestamp.substr(8,2) + ':' +
               timestamp.substr(10,2) + ':' +
               timestamp.substr(12,2) + ".000" +
               "+" + timestamp.substr(15,2) + ":" +
               timestamp.substr(17,2);
    }

    function pad2(number) {
        return number < 10 ? '0' + number : number;
    }

    function getDateFromTimestamp(timestamp) {
        return Date.parse(formatTimeforParse(timestamp));
    }


});
