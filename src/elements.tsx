export function BarHeading({title, children}: {title: string, children?: React.ReactNode}) {
    return (
        <div className='bar-heading'>{title} {children}</div>
    )
}

export function SideBar({children}: {children: React.ReactNode}) {
    return (
        <div className='sidebar'>
            {children}
        </div>
    )
}

export function NewButton({onClick, disabled, addWhat}: {onClick?: () => void, disabled?: boolean, addWhat?: string}) {
    return (
        <button className="new-button color-button" onClick={onClick} disabled={disabled || false}><Icon icon="add" />{addWhat ? ' New ' + addWhat: ''}</button>
    )
}

export function Bar({children, barName}: {children: React.ReactNode, barName: string}) {
    return (
        <div className={'bar ' + barName}>
            {children}
        </div>
    )
}

export function BarList({children}: {children: React.ReactNode}) {
    return (
        <ul className='bar-list'>
            {children}
        </ul>
    )
}

export function BarListItem({children, isActive}: {children: React.ReactNode, isActive?: boolean}) {
    return (
        <li className={'bar-list-item ' + (isActive ? ' active' : '')}>
            {children}
        </li>
    )
}

export function Icon({icon}: {icon: string}) {
    return (
        <span className="material-symbols-rounded">
        {icon}
        </span>
    )
}

export function EmptyPage({message}: {message: string}) {
    return (
        <div className='empty-page'>
            <h1 className="logo">WebBook</h1>
            <p>You can customise the colors in the settings <Icon icon="settings" /></p>
            <p>Open an existing Notebook or create a new notebook using the <Icon icon="add" /> button.</p>
            <p>{message}</p>
        </div>
    )
}