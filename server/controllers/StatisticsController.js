var messages = require('../data/messages');

var CONTROLLER_NAME = 'statistics';

module.exports = {
    getMenu: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/menu');
    },
    getTopTen: function(req, res, next) {
        res.render(CONTROLLER_NAME + '/topTen', { userPosts: req.session.topTen, keyword: req.session.keyword });
    },
    postTopTen: function(req, res, next) {
        messages.getTopTenByKeyword(req.body.keyword, function(error, topTenResults) {
            if (error) {
                console.error(error);
                res.redirect('/');
                return;
            }

            req.session.topTen = topTenResults;
            req.session.keyword = req.body.keyword;
            res.redirect('/topTen');
        });
    },
    getHighFive: function(req, res, next) {
        messages.findPercentageMajorCities(req.user._id, function(error, percentageObj) {
            if (error) {
                console.error(error);
                res.redirect('/');
                return;
            }

            res.render(CONTROLLER_NAME + '/highfive',
                { percentage: percentageObj && percentageObj[0] && percentageObj[0].percentage || 0 });
        });
    },
    getTimeIntervals : function(req, res, next) {
        res.render(CONTROLLER_NAME + '/timeintervals', { percentage: req.session.percentage, timespan: req.session.timespan });
    },
    postTimeIntervals: function(req, res, next) {
        var timespan = req.session.timespan = req.body.timespan,
            startHour = +timespan.substring(0, 2),
            endHour = +timespan.substr(6, 2);
        messages.findPercentageTimespan(req.user._id, {startHour: startHour, endHour: endHour}, function(error, result) {
            if (error) {
                console.error(error);
                return;
            }

            var percentageValue = result && result[0] && result[0].value;
            if (typeof percentageValue === "number") {
                req.session.percentage = percentageValue;
            } else {
                req.session.percentage = percentageValue && percentageValue.percentage || 0
            }

            res.redirect('/timeintervals');
        });
    }
};