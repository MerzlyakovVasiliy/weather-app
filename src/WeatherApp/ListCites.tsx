import styled, { css, keyframes } from 'styled-components'
import { City } from './WeatherApp'

type TProps = {
	cities: City[]
	removeCity: (city: string) => void
	highlightedCity: string | null
}

const ListCites = ({ cities, removeCity, highlightedCity }: TProps) => {
	return (
		<List>
			{cities.map(city => (
				<ListItem key={city.city} $isHighlighted={city.city === highlightedCity}>
					{city.city}
					<RemoveButton onClick={() => removeCity(city.city)}>✖</RemoveButton>
				</ListItem>
			))}
		</List>
	)
}

export default ListCites

const List = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
`

const blink = keyframes`
	0%, 100% { background-color: #f3f4f6; }
	50% { background-color: #34d399; }
`

const ListItem = styled.li<{ $isHighlighted: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 12px;
	background-color: ${({ $isHighlighted }) =>
		$isHighlighted ? '#34d399' : '#d1d5db'};
	border-radius: 4px;
	margin-bottom: 8px;
	transition: background-color 0.3s ease;

	${({ $isHighlighted }) =>
		$isHighlighted &&
		css`
			animation: ${blink} 1.5s ease-in-out 3;
		`}

	&:hover {
		background-color: #8b949e;
	}
`

const RemoveButton = styled.button`
	background: none;
	border: none;
	color: #ef4444;
	font-size: 16px;
	cursor: pointer;
	transition: transform 0.2s ease, color 0.2s ease;

	&:hover {
		color: #dc2626;
		transform: scale(1.2);
	}
`
