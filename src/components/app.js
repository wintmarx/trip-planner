import React from "react"
import ActivitiesList from './activities-list'
import Final from "./final";
import Greetings from './greetings'
import Layout from "./layout";
import PictureSelector from "./picture-selector";

class App extends React.Component {
    constructor(props) {
        super(props)

        this.changeState = this.changeState.bind(this)
        this.state = { page: 'greetings' }
    }

    changeState(newState) {
        this.setState({ page: newState })
        console.log('change state to', newState)
    }

    render() {
        return (
            <Layout>
                {this.state.page === 'greetings' && <Greetings changeState={this.changeState} />}
                {this.state.page === 'activities' && <ActivitiesList changeState={this.changeState} />}
                {this.state.page === 'select-pictures' && <PictureSelector changeState={this.changeState} />}
                {this.state.page === 'final' && <Final changeState={this.changeState} />}
            </Layout>
        );
    }
}

export default App