var express = require('express');
var router = express.Router();

var rsvpData = require('./lib/data/rsvp');
var settings = require('./lib/settings');
var errors = require('./lib/errors');
var auth = require('./lib/auth');

var app;

var ensureAuth = function(req, res, next) {
    if (req.isAuthenticated()) { 
    return next(); 
    }
    res.status(401).send("Nope.");
};

router.get('/', function (req, res) {
    var displayName = "(unknown)";
    if (!req.isAuthenticated()) { 
        displayName = "(unauthenticated)";
    }

    if (req.user) {
        displayName = req.user.displayName || "(undefined)";
    }

    res.render('admin-index', { 
        displayName: displayName,
        title: 'Swing and Blues Weekend' 
    });
});

var renderRsvps = function (viewName, res) {
    rsvpData.allByName(errors.guard(res, function (rsvps) {
        var attendees = [];
        if (rsvps) {
            rsvps.forEach(function (rsvp) {
                if (rsvp.person && rsvp.person.isAttending !== false) {
                    attendees.push(rsvp);
                }
            });
        }

        res.render(viewName, {
            rsvps: rsvps,
            attendees: attendees
        });
    }));
};

router.get('/rsvps', ensureAuth, function (req, res) {
    renderRsvps('admin-rsvps', res);
});

router.get('/payment', ensureAuth, function (req, res) {
    renderRsvps('admin-payment', res);
});

router.get('/shirts', ensureAuth, function (req, res) {
    renderRsvps('admin-shirts', res);
});

router.get('/declines', ensureAuth, function (req, res) {
    rsvpData.allByName(errors.guard(res, function (rsvps) {
        var declines = [];
        rsvps.forEach(function (rsvp) {
            var person = rsvp.person || {};
            if (person.isAttending === false) {
                declines.push(rsvp);
            }
        })

        res.render('admin-declines', {
            declines: declines
        });
    }));
});

router.get('/volunteers', ensureAuth, function (req, res) {
    rsvpData.allByName(errors.guard(res, function (rsvps) {
        var volunteers = [];
        rsvps.forEach(function (rsvp) {
            var volunteer = rsvp.volunteer || {};
            if (volunteer.before || volunteer.during) {
                volunteers.push(rsvp);
            }
        });

        res.render('admin-volunteers', {
            volunteers: volunteers
        });
    }));
});

router.get('/food', ensureAuth, function (req, res) {
    rsvpData.allByName(errors.guard(res, function (rsvps) {
        var diets = {
            vegan: 0,
            vegetarian: 0,
            fun: 0
        };
        var allergies = {
            milk: 0,
            eggs: 0,
            peanuts: 0,
            treeNuts: 0,
            fish: 0,
            shellfish: 0,
            soy: 0,
            wheat: 0,
            curare: 0,
            hemlock: 0
        };

        rsvps.forEach(function (rsvp) {
            if (rsvp.food) {
                for (var choice in rsvp.food.diet) {
                    if (rsvp.food.diet[choice]) {
                        diets[choice]++;
                    }
                }

                for (var allergy in rsvp.food.allergies) {
                    if (rsvp.food.allergies[allergy]) {
                        allergies[allergy]++;
                    }
                }
            }
        });

        res.render('admin-food', {
            diets: diets,
            allergies: allergies
        });
    }));
});

router.get('/housing', ensureAuth, function (req, res) {
    renderRsvps('admin-housing', res);
});

router.get('/travel', ensureAuth, function (req, res) {
    renderRsvps('admin-travel', res);
})

router.get('/settings', ensureAuth, function (req, res) {
    settings.getAllForDisplay(function (err, data) {
        var displaySettings = {};
        for (var index in data) {
            var setting = data[index];
            if (setting.kind !== "list") {
                displaySettings[setting.name] = setting;
            }
        }

        res.render('admin-settings', {
            settings: displaySettings
        });
    });
});

router.get('/access', ensureAuth, function (req, res) {
    settings.getAllForDisplay(function (err, data) {
        var accessSetting = data["admin-access-list"] || {};
        res.render('admin-access', {
            settings: data,
            accessSetting: accessSetting
        });
    });
});

var saveSetting = function (setting, callback) {
    var list = [];
    list.push(setting);
    settings.set(list, callback);
};

router.put('/data/payment/status', ensureAuth, function (req, res) {
    var body = req.body;
    rsvpData.get(body.id, errors.guard(res, function (rsvp) {
        rsvp.payment.status = body.status;
        rsvp.meta.editedBy = req.user.id;
        rsvpData.update(rsvp, errors.guard(res, function () {
            res.status(200).send();
        }));
    }));
});

router.put('/data/shirt/size', ensureAuth, function (req, res) {
    var body = req.body;
    rsvpData.get(body.id, errors.guard(res, function (rsvp) {
        rsvp.shirt.size = body.size;
        rsvp.meta.editedBy = req.user.id;
        rsvpData.update(rsvp, errors.guard(res, function () {
            res.status(200).send();
        }));
    }));
});

router.put('/data/shirt/type', ensureAuth, function (req, res) {
    var body = req.body;
    rsvpData.get(body.id, errors.guard(res, function (rsvp) {
        rsvp.shirt.type = body.type;
        rsvp.meta.editedBy = req.user.id;
        rsvpData.update(rsvp, errors.guard(res, function () {
            res.status(200).send();
        }));
    }));
});

router.put('/data/setting', ensureAuth, function (req, res) {
    saveSetting(req.body, errors.guard(res, function () {
        // Save settings to app ...
        settings.getAll(errors.guard(res, function (settingsData) {
            app.set('settings', settingsData);
            res.status(200).send();
        }));
    }));
});

router.put('/data/setting/access-list', ensureAuth, function (req, res) {
    saveSetting(req.body, errors.guard(res, function () {
        auth.setAccessList(req.body.value);
        res.status(200).send();
    }));
});


// For testing auth middleware
router.get('/protected', ensureAuth, function (req, res) {
    res.status(200).send("Ok!");
});


module.exports = function () {
    return {
        router: function (a) {
            app = a;
            return router;
        }
    }
}(); // closure