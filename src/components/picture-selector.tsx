import React from "react"
import Button from '@material-ui/core/Button';

interface IProps {
    onExitCb: () => void
    selectedActivities: string[]
}

export default class PictureSelector extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props)
    }

    renderList() {
        const { selectedActivities } = this.props
        return selectedActivities
            .map((activity, index) =>
                <ul key={index}>{activity}</ul>
            )
    }

    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0 2rem 0' }}>Select pictures</h3>
                {this.renderList.call(this)}
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={this.props.onExitCb}>
                    next step
                </Button>
            </>
        );
    }
}
