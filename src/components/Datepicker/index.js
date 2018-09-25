import React from 'react';
import Calendar from '../Calendar';
import { isDate, getDateISO } from '../../helpers/calendar';
import { DatePickerContainer, DatePickerFormGroup, DatePickerLabel, DatePickerInput, DatePickerDropdown, DatePickerDropdownToggle, DatePickerDropdownMenu } from './styles';

class Datepicker extends React.Component {

	state = { date: null, calendarOpen: false }

	toggleCalendar = () => this.setState({ calendarOpen: !this.state.calendarOpen })

	handleChange = evt => evt.preventDefault()

	handleDateChange = date => {
		const { onDatePicked } = this.props;
		const { date: currentDate } = this.state;
		const newDate = date ? getDateISO(date) : null;

		(currentDate !== newDate) && this.setState({ date: newDate, calendarOpen: false }, () => {
			(typeof onDatePicked === 'function') && onDatePicked(this.state.date);
		});
	}

	get date() {
		return this.state.date;
	}

	componentDidMount() {
		const { date } = this.props;
		const newDate = date && new Date(date);

		isDate(newDate) && this.setState({ date: getDateISO(newDate) });
	}

	componentDidUpdate(prevProps) {
		const { date } = this.props;
		const { date: prevDate } = prevProps;
		const dateISO = getDateISO(new Date(date));
		const prevDateISO = getDateISO(new Date(prevDate));

		(dateISO !== prevDateISO) && this.setState({ date: dateISO });
	}

	render() {
		const { label } = this.props;
		const { date, calendarOpen } = this.state;

		return (
			<DatePickerContainer>

				<DatePickerFormGroup>
					<DatePickerLabel>{label}</DatePickerLabel>
					<DatePickerInput type="text" value={date ? date.split('-').join(' / ') : ''} onChange={this.handleChange} readOnly="readonly" placeholder="YYYY / MM / DD" />
				</DatePickerFormGroup>

				<DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
					<DatePickerDropdownToggle color="transparent" />

					<DatePickerDropdownMenu>
						{ calendarOpen && <Calendar date={date && new Date(date)} onDateChanged={this.handleDateChange} /> }
					</DatePickerDropdownMenu>
				</DatePickerDropdown>

			</DatePickerContainer>
		)
	}

}

export default Datepicker;
