import { Component } from "react";
import { Col, Navbar, Button, Container, Nav, NavbarCollapse, NavbarToggle, DropdownItem } from 'react-bootstrap';

class SettingsNavigation extends Component {
    onClick(formName) {
        // Navigate to the chosen form
        this.props.navigate({
            to: formName,
            isForm: true
        });
    }

    render() {
        const settingsFormNames = [
            "game",
            "board"
        ];
        return (
            <Navbar
                as={Col}
                expand="md"
                md={3}
                className="d-grid gap-4 text-top align-self-start"
            >
                <Container>
                    <NavbarToggle
                        className="mb-3"
                        aria-controls="settingsNavigation"
                    />
                    <NavbarCollapse
                        id="settingsNavigation"
                    >
                        <Nav
                            className="flex-column gap-4"
                        >
                            {settingsFormNames
                                .map((formName, key) =>
                                    <DropdownItem
                                        as={Button}
                                        className="bg-transparent text-dark text-capitalize"
                                        onClick={() => this.onClick(formName)}
                                        disabled={formName === this.props.formName}
                                        key={key}
                                    >
                                        {formName}
                                    </DropdownItem>
                                )}
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        )
    }
}

export default SettingsNavigation;