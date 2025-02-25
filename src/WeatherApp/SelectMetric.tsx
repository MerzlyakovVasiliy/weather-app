import styled from 'styled-components'

type TProps = {
	selectedMetric: string
	setSelectedMetric: (metric: string) => void
}

const SelectMetric = ({ selectedMetric, setSelectedMetric }: TProps) => {
	return (
		<Container>
			<Button
				$active={selectedMetric === 'temp'}
				color='#facc15'
				onClick={() => setSelectedMetric('temp')}
			>
				Температура
			</Button>
			<Button
				$active={selectedMetric === 'humidity'}
				color='#3b82f6'
				onClick={() => setSelectedMetric('humidity')}
			>
				Влажность
			</Button>
			<Button
				$active={selectedMetric === 'wind_speed'}
				color='#10b981'
				onClick={() => setSelectedMetric('wind_speed')}
			>
				Ветер
			</Button>
		</Container>
	)
}

export default SelectMetric

// Стили с styled-components

const Container = styled.div`
	margin-bottom: 16px;
`

const Button = styled.button<{ $active: boolean; color: string }>`
	padding: 8px 16px;
	margin-right: 8px;
	background-color: ${({ $active, color }) => ($active ? color : '#e5e7eb')};
	color: ${({ $active }) => ($active ? 'white' : 'black')};
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s ease, transform 0.1s ease-in-out;

	&:hover {
		background-color: ${({ $active, color }) => ($active ? color : '#d1d5db')};
		transform: scale(1.05);
	}
`
