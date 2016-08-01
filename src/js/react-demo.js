/*
* @Author: dmyang
* @Date:   2016-05-23 09:18:28
* @Last Modified by:   dmyang
* @Last Modified time: 2016-08-01 15:31:42
*/

'use strict'

import React from 'react'
import { render } from 'react-dom'

class App extends React.Component {
    constructor(props: Object, context: Object) {
        super(props, context)

        this.state = {}
    }

    render() {
        return <div>React app</div>
    }
}

render(<App />, document.getElementById('app'))
