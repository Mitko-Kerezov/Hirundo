module.exports = {
    toArray: function (obj) {
        var result = obj;
        if (typeof obj === "string") {
            result = [obj];
        }

        return result;
    }
};