import React from 'react'
import { TagsSelector, Tags } from './tags-selector'
import Final from './final'
import Greetings from './greetings'
import Layout from './layout'
import PictureSelector from './picture-selector'
import { useStaticQuery, graphql } from 'gatsby'

enum Page {
    Greetings,
    Activities,
    Pictures,
    Final
}

export type PlaceData = {
    name: string
    description: string
    photo: string
    time_to_visit: number
    tags: Tags
}

interface IProps {
    places: PlaceData[]
    tags: Tags
}

interface IState {
    page: Page
    selTags: Tags
}

export class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.onGreetingsClosed = this.onGreetingsClosed.bind(this)
        this.onActivitiesClosed = this.onActivitiesClosed.bind(this)
        this.onPicturesClosed = this.onPicturesClosed.bind(this)
        this.onFinalClosed = this.onFinalClosed.bind(this)
        this.state = { page: Page.Greetings, selTags: { places: [], themes: [] } }
    }

    onGreetingsClosed() {
        this.setState({ page: Page.Activities })
    }

    onActivitiesClosed(selTags: Tags) {
        this.setState({ page: Page.Pictures, selTags: selTags })
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
                {this.state.page == Page.Activities && <TagsSelector tags={this.props.tags} onExitCb={this.onActivitiesClosed} />}
                {this.state.page == Page.Pictures && <PictureSelector selTags={this.state.selTags} places={this.props.places} onExitCb={this.onPicturesClosed} />}
                {this.state.page == Page.Final && <Final onExitCb={this.onFinalClosed} />}
            </Layout>
        );
    }
}
