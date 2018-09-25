import styled from 'styled-components';

export const Arrow = styled.button`
	appearance: none;
	user-select: none;
	outline: none !important;
	display: inline-block;
	position: relative;
	cursor: pointer;
	padding: 0;
	border: none;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	transition: all .25s ease-out;
`;

export const ArrowLeft = styled(Arrow)`
	border-right: 12px solid #ccc;
	left: 2rem;
	:hover {
		border-right-color: #06c;
	}
`;

export const ArrowRight = styled(Arrow)`
	border-left: 12px solid #ccc;
	right: 2rem;
	:hover {
		border-left-color: #06c;
	}
`;

export const CalendarContainer = styled.div`
	font-size: 5px;
	border: 1px solid #ddd;
`;

export const CalendarHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
`;

export const CalendarMonth = styled.div`
	font-weight: 500;
	font-size: 6em;
	color: #333;
	text-align: center;
	padding: 0.5em 0.25em;
	word-spacing: 5px;
	user-select: none;
`;

export const CalendarCell = styled.div`
	text-align: center;
	align-self: center;
	letter-spacing: 0.1rem;
	user-select: none;
  grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
	font-weight: 600;
	font-size: 2.25em;
	padding: 0.5em 0.25em;
	color: #999;
	border-top: 1px solid #ddd;
`;

export const CalendarDate = styled(CalendarCell)`
	font-weight: ${props => props.inMonth ? 500 : 300};
	font-size: 4em;
	padding: 0.5em 0.25em;
	cursor: pointer;
	border-bottom: 1px solid #ddd;
	border-top: ${props => Math.floor(props.index / 7) === 0 ? `1px solid #ddd` : `none`};
	border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
	color: ${props => props.inMonth ? `#333` : `#ddd`};
  grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
`;

export const HighlightedCalendarDate = styled(CalendarDate)`
	color: #fff;
	background: #06c;
	position: relative;
	::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 2px solid #06c;
	}
`;

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
	color: #06c;
	background: transparent;
	::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		border-bottom: 0.75em solid #06c;
		border-left: 0.75em solid transparent;
		border-top: 0.75em solid transparent;
	}
`;
