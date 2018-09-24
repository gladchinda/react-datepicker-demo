import React, { Component } from 'react';
import Calendar from './components/Calendar';

class App extends Component {
  render() {
    return <div className="w-50">
			<Calendar date={new Date('2018-08-15')} />
		</div>
  }
}

export default App;
