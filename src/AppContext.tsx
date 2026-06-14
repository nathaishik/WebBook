import { NBProvider } from './NBContext'
import { NotesProvider } from './NoteContext'
import { RelationsProvider } from './RelationsContext'
import { ThemeProvider } from './ThemeContext'
import { StorageProvider } from './StorageContext'

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
    <StorageProvider>
        <ThemeProvider>
            <RelationsProvider>
                <NBProvider>
                    <NotesProvider>
                        {children}
                </NotesProvider>
                </NBProvider>
            </RelationsProvider>
        </ThemeProvider>
    </StorageProvider>
    )
}