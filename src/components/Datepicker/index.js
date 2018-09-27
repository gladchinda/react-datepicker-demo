import React from 'react';
import PropTypes from 'prop-types';
import Calendar from '../Calendar';
import { getDateISO } from '../../helpers/calendar';
import { DatePickerContainer, DatePickerFormGroup, DatePickerLabel, DatePickerInput, DatePickerDropdown, DatePickerDropdownToggle, DatePickerDropdownMenu } from './styles';

class DatePicker extends React.Component {

	state = { date: null, calendarOpen: false }

	toggleCalendar = () => this.setState({ calendarOpen: !this.state.calendarOpen })

	handleChange = evt => evt.preventDefault()

	handleDateChange = date => {
		const { onDateChange } = this.props;
		const { date: currentDate } = this.state;
		const newDate = getDateISO(date);

		(currentDate !== newDate) && this.setState({ date: newDate, calendarOpen: false }, () => {
			(typeof onDatePicked === 'function') && onDateChange(newDate);
		});
	}

  get value() {
    return this.state.date || '';
  }
  
  get date() {
    const { date } = this.state;
    return date ? new Date(date) : null;
  }

	componentDidMount() {
		const { value: date } = this.props;
    const newDate = getDateISO(date ? new Date(date) : null);
    
		newDate && this.setState({ date: newDate });
	}

	componentDidUpdate(prevProps) {
		const { value: date } = this.props;
		const { value: prevDate } = prevProps;
		const dateISO = getDateISO(new Date(date));
		const prevDateISO = getDateISO(new Date(prevDate));

		(dateISO !== prevDateISO) && this.setState({ date: dateISO });
	}

	render() {
		const { label } = this.props;
    const { calendarOpen } = this.state;
    const [value, placeholder] = [this.value, 'YYYY-MM-DD'].map(v => v.replace(/-/g, ' / '));

		return (
			<DatePickerContainer>

				<DatePickerFormGroup>
					<DatePickerLabel>{ label || 'Enter Date' }</DatePickerLabel>
          <DatePickerInput type="text" readOnly="readonly" value={value} onChange={this.handleChange} placeholder={placeholder} />
				</DatePickerFormGroup>

				<DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
					<DatePickerDropdownToggle color="transparent" />

					<DatePickerDropdownMenu>
						{ calendarOpen && <Calendar date={this.date} onDateChanged={this.handleDateChange} /> }
					</DatePickerDropdownMenu>
				</DatePickerDropdown>

			</DatePickerContainer>
		)
	}

}

DatePicker.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  onDateChange: PropTypes.func
};

export default DatePicker;
