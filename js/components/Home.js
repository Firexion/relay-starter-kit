import React from 'react'
import {Link} from 'react-router'
import Relay from 'react-relay'

import RaisedButton from 'material-ui/RaisedButton';

export default class Home extends React.Component {
  render () {
    return (
        <Link to="/users">
          <RaisedButton label="Users" />
        </Link>
    );
  }
}