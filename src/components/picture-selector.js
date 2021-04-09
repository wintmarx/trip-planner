import React from "react"
import Button from '@material-ui/core/Button';

class PictureSelector extends React.Component {
    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0' }}>Select pictures</h3>
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={() => this.props.changeState('final')}>
                    next step
                </Button>
            </>
        );
    }
}

export default PictureSelector