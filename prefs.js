/*
 *
 */
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const SETTINGS_CLOCK_POSITION = 'clock-position';
const SETTINGS_REMOVE_ROUNDED = 'remove-rounded';

const GnomeStylistSettingsWidget = new GObject.Class({
  Name: 'Gnome-Stylist.Prefs.GnomeStylistSettingsWidget',
  GTypeName: 'GnomeStylistSettingsWidget',
  Extends: Gtk.Grid,

  _init: function() {
    this.parent();
    this.margin = 100;
    this.row_spacing = 6;

    this.orientation = Gtk.Orientation.VERTICAL;

    this._settings = Convenience.getSettings(Me.metadata['settings-schema']);

    let vbox = new Gtk.VBox();
    this.add(vbox);

    let checkContainer = new Gtk.HBox({spacing: 5});
    let checkLabel = new Gtk.Label({label: _('Remove Panel Rounded Corners')});
    let checkButton = new Gtk.CheckButton();

    checkContainer.pack_start(checkLabel, 0,0,0);
    checkContainer.pack_end(checkButton, 0,0,0);

    this._settings.bind(SETTINGS_REMOVE_ROUNDED, checkButton, 'active', Gio.SettingsBindFlags.DEFAULT);

    vbox.add(checkContainer);

    let positionContainer = new Gtk.HBox({spacing: 5});
    let positionLabel = new Gtk.Label({label: _('Clock position')});
    let positionSelector = new Gtk.ComboBoxText();

    positionContainer.pack_start(positionLabel, 0,0,0);
    positionContainer.pack_end(positionSelector, 0,0,0);

    ['left','center','right'].forEach(function(item) {
      positionSelector.append_text(item);
    });

    positionSelector.set_active(this._settings.get_enum(SETTINGS_CLOCK_POSITION));

    let self = this;

    positionSelector.connect('changed', function(pos) {
      self._settings.set_enum(SETTINGS_CLOCK_POSITION, positionSelector.get_active());
    });

    vbox.add(positionContainer);
  }
});

function init() {
}

function buildPrefsWidget() {
  let widget = new GnomeStylistSettingsWidget();
  widget.show_all();

  return widget;
}
