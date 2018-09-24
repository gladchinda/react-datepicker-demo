export const THIS_YEAR = +(new Date().getFullYear());
export const THIS_MONTH = +(new Date().getMonth()) + 1;

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

export const CALENDAR_WEEKS = 6;

const zeroPad = (value, length) => `${value}`.padStart(length, '0')

export const getMonthDays = (month = THIS_MONTH, year = THIS_YEAR) => {
	const months30 = [4, 6, 9, 11];
	const leapYear = year % 4 === 0;

	return month === 2
		? leapYear
			? 29
			: 28
		: months30.includes(month)
			? 30
			: 31;
}

export const getMonthFirstDay = (month = THIS_MONTH, year = THIS_YEAR) => {
	return +(new Date(`${year}-${zeroPad(month)}-01`).getDay()) + 1;
}

export const isSameMonth = (date, basedate = new Date()) => {
	const basedateMonth = +(basedate.getMonth()) + 1;
	const basedateYear = basedate.getFullYear();

	const dateMonth = +(date.getMonth()) + 1;
	const dateYear = date.getFullYear();

	return (+basedateMonth === +dateMonth) && (+basedateYear === +dateYear);
}

export const isSameDay = (date, basedate = new Date()) => {
	const basedateDate = basedate.getDate();
	const basedateMonth = +(basedate.getMonth()) + 1;
	const basedateYear = basedate.getFullYear();

	const dateDate = date.getDate();
	const dateMonth = +(date.getMonth()) + 1;
	const dateYear = date.getFullYear();

	return (+basedateDate === +dateDate) && (+basedateMonth === +dateMonth) && (+basedateYear === +dateYear);
}

export default (month = THIS_MONTH, year = THIS_YEAR) => {
	const monthDays = getMonthDays(month, year);
	const monthFirstDay = getMonthFirstDay(month, year);

	const daysFromPrevMonth = monthFirstDay - 1;
	const daysFromNextMonth = (CALENDAR_WEEKS * 7) - (daysFromPrevMonth + monthDays);

	const prevMonth = (month > 1) ? month - 1 : 12;
	const prevMonthYear = (month > 1) ? year : year - 1;
	const prevMonthDays = getMonthDays(prevMonth, prevMonthYear);

	const nextMonth = (month < 12) ? month + 1 : 1;
	const nextMonthYear = (month < 12) ? year : year + 1;

	const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
		const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
		return [ prevMonthYear, zeroPad(prevMonth), zeroPad(day) ];
	});

	const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
		const day = index + 1;
		return [year, zeroPad(month), zeroPad(day)];
	});

	const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
		const day = index + 1;
		return [nextMonthYear, zeroPad(nextMonth), zeroPad(day)];
	});

	return [ ...prevMonthDates, ...thisMonthDates, ...nextMonthDates ];
}
