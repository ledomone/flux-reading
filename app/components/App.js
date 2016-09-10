import React from 'react';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello from React app component </h1>
        {this.props.children}
      </div>
    );
  }
}

export default App;
