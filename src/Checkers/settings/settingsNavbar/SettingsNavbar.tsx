import { FC } from "react";
import { Container, NavbarBrand, Navbar, Button, Nav } from "react-bootstrap";
import styles from './SettingsNavbar.module.scss';

/**
 * Props for the Settings Nav Bar.
 * - `exitSettings`: Function to exit the settings page.
 */
interface SettingsNavbarProps {
    exitSettings: () => void;
}

const SettingsNavbar: FC<SettingsNavbarProps> = ({ 
    exitSettings
}) => {
    return (
        <Navbar
            className="d-flex justify-content-between bg-dark p-3"
        >
            <Container
                fluid
            >
                <NavbarBrand
                    className="text-white"
                >
                    Settings
                </NavbarBrand>
                <Nav>
                    <Button
                        data-testid="exitButton"
                        className="border-0 bg-transparent text-bold btn btn-lg text-white"
                        onClick={exitSettings}
                    >
                        X
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default SettingsNavbar;