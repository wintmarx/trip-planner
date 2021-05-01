import React from "react"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';


type CheckboxState = {
    name: string,
    checked: boolean,
    label: string
}

export type Tags = {
    places: string[]
    themes: string[]
}

interface IProps {
    onExitCb: (selTags: Tags) => void;
    tags: Tags
}

interface IState {
    placeTagChks: CheckboxState[]
    themeTagChks: CheckboxState[]
}

export class TagsSelector extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        var placeTagChks: CheckboxState[] = props.tags.places.map(tag => ({
            name: tag,
            checked: false,
            label: tag
        } as CheckboxState))

        var themeTagChks: CheckboxState[] = props.tags.themes.map(tag => ({
            name: tag,
            checked: false,
            label: tag
        } as CheckboxState))

        this.state = {
            placeTagChks: placeTagChks,
            themeTagChks: themeTagChks
        }
    }

    toggleCheckbox(chkName: string, index: number) {
        const key = chkName as keyof IState
        const chks = this.state[key]
        chks[index].checked = !chks[index].checked;
        var state: IState = {} as IState
        state[key] = chks
        this.setState(state)
    }

    renderCheckboxes(chkName: string) {
        const key = chkName as keyof IState
        const chks = this.state[key]

        return chks
            .map((checkbox, index) =>
                <div key={index}>
                    <FormControlLabel
                        control={<Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} checked={checkbox.checked} onChange={this.toggleCheckbox.bind(this, chkName, index)} />}
                        label={checkbox.label}
                    />
                </div>
            )
    }

    onExit() {
        const tags: Tags = {
            places: this.state.placeTagChks.filter(cb => cb.checked).map(cb => cb.name),
            themes: this.state.themeTagChks.filter(cb => cb.checked).map(cb => cb.name)
        }
        this.props.onExitCb(tags)
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
                    {this.renderCheckboxes.call(this, "placeTagChks")}
                    {this.renderCheckboxes.call(this, "themeTagChks")}
                </div>
                <Button style={{ float: 'right' }} variant="outlined" color="secondary" onClick={this.onExit.bind(this)}>
                    next step
                </Button>
            </>
        )
    }
}
