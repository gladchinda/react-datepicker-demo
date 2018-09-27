import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft, ArrowRight, CalendarContainer, CalendarHeader, CalendarGrid, CalendarDay, CalendarDate, CalendarMonth, HighlightedCalendarDate, TodayCalendarDate } from './styles';
import calendar, { isDate, dateDiff, isBeforeDay, isAfterDay, isSameDay, isSameMonth, getDateISO, getDateArray, getNextMonth, getPreviousMonth, getMonthDays, WEEK_DAYS, CALENDAR_MONTHS } from '../../helpers/calendar';

class Calendar extends React.Component {

  state = { ...this.stateFromProp(), mindate: new Date('2016-06-20'), maxdate: new Date('2020-09-30'), today: new Date() }

	stateFromDate(date) {
    const current = isDate(date) ? date : null;
    const [ year, month ] = getDateArray(current || new Date);
		return { current, month, year };
	}

	stateFromProp() {
		return this.stateFromDate(this.props.date);
  }
  
  changeHandler = date => () => {
    const { onDateChanged } = this.props;
    (typeof onDateChanged === 'function') && onDateChanged(date);
  }

  calendarWithinRange = date => {
    if (!isDate(date)) return false;

    const { maxdate, mindate } = this.state;
    const min = new Date(new Date(+mindate).setDate(1)).setHours(0, 0, 0, 0);
    const max = new Date(new Date(+maxdate).setDate(getMonthDays(maxdate))).setHours(23, 59, 59, 999);

    return date >= min && date <= max;
  }

	getCalendarDates = () => {
    const { current, month, year } = this.state;
    const [ currentYear, currentMonth ] = current ? getDateArray(current) : [];
		return calendar(new Date([year || currentYear, month || currentMonth]));
  }

	gotoDate = date => evt => {
		evt && evt.preventDefault();
    const { current, maxdate, mindate } = this.state;
    const isCurrent = current && isSameDay(date, current);
    const outOfRange = isBeforeDay(date, mindate) || isAfterDay(date, maxdate);

    !(isCurrent || outOfRange) && this.setState(this.stateFromDate(date), this.changeHandler(date));
	}

	gotoPreviousMonth = () => {
    const { month, year } = this.state;
    const previousMonth = getPreviousMonth(new Date([year, month]));
    const previous = new Date([ previousMonth.year, previousMonth.month ]);

    this.calendarWithinRange(previous) && this.setState(previousMonth);
	}

	gotoNextMonth = () => {
    const { month, year } = this.state;
    const nextMonth = getNextMonth(new Date([year, month]));
    const next = new Date([ nextMonth.year, nextMonth.month ]);

    this.calendarWithinRange(next) && this.setState(nextMonth);
	}

  gotoPreviousYear = () => {
    const { month, year } = this.state;
    const previous = new Date([year - 1, month]);
    this.calendarWithinRange(previous) && this.setState({ year: year - 1 });
  }

  gotoNextYear = () => {
    const { month, year } = this.state;
    const next = new Date([year + 1, month]);
    this.calendarWithinRange(next) && this.setState({ year: year + 1 });
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
		const { current, month, year, today, maxdate, mindate } = this.state;
    const thisDay = new Date(date);
    const monthFirstDay = new Date([year, month]);

		const isToday = !!today && isSameDay(thisDay, today);
    const isCurrent = !!current && isSameDay(thisDay, current);
    const inMonth = !!(month && year) && isSameMonth(thisDay, monthFirstDay);
    const outOfRange = isBeforeDay(thisDay, mindate) || isAfterDay(thisDay, maxdate);

		const props = {
      index,
      inMonth,
      inRange: !outOfRange,
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

    !dateMatch && this.setState(this.stateFromDate(date), this.changeHandler(date));
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
