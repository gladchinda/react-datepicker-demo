export const WEEK_DAYS = {
	Sunday: "Sun",
	Monday: "Mon",
	Tuesday: "Tue",
	Wednesday: "Wed",
	Thursday: "Thu",
	Friday: "Fri",
	Saturday: "Sat"
}

export const CALENDAR_MONTHS = {
	January: "Jan",
	February: "Feb",
	March: "Mar",
	April: "Apr",
	May: "May",
	June: "Jun",
	July: "Jul",
	August: "Aug",
	September: "Sep",
	October: "Oct",
	November: "Nov",
	December: "Dec"
}

export const CALENDAR_MONTHS_30 = [4, 6, 9, 11];

export const isDate = date => {
	const isDate = Object.prototype.toString.call(date) === '[object Date]';
	const isValidDate = date && !Number.isNaN(+date);
	return isDate && isValidDate;
}

export const getDateISO = (date = new Date) => {
  return isDate(date)
    ? [ date.getFullYear(), date.getMonth() + 1, date.getDate() ]
      .map(v => String(v).padStart(2, '0'))
      .join('-')
    : null;
}

export const getDateArray = (date = new Date) => {
  const [year = null, month = null, day = null] = (getDateISO(date) || '').split('-').map(v => +v);
  return [ year, month, day ];
}

export const getMonthDays = (date = new Date) => {
  const [ year, month ] = getDateArray(date);
	return month === 2
    ? (year % 4 === 0) ? 29 : 28
		: (CALENDAR_MONTHS_30.includes(month)) ? 30 : 31;
}

export const getMonthFirstDay = (date = new Date) => {
	return new Date(new Date(+date).setDate(1)).getDay() + 1;
}

export const getPreviousMonth = (date = new Date) => {
  const [ year, month ] = getDateArray(date);
  return {
    month: month > 1 ? month - 1 : 12,
    year: month > 1 ? year : year - 1
  }
}

export const getNextMonth = (date = new Date) => {
  const [ year, month ] = getDateArray(date);
  return {
    month: month < 12 ? month + 1 : 1,
    year: month < 12 ? year : year + 1
  };
}

export const dateDiff = (date1, date2 = new Date) => {
  return isDate(date1) && isDate(date2)
    ? (new Date(+date1).setHours(0, 0, 0, 0)) - (new Date(+date2).setHours(0, 0, 0, 0))
    : null;
}

export const isBeforeDay = (date1, date2) => +dateDiff(date1, date2) < 0

export const isAfterDay = (date1, date2) => +dateDiff(date1, date2) > 0

export const isSameDay = (date1, date2) => dateDiff(date1, date2) === 0

export const isSameMonth = (date1, date2) => {
  return isDate(date1) && isDate(date2)
    ? new Date(+date1).setDate(1) - new Date(+date2).setDate(1) === 0
    : false;
}

export const getWeeksToDisplay = (monthDays, monthFirstDay) => {
	return Math.ceil((monthDays + monthFirstDay - 1) / 7);
};

export default (date = new Date) => {
	const monthDays = getMonthDays(date);
	const monthFirstDay = getMonthFirstDay(date);
  const [ year, month ] = getDateArray(date);

	const daysFromPrevMonth = monthFirstDay - 1;
	const daysFromNextMonth = (getWeeksToDisplay(monthDays, monthFirstDay) * 7) - (daysFromPrevMonth + monthDays);

	const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(date);
	const { month: nextMonth, year: nextMonthYear } = getNextMonth(date);

	const prevMonthDays = getMonthDays(new Date([ prevMonthYear, prevMonth ]));

  const prevMonthDates = [...new Array(daysFromPrevMonth)]
    .map((n, index) => [ prevMonthYear, prevMonth, index + 1 + (prevMonthDays - daysFromPrevMonth) ]);

  const thisMonthDates = [...new Array(monthDays)]
    .map((n, index) => [ year, month, index + 1 ]);

  const nextMonthDates = [...new Array(daysFromNextMonth)]
    .map((n, index) => [ nextMonthYear, nextMonth, index + 1 ]);

	return [ ...prevMonthDates, ...thisMonthDates, ...nextMonthDates ];
}
