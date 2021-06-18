import React, { Component } from 'react';
import Routes from "./Routes";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Routes />
        );
    }
}
