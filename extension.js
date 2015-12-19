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

const SETTINGS_CLOCK_POSITION = 'clock-position';
const SETTINGS_REMOVE_ROUNDED = 'remove-rounded';

let settings = Convenience.getSettings(Me.metadata['settings-schema']);

let gnomeStylist = {
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
    }
};

function init() {

}

function enable() {
    gnomeStylist.clockPosition();
    gnomeStylist.removeRounded();

    let self = this;
    settings.connect('changed', Lang.bind(this, function() {
        gnomeStylist.clockPosition();
        gnomeStylist.removeRounded();
    }));
}

function disable() {
    // Reset Date Menu.
    let centerBox = Main.panel._centerBox;
    let dateMenu = Main.panel.statusArea['dateMenu'];
    dateMenu.actor.reparent(centerBox);

    // Reset panel.
    Main.panel._leftCorner.actor.set_style("-panel-corner-radius: 10px");
    Main.panel._rightCorner.actor.set_style("-panel-corner-radius: 10px");
}
