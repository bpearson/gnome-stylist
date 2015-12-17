/**
 * Gnome Stylist.
 *
 */
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

function init() {
}

function enable() {
    // Right Date Menu.
    let rightBox = Main.panel._rightBox;
    let dateMenu = Main.panel.statusArea['dateMenu'];
    dateMenu.actor.reparent(rightBox);

    // Straight panel.
    Main.panel._leftCorner.actor.set_style("-panel-corner-radius: 0px");
    Main.panel._rightCorner.actor.set_style("-panel-corner-radius: 0px");
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
