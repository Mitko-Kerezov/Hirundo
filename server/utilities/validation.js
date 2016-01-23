var _allowedSymbols = 'aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ0123456789_ .';
module.exports = {
    checkUsername: function (username) {
        if (username.length < 6 || username.length > 20) {
            return false;
        }

        for(var i = 0, len = username.length; i < len; ++i) {
            if (_allowedSymbols.indexOf(username[i]) < 0) {
                return false;
            }
        }

        return true;
    }
};