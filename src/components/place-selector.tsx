import React from "react"
import Button from '@material-ui/core/Button';
import { Tags } from "./tags-selector";
import { PlaceData } from "./app";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

type CheckboxState = {
    name: string,
    checked: boolean,
    label: string
}

interface IProps {
    onExitCb: () => void
    selTags: Tags
    places: PlaceData[]
}

interface IState {
    checkboxes: CheckboxState[]
}

export default class PlaceSelector extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        var dict: { [id: string]: number } = {}

        this.props.places.forEach(place => {
            dict[place.name] = place.tags.places.filter(tag => this.props.selTags.places.includes(tag)).length
                + place.tags.themes.filter(tag => this.props.selTags.themes.includes(tag)).length
        })

        const sorted = this.props.places.sort((a: PlaceData, b: PlaceData) => {
            return dict[b.name] - dict[a.name]
        })

        const checkboxes: CheckboxState[] = sorted.map(place => ({
            name: place.name,
            checked: false,
            label: `${place.name}. Score: ${dict[place.name]}`
        } as CheckboxState))

        this.state = { checkboxes: checkboxes }
    }

    toggleCheckbox(index: number) {
        const { checkboxes } = this.state
        checkboxes[index].checked = !checkboxes[index].checked;
        this.setState({ checkboxes: checkboxes })
    }

    renderCheckboxes() {
        return this.state.checkboxes
            .map((checkbox, index) =>
                <div key={index}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                checked={checkbox.checked}
                                onChange={this.toggleCheckbox.bind(this, index)}
                            />
                        }
                        label={checkbox.label}
                    />
                </div>
            )
    }

    render() {
        return (
            <>
                <h3 style={{ margin: 0, padding: '0.5rem 0 2rem 0' }}>Select places</h3>
                {this.renderCheckboxes.call(this)}
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={this.props.onExitCb}>
                    next step
                </Button>
            </>
        );
    }
}
