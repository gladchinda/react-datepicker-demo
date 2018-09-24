import styled from 'styled-components';

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, 1fr);
`;

export const CalendarCell = styled.div`
	text-align: center;
	align-self: center;
	letter-spacing: 0.1rem;
  grid-column: ${props => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
	font-weight: 900;
	font-size: 1rem;
	padding: 20px 10px;
	color: #06c;
	border-top: 1px solid #ddd;
`;

export const CalendarDate = styled(CalendarCell)`
	font-weight: 300;
	font-size: 2.5rem;
	padding: 25px 10px;
	cursor: pointer;
	border-bottom: 1px solid #ddd;
	border-top: ${props => Math.floor(props.index / 7) === 0 ? `1px solid #ddd` : `none`};
	border-right: ${props => (props.index % 7) + 1 === 7 ? `none` : `1px solid #ddd`};
	color: ${props => props.inMonth ? `#000` : `#CCC`};
  grid-row: ${props => Math.floor(props.index / 7) + 2} / span 1;
`;

export const HighlightedCalendarDate = styled(CalendarDate)`
	color: #fff;
	background: #06c;
	border: 2px solid #06c;
	position: relative;
	top: -1px;
	left: -1px;
`;

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
	color: #06c;
	background: transparent;
	::after {
		content: '';
		position: absolute;
		right: 0;
		bottom: 0;
		border-bottom: 1.5rem solid #06c;
		border-left: 1.5rem solid transparent;
		border-top: 1.5rem solid transparent;
	}
`;
