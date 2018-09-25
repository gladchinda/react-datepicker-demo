import React from 'react';
import Calendar from '../Calendar';
import { getDateISO } from '../../helpers/calendar';
import { DatePickerContainer, DatePickerFormGroup, DatePickerLabel, DatePickerInput, DatePickerDropdown, DatePickerDropdownToggle, DatePickerDropdownMenu } from './styles';

class Datepicker extends React.Component {

	state = { date: '' && getDateISO(), calendarOpen: false }

	toggleCalendar = () => this.setState({ calendarOpen: !this.state.calendarOpen })

	handleChange = evt => evt.preventDefault()

	handleDateChange = date => {
		const { onDatePicked } = this.props;

		this.setState({ date: getDateISO(date), calendarOpen: false }, () => {
			(typeof onDatePicked === 'function') && onDatePicked(this.state.date);
		});
	}

	get date() {
		return this.state.date;
	}

	render() {
		const { label } = this.props;
		const { date, calendarOpen } = this.state;

		return (
			<DatePickerContainer>

				<DatePickerFormGroup>
					<DatePickerLabel>{label}</DatePickerLabel>
					<DatePickerInput type="text" value={date.split('-').join(' / ')} onChange={this.handleChange} readOnly="readonly" placeholder="YYYY / MM / DD" />
				</DatePickerFormGroup>

				<DatePickerDropdown isOpen={calendarOpen} toggle={this.toggleCalendar}>
					<DatePickerDropdownToggle color="transparent" />

					<DatePickerDropdownMenu>
						<Calendar date={date && new Date(date)} onDateChanged={this.handleDateChange} />
					</DatePickerDropdownMenu>
				</DatePickerDropdown>

			</DatePickerContainer>
		)
	}

}

export default Datepicker;
