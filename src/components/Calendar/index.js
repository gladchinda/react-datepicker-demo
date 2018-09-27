import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight, CalendarContainer, CalendarHeader, CalendarGrid, CalendarDay, CalendarDate, CalendarMonth, HighlightedCalendarDate, TodayCalendarDate } from './styles';
import calendar, { isDate, dateDiff, isSameDay, isSameMonth, getDateISO, getDateArray, getNextMonth, getPreviousMonth, WEEK_DAYS, CALENDAR_MONTHS } from '../../helpers/calendar';

class Calendar extends React.Component {

	state = { ...this.resolveStateFromProp(), today: new Date() }

	resolveStateFromDate(date) {
    const current = isDate(date) ? date : null;
    const [ year, month ] = getDateArray(current || new Date);
		return { current, month, year };
	}

	resolveStateFromProp() {
		return this.resolveStateFromDate(this.props.date);
  }
  
  dateChangeHandler = date => () => {
    const { onDateChanged } = this.props;
    (typeof onDateChanged === 'function') && onDateChanged(date);
  }

	getCalendarDates = () => {
    const { current, month, year } = this.state;
    const [ currentYear, currentMonth ] = current ? getDateArray(current) : [];
		return calendar(new Date([year || currentYear, month || currentMonth]));
  }

	gotoDate = date => evt => {
		evt && evt.preventDefault();
    const { current } = this.state;
    const isCurrent = current && isSameDay(date, current);

		!isCurrent && this.setState(this.resolveStateFromDate(date), this.dateChangeHandler(date));
	}

	gotoPreviousMonth = () => {
    const { month, year } = this.state;
    const date = new Date([year, month]);
		this.setState(getPreviousMonth(date));
	}

	gotoNextMonth = () => {
    const { month, year } = this.state;
    const date = new Date([year, month]);
		this.setState(getNextMonth(date));
	}

	gotoPreviousYear = () => {
		const { year } = this.state;
		this.setState({ year: year - 1 });
	}

	gotoNextYear = () => {
		const { year } = this.state;
		this.setState({ year: year + 1 });
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
    this.handlePressure(evt.shiftKey ? this.gotoPreviousYear : this.gotoPreviousMonth);
	}

	handleNext = evt => {
		evt && evt.preventDefault();
    this.handlePressure(evt.shiftKey ? this.gotoNextYear : this.gotoNextMonth);
	}

	renderMonthAndYear = () => {
		const { month, year } = this.state;
    const monthname = Object.keys(CALENDAR_MONTHS)[ Math.max(0, Math.min(month - 1, 11)) ];
    const props = { onMouseUp: this.clearPressureTimer };

		return (
			<CalendarHeader>
        <ArrowLeft title="Previous" onMouseDown={this.handlePrevious} {...props} />
				<CalendarMonth>{monthname} {year}</CalendarMonth>
        <ArrowRight title="Next" onMouseDown={this.handleNext} {...props} />
			</CalendarHeader>
		)
	}

	renderDayLabels = (day, index) => {
		const daylabel = WEEK_DAYS[day].toUpperCase();
		return <CalendarDay key={daylabel} index={index}>{daylabel}</CalendarDay>
	}

	renderCalendarDate = (date, index) => {
		const { current, month, year, today } = this.state;
    const thisDay = new Date(date);
    const monthFirstDay = new Date([year, month]);

		const isToday = !!today && isSameDay(thisDay, today);
    const isCurrent = !!current && isSameDay(thisDay, current);
    const inMonth = !!(month && year) && isSameMonth(thisDay, monthFirstDay);

		const props = {
      index,
      inMonth,
      onClick: this.gotoDate(thisDay),
      title: thisDay.toDateString()
    };

		const DateComponent = isCurrent
			? HighlightedCalendarDate
			: isToday ? TodayCalendarDate : CalendarDate;

		return (
      <DateComponent key={getDateISO(thisDay)} {...props}>
        { thisDay.getDate() }
      </DateComponent>
    )
	}

	componentDidMount() {
		const tomorrow = new Date().setHours(0, 0, 0, 0) + (24 * 60 * 60 * 1000);

		this.dayTimeout = setTimeout(() => {
			this.setState({ today: new Date }, this.clearDayTimeout);
		}, dateDiff(tomorrow));
	}

	componentDidUpdate(prevProps) {
		const { date } = this.props;
		const { date: prevDate } = prevProps;
		const dateMatch = (date === prevDate) || isSameDay(date, prevDate);

    !dateMatch && this.setState(this.resolveStateFromDate(date), this.dateChangeHandler(date));
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
					<React.Fragment>
						{ Object.keys(WEEK_DAYS).map(this.renderDayLabels) }
					</React.Fragment>

					<React.Fragment>
						{ this.getCalendarDates().map(this.renderCalendarDate) }
					</React.Fragment>
				</CalendarGrid>

			</CalendarContainer>
		)
	}

}

Calendar.propTypes = {
  date: PropTypes.instanceOf(Date),
  onDateChanged: PropTypes.func
};

export default Calendar;
