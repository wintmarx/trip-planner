import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

class ActivitiesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checkboxes: [
                { name: 'buildings', checked: false, label: 'Buildings' },
                { name: 'amusement', checked: false, label: 'Amusement' },
                { name: 'theaters', checked: false, label: 'Theaters' },
                { name: 'movies', checked: false, label: 'Movies' },
                { name: 'museums', checked: false, label: 'Museums' },
                { name: 'nature', checked: false, label: 'Nature' },
                { name: 'wilderness', checked: false, label: 'Wilderness' },
                { name: 'buildings', checked: false, label: 'Buildings' },
                { name: 'amusement', checked: false, label: 'Amusement' },
                { name: 'theaters', checked: false, label: 'Theaters' },
                { name: 'movies', checked: false, label: 'Movies' },
                { name: 'museums', checked: false, label: 'Museums' },
                { name: 'nature', checked: false, label: 'Nature' },
                { name: 'movies', checked: false, label: 'Movies' },
                { name: 'museums', checked: false, label: 'Museums' },
                { name: 'nature', checked: false, label: 'Nature' },
                { name: 'wilderness', checked: false, label: 'Wilderness' },
                { name: 'buildings', checked: false, label: 'Buildings' },
                { name: 'amusement', checked: false, label: 'Amusement' },
                { name: 'theaters', checked: false, label: 'Theaters' },
                { name: 'wilderness', checked: false, label: 'Wilderness' },
                { name: 'buildings', checked: false, label: 'Buildings' },
                { name: 'amusement', checked: false, label: 'Amusement' },
                { name: 'theaters', checked: false, label: 'Theaters' },
                { name: 'movies', checked: false, label: 'Movies' },
                { name: 'museums', checked: false, label: 'Museums' },
                { name: 'nature', checked: false, label: 'Nature' },
                { name: 'wilderness', checked: false, label: 'Wilderness' },
                { name: 'buildings', checked: false, label: 'Buildings' },
                { name: 'amusement', checked: false, label: 'Amusement' },
                { name: 'theaters', checked: false, label: 'Theaters' },
                { name: 'movies', checked: false, label: 'Movies' },
                { name: 'museums', checked: false, label: 'Museums' },
                { name: 'nature', checked: false, label: 'Nature' },
            ],
        };
    }

    toggleCheckbox(index) {
        const { checkboxes } = this.state;

        checkboxes[index].checked = !checkboxes[index].checked;

        this.setState({
            checkboxes
        });
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
            );
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
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={() => this.props.changeState('select-pictures')}>
                    next step
                </Button>
            </>
        );
    }
}

export default ActivitiesList
