import { FC, useCallback, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import useUI from '../ui/uiProvider/useUI.ts';
import { fallbackSettingsFormName, SettingName } from './settingsForm/SettingsFormUtils.ts';
import SettingsForm from './settingsForm/SettingsForm.tsx';
import SettingsFormNavbar from './settingsFormNavbar/SettingsFormNavbar.tsx';
import SettingsNavbar from './settingsNavbar/SettingsNavbar.tsx';

/**
 * Props for the Settings component.
 * - initialSettingsFormName (optional): The name of the settings form to display initially.
 */
export interface SettingsProps {
    initialSettingsFormName?: SettingName;
}

const Settings: FC<SettingsProps> = ({ 
    initialSettingsFormName = fallbackSettingsFormName
}) => {
    const {
        goBack
    } = useUI();

    const [currentFormName, setCurrentFormName] = useState<SettingName | null>(null);

    /**
     * Exit the settings page.
     * @returns {void}
     */
    const exitSettings = useCallback((): void => {
        goBack();
    }, [goBack]);

    /**
     * Handles the keydown event.
     * @param {KeyboardEvent} ev - The keydown event.
     * @returns {void}
     */
    const keydownHandler = useCallback((ev: KeyboardEvent): void => {
        const pressedKey: string = ev.key;

        // If the escape key is pressed, exit the settings page
        if (pressedKey === "Escape") {
            exitSettings();
        }
    }, [exitSettings]);

    /**
     * Handles adding and removing the keydown event listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);
        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);

    return (
        <main
            data-testid='settings'
        >
            <SettingsNavbar
                exitSettings={exitSettings}
            />
            <Container
                fluid
            >
                <Row>
                    <Col 
                        md={2}
                        className='d-flex justify-content-center align-items-start'
                    >
                        <SettingsFormNavbar
                            currentFormName={currentFormName}
                            setCurrentFormName={setCurrentFormName}
                        />
                    </Col>
                    <Col
                        md={10}
                    >
                        <SettingsForm
                            initialSettingsFormName={initialSettingsFormName}
                            currentFormName={currentFormName}
                            setCurrentFormName={setCurrentFormName}
                        />
                    </Col>
                </Row>
            </Container>
        </main>
    );
}

export default Settings;