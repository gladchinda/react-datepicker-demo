import React, { Component } from 'react';
import DatePicker from './components/DatePicker';

class App extends Component {
  render() {
    return (
			<div className="w-25 py-5 my-5 mx-auto">
        <DatePicker label="Birthday" min="2000-01-01" max="2010-12-31" />
			</div>
		)
  }
}

export default App;
