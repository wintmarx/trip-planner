import React from "react"
import Button from '@material-ui/core/Button';

class Greetings extends React.Component {
    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0' }}>Hello!</h3>
                <h4 style={{ margin: 0, padding: '0.5rem 0' }}>We can help you to create the pefect trip!</h4>
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={() => this.props.changeState('activities')}>
                    lets start
                </Button>
            </>
        );
    }
}

export default Greetings
