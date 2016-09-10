import React from 'react';
import { render } from 'react-dom';
import { Route } from 'react-router';

class App extends React.Component {
  render() {
    return (
      <div> Hello from React app component
        {this.props.children}
      </div>
    );
  }
}

export default App;
