import { Component, lazy, Suspense } from "react";
import { Button, Container, Row } from 'react-bootstrap';
import LoadingFallback from "../LoadingFallback";
import SettingsNavigation from "./SettingsNavigation";
import SettingsForm from "./SettingsForm";
import '../styling/settings.scss';

const NavigateWarning = lazy(() => import('./NavigateWarning'));

class Settings extends Component {
    constructor({ settings }) {
        super();
        this.state = {
            formSettings: JSON.parse(JSON.stringify(settings)),
            formName: "game",
            updatedFormSettingsNames: [],
            navigateTo: null
        };
        this.keyPressed = this.keyPressed.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keydown', this.keyPressed, false);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyPressed, false);
    }

    get updatedFormSettingsNames() {
        const updatedFormSettingsNames = this.state.updatedFormSettingsNames;
        return updatedFormSettingsNames
    }

    setUpdatedFormSettingsNames = (updatedFormSettingsNames) => {
        this.setState({
            updatedFormSettingsNames: updatedFormSettingsNames
        });
    }

    setNavigateTo = (navigateTo) => {
        this.setState({
            navigateTo
        });
    }

    get navigateTo() {
        const naviagteTo = this.state.navigateTo;
        return naviagteTo
    }


    navigate = ({ to, isForm }) => {
        // Set the chosen form (or component outside the settings file if "to" isn't a form) as "navigateTo" state.
        // if the form settings was updated, and the user tried to navigate to another form, or leave the settings page.
        // This is important to throw an error, and let the user decide to continue, or go back.
        if (this.formSettingsUpdated) {
            this.setNavigateTo({
                to,
                isForm
            })
            return
        }

        // If the form wasn't updated, set the "navigateTo" state to null.
        //! This state is only important to continue inside the error page when the user choose to continue, 
        //! what isn't the case if the user didn't change the form
        if (to) {
            this.setNavigateTo(null);
        }

        // If the user didn't navigate to another form, esc the form, and go to the chosen component
        if (!isForm) {
            if (to === null)
                throw Error("You can't escape this component. There is no previous component rendered.")

            this.props.setCurrentComponent(to);
            return
        }

        // Go to the chosen form
        this.setState({
            formName: to
        })
    }

    escape() {
        // Try to navigate to the main menu
        this.navigate({
            to: this.props.previousComponent,
            isForm: false
        });
    }

    setformName = (formName) => {
        this.setState({
            formName: formName
        });
    }

    get formSettingsUpdated() {
        // Return if the user changed 1 or more settings
        const formSettingsUpdated = this.state.updatedFormSettingsNames.length !== 0;
        return formSettingsUpdated
    }

    get formName() {
        const formName = this.state.formName;
        return formName
    }

    setFormSettings = (formSettings) => {
        this.setState({
            formSettings
        });
    }

    get formSettings() {
        const formSettings = this.state.formSettings;
        return formSettings
    }

    keyPressed(ev) {
        // If the user pressed the esc key
        if (ev.key === "Escape")
            this.escape()
    }

    updateFormSettings = (setting, changedValue) => {
        // Loop over the given keys (setting parameter) to get the original value of the setting, 
        // and check if the keys hierachy is correct.
        // e.g. If the setting parameter is "key1-key2" = {'key1': {'key2': {'value': 'value'}}} inside the json file
        // If one of the keys couldn't be found, or the last child don't have the 'value' key return an error
        const keys = setting.split('-');
        let settingsKeyValue = this.props.settings;
        let formSettingsKeyValue = this.formSettings;
        for (const [i, key] of keys.entries()) {
            // If the key is used to give an unique id inside the jsx for loop
            // Usually used inside an select/option field
            if (
                !isNaN(key) &&
                i === keys.length - 1
            )
                break

            if (formSettingsKeyValue[key] === undefined)
                throw Error(`The key "${key}" couldn't be found. Check if the hierachy is correctly written`)
            formSettingsKeyValue = formSettingsKeyValue[key];
            settingsKeyValue = settingsKeyValue[key]
        }

        // If the changed value can't be set, throw an error, else set the changed value
        if (!("value" in formSettingsKeyValue))
            throw Error("The key named \"value\" is missing at the last child. Add the key named \"value\" inside the json file")
        formSettingsKeyValue.value = changedValue

        // If the original value of the setting was changed, add the setting name to the "updatedFormSettingsNames" state.
        // Else remove the name inside the "updatedFormSettingsNames" state
        const updatedFormSettingsNames = this.updatedFormSettingsNames;
        if (settingsKeyValue.value === changedValue)
            updatedFormSettingsNames.splice(updatedFormSettingsNames.indexOf(setting), 1);
        else
            updatedFormSettingsNames.push(setting);
        this.setUpdatedFormSettingsNames(updatedFormSettingsNames);
    }

    handleSubmit = (ev) => {
        ev.preventDefault();

        // If there were no changes, return
        if (!this.updatedFormSettingsNames.length)
            return

        // Reset the form setting names that were changed.
        this.setUpdatedFormSettingsNames([]);

        // Update the global settings
        const settings = JSON.parse(JSON.stringify(this.formSettings));
        this.props.setSettings(settings);
    }

    render() {
        return (
            <>
                <div
                    className="m-3 d-flex justify-content-between"
                >
                    <h1>
                        Settings
                    </h1>
                    <Button
                        className="border-0 bg-transparent text-dark text-bold btn btn-lg"
                        onClick={() => this.escape()}
                        data-testid="escapeButton"
                    >
                        X
                    </Button>
                </div>
                <hr />
                {(
                    this.formSettingsUpdated &&
                    this.navigateTo
                )
                    ? <Suspense
                        fallback={<LoadingFallback />}
                    >
                        <NavigateWarning
                            settings={this.props.settings}
                            setFormSettings={this.setFormSettings}
                            navigate={this.navigate}
                            navigateTo={this.navigateTo}
                            setNavigateTo={this.setNavigateTo}
                            setUpdatedFormSettingsNames={this.setUpdatedFormSettingsNames}
                        />
                    </Suspense>
                    : <Container>
                        <Row>
                            <SettingsNavigation
                                formName={this.formName}
                                navigate={this.navigate}
                            />
                            <SettingsForm
                                handleSubmit={this.handleSubmit}
                                formName={this.formName}
                                updateFormSettings={this.updateFormSettings}
                                formSettings={this.formSettings}
                            />
                        </Row>
                    </Container>
                }
            </>
        )
    }
}

export default Settings;