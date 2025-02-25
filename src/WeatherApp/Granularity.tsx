import styled from 'styled-components'

type TProps = {
	granularity: string
	setGranularity: (gran: string) => void
}

const Granularity = ({ granularity, setGranularity }: TProps) => {
	return (
		<Container>
			<Button
				$active={granularity === '3h'}
				onClick={() => setGranularity('3h')}
			>
				3 часа
			</Button>
			<Button
				$active={granularity === 'day'}
				onClick={() => setGranularity('day')}
			>
				День
			</Button>
		</Container>
	)
}

export default Granularity

// Стили с использованием styled-components

const Container = styled.div`
	margin-bottom: 16px;
`

const Button = styled.button<{ $active: boolean }>`
	padding: 8px 16px;
	margin-right: 8px;
	background-color: ${({ $active }) => ($active ? '#3b82f6' : '#e5e7eb')};
	color: ${({ $active }) => ($active ? 'white' : 'black')};
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: ${({ $active }) => ($active ? '#2563eb' : '#d1d5db')};
	}
`
