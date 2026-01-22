import { FC } from "react";
import { Button, Nav, Navbar, NavLink } from "react-bootstrap";
import { settingsFormNamesArray } from "../settingsForm/SettingsFormUtils.ts";
import { SettingName } from "../settingsForm/SettingsFormUtils.ts";
import styles from './SettingsFormNavbar.module.scss';

/**
 * Props for the Settings Form Nav Bar.
 * - `currentFormName`: The name of the currently displayed settings form.
 * - `setCurrentFormName`: Function to set the current settings form name. This will update the displayed form.
 */
interface SettingsFormNavbarProps {
    currentFormName: SettingName | null;
    setCurrentFormName: (formName: SettingName) => void;
}

const SettingsFormNavbar: FC<SettingsFormNavbarProps> = ({ 
    currentFormName,
    setCurrentFormName
}) => {
    return (
        <Navbar>
            <Nav
                className={styles.formNav}
            >
                {settingsFormNamesArray.map((settingsFormName) => {
                    const settingsFormNameCapitalized: string = settingsFormName.charAt(0).toUpperCase() + settingsFormName.slice(1);
                    const isSettingsFormShown: boolean = currentFormName === settingsFormName;
                    return (
                        <NavLink
                            as={Button}
                            className='text-dark bg-transparent'
                            style={{
                                fontWeight: isSettingsFormShown ? 'bold' : 'normal',
                            }}
                            data-testid={`settingsFormLink${settingsFormNameCapitalized}`}
                            disabled={isSettingsFormShown}
                            draggable={false}
                            onClick={() => setCurrentFormName(settingsFormName)}
                            key={settingsFormName}
                        >
                            {settingsFormNameCapitalized}
                        </NavLink>
                    )
                })}
            </Nav>
        </Navbar>
    );
}

export default SettingsFormNavbar;