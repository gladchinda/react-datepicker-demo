import React, { Component, Fragment } from 'react';
import { ArrowLeft, ArrowRight, CalendarContainer, CalendarHeader, CalendarGrid, CalendarDay, CalendarDate, CalendarMonth, HighlightedCalendarDate, TodayCalendarDate } from './styles';
import calendar, { isDate, isSameDay, isSameMonth, getDateISO, getNextMonth, getPreviousMonth, WEEK_DAYS, CALENDAR_MONTHS } from '../../helpers/calendar';

class Calendar extends Component {

	state = { ...this.resolveStateFromProp(), today: new Date }

	resolveStateFromDate(date) {
		const isDateObject = isDate(date);
		const _date = isDateObject ? date : new Date;

		return {
			current: isDateObject ? date : null,
			month: +(_date.getMonth()) + 1,
			year: _date.getFullYear()
		};
	}

	resolveStateFromProp() {
		return this.resolveStateFromDate(this.props.date);
	}

	getCalendarDates = () => {
		const { current, month, year } = this.state;
		const calendarMonth = month || +(current.getMonth()) + 1;
		const calendarYear = year || current.getFullYear();

		return calendar(calendarMonth, calendarYear);
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

	clearDayTimeout = () => {
		this.dayTimeout && clearTimeout(this.dayTimeout);
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
		const { current, month, year, today } = this.state;
		const _date = new Date(date.join('-'));

		const isToday = isSameDay(_date, today);
		const isCurrent = current && isSameDay(_date, current);
		const inMonth = (month && year) && isSameMonth(_date, new Date([year, month, 1].join('-')));

		const onClick = this.gotoDate(_date);

		const props = { index, inMonth, onClick, title: _date.toDateString() };

		const DateComponent = isCurrent
			? HighlightedCalendarDate
			: isToday ? TodayCalendarDate : CalendarDate;

		return <DateComponent key={getDateISO(_date)} {...props}>{ _date.getDate() }</DateComponent>
	}

	componentDidMount() {
		const now = new Date;
		const tomorrow = new Date().setHours(0, 0, 0, 0) + (24 * 60 * 60 * 1000);
		const ms = tomorrow - now;

		this.dayTimeout = setTimeout(() => {
			this.setState({ today: new Date }, this.clearDayTimeout);
		}, ms);
	}

	componentDidUpdate(prevProps) {
		const { date, onDateChanged } = this.props;
		const { date: prevDate } = prevProps;
		const dateMatch = (date == prevDate) || isSameDay(date, prevDate);

		!dateMatch && this.setState(this.resolveStateFromDate(date), () => {
			(typeof onDateChanged === 'function') && onDateChanged(date);
		});
	}

	componentWillUnmount() {
		this.clearPressureTimer();
		this.clearDayTimeout();
	}

	render() {
		return (
			<CalendarContainer>

				{ this.renderMonthAndYear() }

				<CalendarGrid>
					<Fragment>
						{ Object.keys(WEEK_DAYS).map(this.renderDayLabels) }
					</Fragment>

					<Fragment>
						{ this.getCalendarDates().map(this.renderCalendarDate) }
					</Fragment>
				</CalendarGrid>

			</CalendarContainer>
		)
	}

}

export default Calendar;
