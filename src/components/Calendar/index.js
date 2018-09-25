import React, { Component, Fragment } from 'react';
import { ArrowLeft, ArrowRight, CalendarContainer, CalendarHeader, CalendarGrid, CalendarDay, CalendarDate, CalendarMonth, HighlightedCalendarDate, TodayCalendarDate } from './styles';
import calendar, { isSameDay, isSameMonth, getNextMonth, getPreviousMonth, WEEK_DAYS, CALENDAR_MONTHS } from '../../helpers/calendar';

class Calendar extends Component {

	state = this.resolveStateFromProp()

	resolveStateFromDate(date) {
		const isDate = Object.prototype.toString.call(date) === '[object Date]';
		const _date = isDate ? date : new Date;

		return {
			current: isDate ? date : null,
			month: +(_date.getMonth()) + 1,
			year: _date.getFullYear()
		};
	}

	resolveStateFromProp() {
		return this.resolveStateFromDate(this.props.date);
	}

	gotoDate = date => evt => {
		evt && evt.preventDefault();
		const { current } = this.state;
		!(current && isSameDay(date, current)) && this.setState(this.resolveStateFromDate(date));
	}

	gotoPreviousMonth = evt => {
		evt && evt.preventDefault();
		const { month, year } = this.state;
		this.setState(getPreviousMonth(month, year));
	}

	gotoNextMonth = evt => {
		evt && evt.preventDefault();
		const { month, year } = this.state;
		this.setState(getNextMonth(month, year));
	}

	renderMonthAndYear = () => {
		const { month, year } = this.state;
		const monthname = Object.keys(CALENDAR_MONTHS)[ Math.max(0, Math.min(month - 1, 11)) ];

		return (
			<CalendarHeader>
				<ArrowLeft onClick={this.gotoPreviousMonth} title="Previous Month" />
				<CalendarMonth>{monthname} {year}</CalendarMonth>
				<ArrowRight onClick={this.gotoNextMonth} title="Next Month" />
			</CalendarHeader>
		)
	}

	renderDayLabels = (day, index) => {
		const daylabel = WEEK_DAYS[day].toUpperCase();
		return <CalendarDay key={daylabel} index={index}>{daylabel}</CalendarDay>
	}

	renderCalendarDate = (date, index) => {
		const { current, month, year } = this.state;

		const datestring = date.join('-');
		const _date = new Date(datestring);

		const isToday = isSameDay(_date);
		const isCurrent = current && isSameDay(_date, current);
		const inMonth = (month && year) && isSameMonth(_date, new Date([year, month, 1].join('-')));

		const onClick = this.gotoDate(_date);

		const props = { index, inMonth, onClick, title: _date.toDateString() };

		const DateComponent = isCurrent
			? HighlightedCalendarDate
			: isToday ? TodayCalendarDate : CalendarDate;

		return <DateComponent key={datestring} {...props}>{ _date.getDate() }</DateComponent>
	}

	render() {
		let { current, month, year } = this.state;

		month = month || +(current.getMonth()) + 1;
		year = year || current.getFullYear();

		return (
			<CalendarContainer>

				{ this.renderMonthAndYear() }

				<CalendarGrid>
					<Fragment>
						{ Object.keys(WEEK_DAYS).map(this.renderDayLabels) }
					</Fragment>

					<Fragment>
						{ calendar(month, year).map(this.renderCalendarDate) }
					</Fragment>
				</CalendarGrid>

			</CalendarContainer>
		)
	}

}

export default Calendar;
