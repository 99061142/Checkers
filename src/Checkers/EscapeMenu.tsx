import { FC, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ComponentName } from './Window';

/**
 * Props for the EscapeMenu component.
 * - `toggleComponent`: Function to toggle the current component.
 */
interface EscapeMenuProps {
    toggleComponent: (componentName: ComponentName) => void;
}

const EscapeMenu: FC<EscapeMenuProps> = (props) => {
    const { 
        toggleComponent 
    } = props;

    /**
     * - Adds the keydown event listener and handler when the component mounts.
     * - Removes the keydown event listener when the component unmounts.
     */
    useEffect(() => {
        /**
         * Handler for the keydown event.
         * - If the Escape key is pressed, it toggles the component to 'game'.
         * @param {KeyboardEvent} ev - The keyboard event.
         * @returns {void}
         */
        const keydownHandler = (ev: KeyboardEvent): void => {
            const pressedKey = ev.key;
            if (pressedKey === 'Escape') {
                toggleComponent('game');
            }
        };
        
        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [toggleComponent]);

    const buttonStyling = {
        background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
        border: '3px #000 solid',
        fontSize: '2vw',
        color: 'black'
    };
    return (
        <div
            data-testid='escapeMenu'
            className='d-flex flex-column justify-content-center align-items-center'
            style={{
                height: '100vh',
                width: '100vw',
                background: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(135deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)'
            }}
        >
            <h1
                className='text-center'
                style={{
                    fontSize: '7.5vw',
                    marginBottom: '10vh'
                }}
            >
                Escape Menu
            </h1>
            <div
                className='d-flex gap-5 flex-column'
                style={{
                    width: '40vw'
                }}
            >
                <Button
                    className='rounded-5 py-4'
                    data-testid='escapeMenuResumeButton'
                    onClick={() => toggleComponent('game')}
                    style={buttonStyling}
                >
                    Resume Game
                </Button>
                <Button
                    className='rounded-5 py-4'
                    data-testid='escapeMenuSettingsButton'
                    onClick={() => toggleComponent('settings')}
                    style={buttonStyling}
                >
                    Settings
                </Button>
                <Button
                    className='rounded-5 py-4'
                    data-testid='escapeMenuQuitButton'
                    onClick={() => toggleComponent('mainMenu')}
                    style={buttonStyling}
                >
                    Main Menu
                </Button>
            </div>
        </div>
    );
}

export default EscapeMenu;