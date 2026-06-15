import { useTheme } from "./ThemeConstants";
import { useStorage } from "./StorageConstants";
import { Icon } from "./elements";
import { useEffect, useRef } from "react";

export function SettingsPanel({isSettingsOpen, setIsSettingsOpen}: {isSettingsOpen: boolean, setIsSettingsOpen: (isOpen: boolean) => void}) {
    const themeContext = useTheme();
    const storageContext = useStorage();

    const {
        savedTheme,
        draftTheme,
        updateDraftTheme,
        saveSettings,
        resetDraftTheme,
    } = themeContext;

    const { storage, clearStorage, refreshStorage } = storageContext;

    function closeSettings() {
        resetDraftTheme();
        setIsSettingsOpen(false);
    }

    const themeUpdateRef = useRef<number| null>(null);

    function handleThemeUpdate({key, value}: {key: keyof typeof draftTheme, value: string}) {
        if (!key || !value) {
        return;
        }

        if (themeUpdateRef.current) {
            clearTimeout(themeUpdateRef.current);
        }
        themeUpdateRef.current = setTimeout(() => {
            updateDraftTheme({[key]: value});
        }, 500);
    }

    useEffect(() => {
        return () => {
            if (themeUpdateRef.current) {
                clearTimeout(themeUpdateRef.current);
            }
        }
    })


    if (!isSettingsOpen) {
        return null;
    }

    return (
        <div className="settings-overlay">
        <div className="settings-backdrop" onClick={closeSettings} />

            <div className="settings-panel">
                <div className="settings-header">
                <h1>Settings</h1>
                </div>

                <div className="settings-content">
                    <h2>Storage</h2>
                    <div className="storage">
                        <p className="storage-info"><span>Occupied</span> {storage.current[0]} / {storage.total[0]}</p>
                        <div className="storage-visual">
                            <div className="storage-total" style={{width: '100%'}} />
                            {/*<div className="storage-occupied" style={{width: `30%`}} />*/}
                            <div className="storage-occupied" style={{width: `calc(${Number(storage.current[1])} / ${Number(storage.total[1])} * 100%)`}} />
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="clear-storage color-button" onClick={() => clearStorage()} disabled={Number(storage.current[1]) <= 4}><Icon icon="delete" /> Clear Data</button>
                        <button className="refresh-storage color-button" onClick={() => refreshStorage()}><Icon icon="undo" /> Refresh</button>
                    </div>
                </div>

                <div className="settings-content">
                    <h2>Theme</h2>
                    <div className="colors">
                        <div className="saved-theme themes">
                            <div className="theme-preview" style={{backgroundColor: savedTheme.bg, color: savedTheme.fg}}>
                                <p>Background Color</p>
                                <small>{savedTheme.bg}</small>
                            </div>
                            <div className="theme-preview" style={{backgroundColor: savedTheme.fg, color: savedTheme.bg}}>
                                <p>Foreground Color</p>
                                <small>{savedTheme.fg}</small>
                            </div>
                            <div className="theme-preview" style={{backgroundColor: savedTheme.primary, color: savedTheme.fg}}>
                                <p>Accent Color</p>
                                <small>{savedTheme.primary}</small>
                            </div>
                        </div>
                        <div className="theme-inputs themes">
                            <div className="theme-preview" style={{backgroundColor: draftTheme.bg, color: draftTheme.fg}}>
                                <Icon icon="colorize" />
                                <input type="color" value={draftTheme.bg} onChange={(e) => handleThemeUpdate({key: 'bg', value: e.target.value})} />
                            </div>
                            <div className="theme-preview" style={{backgroundColor: draftTheme.fg, color: draftTheme.bg}}>
                                <Icon icon="colorize" />
                                <input type="color" value={draftTheme.fg} onChange={(e) => handleThemeUpdate({key: 'fg', value: e.target.value})} />
                            </div>
                            <div className="theme-preview" style={{backgroundColor: draftTheme.primary, color: draftTheme.fg}}>
                                <Icon icon="colorize" />
                                <input type="color" value={draftTheme.primary} onChange={(e) => handleThemeUpdate({key: 'primary', value: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    <div className="theme-buttons buttons">
                        <button className="save-theme color-button" onClick={saveSettings} disabled={JSON.stringify(savedTheme) === JSON.stringify(draftTheme)}><Icon icon="check" /> Apply</button>
                        <button className="reset-theme color-button" onClick={resetDraftTheme} disabled={JSON.stringify(savedTheme) === JSON.stringify(draftTheme)}><Icon icon="undo" /> Revert</button>
                        <button className="close-settings color-button" onClick={closeSettings}><Icon icon="close" /> Close</button>
                    </div>
                </div>

            </div>


            
        </div>
    );
}

export function SettingsButton({onClick}: {onClick: () => void}) {
    return (
        <button className="settings-button new-button color-button" onClick={onClick}><Icon icon="settings" /></button>
    )
}