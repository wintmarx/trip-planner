import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


export type CheckboxState = {
    name: string,
    checked: boolean,
    label: string
}

interface IProps {
    onExitCb: (selectedActivities: string[]) => void;
    activities: string[]
}

interface IState {
    checkboxes: CheckboxState[]
}

export class ActivitiesList extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        var checkboxes: CheckboxState[] = props.activities.map(activity => ({
            name: activity,
            checked: false,
            label: activity
        } as CheckboxState))

        this.state = { checkboxes: checkboxes }
    }

    toggleCheckbox(index: number) {
        const { checkboxes } = this.state
        checkboxes[index].checked = !checkboxes[index].checked;
        this.setState({ checkboxes: checkboxes })
    }

    renderCheckboxes() {
        const { checkboxes } = this.state;

        return checkboxes
            .map((checkbox, index) =>
                <div key={index}>
                    <FormControlLabel
                        control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={checkbox.checked} onChange={this.toggleCheckbox.bind(this, index)} />}
                        label={checkbox.label}
                    />
                </div>
            )
    }

    onExit() {
        var selectedActivities: string[] = this.state.checkboxes.filter(cb => cb.checked).map(cb => cb.name)
        this.props.onExitCb(selectedActivities)
    }

    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0' }}>Select activities</h3>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    padding: '1rem'
                }}>
                    {this.renderCheckboxes.call(this)}
                </div>
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={this.onExit.bind(this)}>
                    next step
                </Button>
            </>
        )
    }
}
