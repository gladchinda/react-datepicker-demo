import React from 'react';
import PropTypes from 'prop-types';
import Calendar from '../Calendar';
import { getDateISO } from '../../helpers/calendar';
import { DatePickerContainer, DatePickerFormGroup, DatePickerLabel, DatePickerInput, DatePickerDropdown, DatePickerDropdownToggle, DatePickerDropdownMenu } from './styles';

class DatePicker extends React.Component {

	state = { date: null, min: null, max: null, calendarOpen: false }

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

  get mindate() {
    const { min } = this.state;
    return min ? new Date(min) : null;
  }

  get maxdate() {
    const { max } = this.state;
    return max ? new Date(max) : null;
  }

	componentDidMount() {
    const { value: date, min, max } = this.props;

    const minDate = getDateISO(min ? new Date(min) : null);
    const maxDate = getDateISO(max ? new Date(max) : null);
    const newDate = getDateISO(date ? new Date(date) : null);

    minDate && this.setState({ min: minDate });
    maxDate && this.setState({ max: maxDate });
    newDate && this.setState({ date: newDate });
	}

	componentDidUpdate(prevProps) {
    const { value: date, min, max } = this.props;
    const { value: prevDate, min: prevMin, max: prevMax } = prevProps;

		const dateISO = getDateISO(new Date(date));
    const prevDateISO = getDateISO(new Date(prevDate));

    const minISO = getDateISO(new Date(min));
    const prevMinISO = getDateISO(new Date(prevMin));

    const maxISO = getDateISO(new Date(max));
    const prevMaxISO = getDateISO(new Date(prevMax));
    
    (minISO !== prevMinISO) && this.setState({ min: minISO });
    (maxISO !== prevMaxISO) && this.setState({ max: maxISO });
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
						{ calendarOpen && <Calendar date={this.date} min={this.mindate} max={this.maxdate} onDateChanged={this.handleDateChange} /> }
					</DatePickerDropdownMenu>
				</DatePickerDropdown>

			</DatePickerContainer>
		)
	}

}

DatePicker.propTypes = {
  min: PropTypes.string,
  max: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  onDateChange: PropTypes.func
};

export default DatePicker;
