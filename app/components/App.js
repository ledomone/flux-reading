import React from 'react';

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
