/**
 * Gnome Stylist.
 *
 */
const St = imports.gi.St;
const Lang = imports.lang;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Config = imports.misc.config;

const SETTINGS_CLOCK_POSITION = 'clock-position';
const SETTINGS_REMOVE_ROUNDED = 'remove-rounded';

let settings = Convenience.getSettings(Me.metadata['settings-schema']);

let gnomeStylist = {
    _callbacks: {},
    clockPosition: function() {
        let clockPosition = settings.get_string(SETTINGS_CLOCK_POSITION);
        let parentBox     = Main.panel._rightBox;
        let dateMenu      = Main.panel.statusArea['dateMenu'];
        if (clockPosition == 'left') {
            parentBox = Main.panel._leftBox;
        } else if (clockPosition == 'center') {
            parentBox = Main.panel._centerBox;
        }

        // Right Date Menu.
        dateMenu.actor.reparent(parentBox);
    },

    removeHotCorners: function() {
        Main.layoutManager.hotCorners.forEach(function(corner) {
            if (!corner) {
                return;
            }

            corner._toggleOverview = function() {};
            corner._pressureBarrier._trigger = function() {};
        });
    },

    removeRounded: function() {
        let removeRounded = settings.get_boolean(SETTINGS_REMOVE_ROUNDED);

        // Straight panel.
        if (removeRounded === true) {
            Main.panel._leftCorner.actor.set_style("-panel-corner-radius: 0px");
            Main.panel._rightCorner.actor.set_style("-panel-corner-radius: 0px");
        } else {
            Main.panel._leftCorner.actor.set_style("-panel-corner-radius: 10px");
            Main.panel._rightCorner.actor.set_style("-panel-corner-radius: 10px");
        }
    },

    styleActivities: function() {
        let activitiesMenu   = Main.panel.statusArea.activities;
        let activitiesLabel  = activitiesMenu.actor.get_children()[0];
        activitiesLabel.text = "Gnome";
    }
};

function init() {

}

function enable() {
    gnomeStylist.clockPosition();
    gnomeStylist.removeHotCorners();
    gnomeStylist.removeRounded();
    gnomeStylist.styleActivities();

    let self = this;
    settings.connect('changed', Lang.bind(this, function() {
        gnomeStylist.clockPosition();
        gnomeStylist.removeRounded();
    }));

    gnomeStylist._callbacks['hotCorners'] = Main.layoutManager.connect('hot-corners-changed', function() {
        gnomeStylist.removeHotCorners()
    });
}

function disable() {
    // Reset Date Menu.
    let centerBox = Main.panel._centerBox;
    let dateMenu = Main.panel.statusArea['dateMenu'];
    dateMenu.actor.reparent(centerBox);

    // Reset hot corners.
    Main.layoutManager.disconnect(gnomeStylist._callbacks['hotCorners']);
    Main.layoutManager._updateHotCorners();

    // Reset panel.
    Main.panel._leftCorner.actor.set_style("-panel-corner-radius: 10px");
    Main.panel._rightCorner.actor.set_style("-panel-corner-radius: 10px");

    // Reset activities.
    let activitiesMenu   = Main.panel.statusArea.activities;
    let activitiesLabel  = activitiesMenu.actor.get_children()[0];
    activitiesLabel.text = "Activities";
}
