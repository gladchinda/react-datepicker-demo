import React, { Component, Fragment } from 'react';
import { ArrowLeft, ArrowRight, CalendarContainer, CalendarHeader, CalendarGrid, CalendarDay, CalendarDate, CalendarMonth, HighlightedCalendarDate, TodayCalendarDate } from './styles';
import calendar, { isSameDay, isSameMonth, getDateISO, getNextMonth, getPreviousMonth, WEEK_DAYS, CALENDAR_MONTHS } from '../../helpers/calendar';

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
		const { onDateChanged } = this.props;

		!(current && isSameDay(date, current)) && this.setState(this.resolveStateFromDate(date), () => {
			(typeof onDateChanged === 'function') && onDateChanged(date);
		});
	}

	gotoPreviousMonth = () => {
		const { month, year } = this.state;
		this.setState(getPreviousMonth(month, year));
	}

	gotoNextMonth = () => {
		const { month, year } = this.state;
		this.setState(getNextMonth(month, year));
	}

	gotoPreviousYear = (skip = 1) => {
		const { year } = this.state;
		this.setState({ year: year - skip });
	}

	gotoNextYear = (skip = 1) => {
		const { year } = this.state;
		this.setState({ year: year + skip });
	}

	handlePressure = fn => {
		if (typeof fn === 'function') {
			fn();
			this.pressureTimeout = setTimeout(() => {
				this.pressureTimer = setInterval(fn, 100);
			}, 500);
		}
	}

	clearPressureTimer = () => {
		this.pressureTimer && clearInterval(this.pressureTimer);
		this.pressureTimeout && clearTimeout(this.pressureTimeout);
	}

	handlePrevious = evt => {
		evt && evt.preventDefault();
		const fn = evt.shiftKey ? this.gotoPreviousYear : this.gotoPreviousMonth;
		this.handlePressure(fn);
	}

	handleNext = evt => {
		evt && evt.preventDefault();
		const fn = evt.shiftKey ? this.gotoNextYear : this.gotoNextMonth;
		this.handlePressure(fn);
	}

	renderMonthAndYear = () => {
		const { month, year } = this.state;
		const monthname = Object.keys(CALENDAR_MONTHS)[ Math.max(0, Math.min(month - 1, 11)) ];

		return (
			<CalendarHeader>
				<ArrowLeft onMouseDown={this.handlePrevious} onMouseUp={this.clearPressureTimer} title="Previous Month" />
				<CalendarMonth>{monthname} {year}</CalendarMonth>
				<ArrowRight onMouseDown={this.handleNext} onMouseUp={this.clearPressureTimer} title="Next Month" />
			</CalendarHeader>
		)
	}

	renderDayLabels = (day, index) => {
		const daylabel = WEEK_DAYS[day].toUpperCase();
		return <CalendarDay key={daylabel} index={index}>{daylabel}</CalendarDay>
	}

	renderCalendarDate = (date, index) => {
		const { current, month, year } = this.state;
		const _date = new Date(date.join('-'));

		const isToday = isSameDay(_date);
		const isCurrent = current && isSameDay(_date, current);
		const inMonth = (month && year) && isSameMonth(_date, new Date([year, month, 1].join('-')));

		const onClick = this.gotoDate(_date);

		const props = { index, inMonth, onClick, title: _date.toDateString() };

		const DateComponent = isCurrent
			? HighlightedCalendarDate
			: isToday ? TodayCalendarDate : CalendarDate;

		return <DateComponent key={getDateISO(_date)} {...props}>{ _date.getDate() }</DateComponent>
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
