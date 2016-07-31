/*
* @Author: dmyang
* @Date:   2016-05-23 09:18:28
* @Last Modified by:   dmyang
* @Last Modified time: 2016-07-29 18:52:43
*/

'use strict'

import React from 'react'
import { render } from 'react-dom'

var App = React.createClass({
    render() {
        return <div>React app</div>
    }
})

render(<App />, document.getElementById('app'))
