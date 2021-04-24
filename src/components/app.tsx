import React from 'react';
import { ActivitiesList, CheckboxState } from './activities-list'
import Final from './final';
import Greetings from './greetings'
import Layout from './layout';
import PictureSelector from './picture-selector';

enum Page {
    Greetings,
    Activities,
    Pictures,
    Final
}

interface IProps {
}

interface IState {
    page: Page
    activities: string[]
    selectedActivities: string[]
}

const activities: string[] = [
    'Buildings',
    'Amusement',
    'Theaters',
    'Movies',
    'Museums',
    'Nature',
    'Wilderness'
]

export default class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.onGreetingsClosed = this.onGreetingsClosed.bind(this)
        this.onActivitiesClosed = this.onActivitiesClosed.bind(this)
        this.onPicturesClosed = this.onPicturesClosed.bind(this)
        this.onFinalClosed = this.onFinalClosed.bind(this)
        this.state = { page: Page.Greetings, activities: activities, selectedActivities: [] }
    }

    onGreetingsClosed() {
        this.setState({ page: Page.Activities })
    }

    onActivitiesClosed(selectedActivities: string[]) {
        this.setState({ page: Page.Pictures, selectedActivities: selectedActivities })
    }

    onPicturesClosed() {
        this.setState({ page: Page.Final })
    }

    onFinalClosed() {
        this.setState({ page: Page.Greetings })
    }

    render() {
        return (
            <Layout>
                {this.state.page == Page.Greetings && <Greetings onExitCb={this.onGreetingsClosed} />}
                {this.state.page == Page.Activities && <ActivitiesList activities={this.state.activities} onExitCb={this.onActivitiesClosed} />}
                {this.state.page == Page.Pictures && <PictureSelector selectedActivities={this.state.selectedActivities} onExitCb={this.onPicturesClosed} />}
                {this.state.page == Page.Final && <Final onExitCb={this.onFinalClosed} />}
            </Layout>
        );
    }
}
