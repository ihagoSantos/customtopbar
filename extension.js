const Main = imports.ui.main;
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const GLib = imports.gi.GLib;

let settings;
let originalColor = null;

function init() {
    const GioSSS = Gio.SettingsSchemaSource;
    let schemaSource = GioSSS.new_from_directory(
        `${GLib.get_home_dir()}/.local/share/gnome-shell/extensions/customtopbar@ihagofs.gmail.com/schemas`,
        GioSSS.get_default(),
        false
    );

    settings = new Gio.Settings({
        settings_schema: schemaSource.lookup(
            'org.gnome.shell.extensions.customtopbar', true)
    });
}

function hexToRgba(hex, opacity255) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = opacity255 / 255;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function applyStyle() {
    const panel = Main.panel;

    const color = settings.get_string("topbar-color");
    const opacity = settings.get_int("topbar-opacity");

    const rgba = hexToRgba(color, opacity);

    panel.actor.set_style(`
        background-color: ${rgba};
    `);
}

function enable() {
    const panel = Main.panel;

    // Guardar o estilo original
    originalColor = panel.actor.get_style();

    // Aplicar estilo
    applyStyle();

    // Atualizar automaticamente quando mudar nas prefs
    settings.connect("changed", applyStyle);
}

function disable() {
    Main.panel.actor.set_style(originalColor);
}
