const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;

function init() { }

function buildPrefsWidget() {

    // 🔥 Carrega o schema manualmente (necessário no GNOME 42!)
    const schemaSource = Gio.SettingsSchemaSource.new_from_directory(
        `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/customtopbar@ihagofs.gmail.com/schemas`,
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    const schema = schemaSource.lookup(
        'org.gnome.shell.extensions.customtopbar',
        true
    );

    const settings = new Gio.Settings({ settings_schema: schema });

    const widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 15
    });

    widget.set_margin_top(20);
    widget.set_margin_bottom(20);
    widget.set_margin_start(20);
    widget.set_margin_end(20);

    // Entrada de cor
    const colorLabel = new Gtk.Label({
        label: 'Topbar color (hex):',
        halign: Gtk.Align.START
    });
    widget.append(colorLabel);

    const colorEntry = new Gtk.Entry({
        text: settings.get_string('topbar-color')
    });

    colorEntry.connect('changed', () => {
        settings.set_string('topbar-color', colorEntry.text);
    });

    widget.append(colorEntry);

    // Opacidade
    const opacityLabel = new Gtk.Label({
        label: 'Opacity (0–255):',
        halign: Gtk.Align.START
    });
    widget.append(opacityLabel);

    const adjustment = new Gtk.Adjustment({
        lower: 0,
        upper: 255,
        step_increment: 1,
        value: settings.get_int('topbar-opacity')
    });

    const opacityScale = new Gtk.Scale({
        orientation: Gtk.Orientation.HORIZONTAL,
        adjustment
    });

    opacityScale.connect('value-changed', () => {
        settings.set_int('topbar-opacity', opacityScale.get_value());
    });

    widget.append(opacityScale);

    return widget;
}
