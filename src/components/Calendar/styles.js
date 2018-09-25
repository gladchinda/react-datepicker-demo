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
	border-top: 1.6em solid transparent;
	border-bottom: 1.6em solid transparent;
	transition: all .25s ease-out;
`;

export const ArrowLeft = styled(Arrow)`
	border-right: 2.4em solid #ccc;
	left: 1.5rem;
	:hover {
		border-right-color: #06c;
	}
`;

export const ArrowRight = styled(Arrow)`
	border-left: 2.4em solid #ccc;
	right: 1.5rem;
	:hover {
		border-left-color: #06c;
	}
`;

export const CalendarContainer = styled.div`
	font-size: 5px;
	border: 2px solid #06c;
	border-radius: 5px;
	overflow: hidden;
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
	font-size: 5em;
	color: #06c;
	text-align: center;
	padding: 0.5em 0.25em;
	word-spacing: 5px;
	user-select: none;
`;

export const CalendarCell = styled.div`
	text-align: center;
	align-self: center;
	letter-spacing: 0.1rem;
	padding: 0.6em 0.25em;
	user-select: none;
  grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
	font-weight: 600;
	font-size: 2.25em;
	color: #06c;
	border-top: 2px solid #06c;
	border-bottom: 2px solid #06c;
	border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `2px solid #06c`};
`;

export const CalendarDate = styled(CalendarCell)`
	font-weight: ${props => props.inMonth ? 500 : 300};
	font-size: 4em;
	cursor: pointer;
	border-bottom: ${props => ((props.index + 1) / 7) <= 5 ? `1px solid #ddd` : `none`};
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
		top: -1px;
		left: -1px;
		width: calc(100% + 2px);
		height: calc(100% + 2px);
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
