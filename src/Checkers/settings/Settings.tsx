import { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Nav, Navbar, NavLink, Row } from 'react-bootstrap';
import { useSettingsStorageContext } from './settingsStorage/settingsStorage.tsx';
import LoadingFallback from '../LoadingFallback.tsx';

// Import for the components that can be toggled.
import Game from './GameSettings.tsx';

import './settingsStyling.scss';

/**
 * Props for the Settings component.
 * - `togglePreviousComponent`: A function to toggle the visibility of the previous component.
 */
interface SettingsProps {
    togglePreviousComponent: () => void;
}

// Global constant for the form names.
// This is used to render the settings navigation links.
const _FORM_NAMES = ['game'] as const;

/**
 * Type representing the names of the forms that can be toggled.
 */
type FormName = (typeof _FORM_NAMES)[number];

// Map of component names to their respective (lazy-loaded) components.
const formComponentsMap: Record<FormName, () => React.ReactNode> = {
    game: () => <Game />
};

const Settings: FC<SettingsProps> = (props) => {
    const {
        togglePreviousComponent 
    } = props;

    const {
        setIsSettingFormShown
    } = useSettingsStorageContext();

    const [formName, setFormName] = useState<FormName>('game');

    /**
     * Handles the exit action when the user clicks the exit button.
     * It will toggle the visibility of the previous component.
     * @returns {void}
     */
    const handleExit = useCallback((): void => {
        togglePreviousComponent();
    }, [togglePreviousComponent]);

    /**
     * Generates an error message for an invalid form name.
     * @param {FormName} formName - The name of the form that is invalid.
     * @returns {string} - The error message indicating the invalid form name and available options.
     */
    const faultyFormNameErrorMessage = (formName: FormName): string => {
        let errorMessage = `The form name '${formName}' isn't one of the possible form names. Please ensure that the form name is one of the following options: \n`;

        for (const availableFormName of _FORM_NAMES) {
            errorMessage += `\n- ${availableFormName}`;
        }

        return errorMessage;
    }

    /**
     * Returns the form component based on the current form name.
     * * If the form name is invalid, it will log an error and default to the `game` form.
     * @returns {React.ReactNode} - The form component to render.
     */
    const getFormComponent = (): React.ReactNode => {
        const currentComponent = formComponentsMap[formName];
        
        if (!currentComponent) {
            const errorMessage = faultyFormNameErrorMessage(formName) + '\n\nThe form for the game will be shown as fallback.';
            console.error(errorMessage);
            setFormName('game'); 
        }

        return currentComponent();
    }

    /**
     * Handles the keydown event.
     * * If the Escape key is pressed, it will call the `handleExit` function.
     * @param {KeyboardEvent} ev - The keydown event.
     * @returns {void}
     */
    const keydownHandler = useCallback((ev: KeyboardEvent): void => {
        const pressedKey = ev.key.toLowerCase();
        if (pressedKey === 'escape') {
            handleExit();
        }
    }, [handleExit]);

    /**
     * Adds the keydown event listener when the component mounts.
     * * It will remove the event listener when the component unmounts.
     */
    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);

    /**
     * * Sets the `isSettingFormShown` state to `true` when the component mounts.
     * * Sets the `isSettingFormShown` state to `false` when the component unmounts.
     */
    useEffect(() => {
        setIsSettingFormShown(true);
        return () => {
            setIsSettingFormShown(false);
        };
    }, [setIsSettingFormShown]);

    return (
        <div
            data-testid='settings'
        >
            <div
                className='m-3 d-flex justify-content-between'
            >
                <h1>
                    Settings
                </h1>
                <Button
                    data-testid='exitButton'
                    className='border-0 bg-transparent text-dark text-bold btn btn-lg'
                    onClick={handleExit}
                >
                    X
                </Button>
            </div>
            <hr />
            <Container
                fluid
            >
                <Row>
                    <Col 
                        md={2}
                        className='d-flex justify-content-center align-items-start'
                    >
                        <Navbar>
                            <Nav
                                style={{
                                    color: 'black',
                                    fontSize: '1.25rem'
                                }}
                            >
                                {_FORM_NAMES.map((formName) => {
                                    const formNameCapitalized = formName.charAt(0).toUpperCase() + formName.slice(1);
                                    const isFormShown = formName === formName;
                                    return (
                                        <NavLink
                                            as={Button}
                                            className='text-dark bg-transparent'
                                            style={{
                                                fontWeight: isFormShown ? 'bold' : 'normal',
                                            }}
                                            data-testid={`settingsNavLink${formNameCapitalized}`}
                                            disabled={isFormShown}
                                            draggable={false}
                                            onClick={() => setFormName(formName)}
                                            key={formName}
                                        >
                                            {formNameCapitalized}
                                        </NavLink>
                                    )
                                })}
                            </Nav>
                        </Navbar>
                    </Col>
                    <Col
                        md={10}
                    >
                        <Suspense
                            fallback={<LoadingFallback />}
                        >
                            {getFormComponent()}
                        </Suspense>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Settings;