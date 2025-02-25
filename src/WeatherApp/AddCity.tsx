import styled from 'styled-components'

type TProps = {
	addCity: (e: React.FormEvent) => void
	newCity: string
	setNewCity: (city: string) => void
	error: string
}

const AddCity = ({ addCity, newCity, error, setNewCity }: TProps) => {
	return (
		<Wrapper>
			<Form onSubmit={addCity}>
				<Input
					type='text'
					value={newCity}
					onChange={e => setNewCity(e.target.value)}
					placeholder='Введите город'
				/>
				<Button type='submit'>Добавить</Button>
			</Form>
			<ErrorMessage>{error}</ErrorMessage>
		</Wrapper>
	)
}

export default AddCity

// Стили с styled-components

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
`

const Form = styled.form`
	display: flex;
	align-items: center;
	gap: 8px;
`

const Input = styled.input`
	padding: 8px;
	border: 2px solid #d1d5db;
	border-radius: 4px;
	outline: none;
	transition: border-color 0.2s ease;

	&:focus {
		border-color: #10b981;
	}
`

const Button = styled.button`
	background-color: #10b981;
	color: white;
	padding: 8px 12px;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background-color 0.2s ease, transform 0.2s ease;

	&:hover {
		background-color: #059669;
		transform: scale(1.05);
	}
`

const ErrorMessage = styled.p`
	color: #ef4444;
	font-size: 14px;
	min-height: 18px; /* Фиксируем высоту блока под ошибку */
	margin: 0;
`
