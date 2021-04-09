import React from "react"
import Button from '@material-ui/core/Button';
import { timeout } from "q";

class Final extends React.Component {
    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0' }}>Thank you!</h3>
                <h4 style={{ margin: 0, padding: '0.5rem 0' }}>Here is your pefect trip! Leave your email to get it.</h4>
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={() => { console.log("send email"); setTimeout(() => this.props.changeState('greetings'), 5000) }}>
                    send
                </Button>
            </>
        );
    }
}

export default Final