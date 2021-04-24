import React from "react"
import Button from '@material-ui/core/Button';
import { Input, OutlinedInput, TextField } from "@material-ui/core";

interface IProps {
    onExitCb: () => void
}

interface IState {
    email: string,
    emailValid: boolean
}

export default class Final extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { email: '', emailValid: true }
    }

    onSendClick() {
        console.log("email", this.state.email)
        setTimeout(() => this.props.onExitCb(), 5000)
    }

    validateEmail(email: string) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onInput(email: string) {
        this.setState({ email: email })
    }

    isInputError() {
        return (this.state.email.length > 0) && !this.validateEmail(this.state.email)
    }

    getInputErrorText() {
        return this.isInputError() ? 'Incorrect email' : ''
    }

    isButtonDisabled() {
        return !this.validateEmail(this.state.email)
    }

    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0' }}>Thank you!</h3>
                <h4 style={{ margin: 0, padding: '0.5rem 0 2rem 0' }}>We've created a perfect trip for you! Leave your email to get it.</h4>
                <div>
                    <TextField helperText={this.getInputErrorText()} error={this.isInputError()} id="email" type="email" label="Email" size="small" variant="outlined" onChange={(e) => this.onInput(e.target.value)} />
                    <Button disabled={this.isButtonDisabled()} style={{ float: 'right' }} variant="outlined" color="secondary" onClick={this.onSendClick.bind(this)}>
                        finish
                    </Button>
                </div>
            </>
        );
    }
}
