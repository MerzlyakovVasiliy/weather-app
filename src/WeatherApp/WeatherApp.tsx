import { useState } from 'react'
import axios from 'axios'
import styled, { keyframes } from 'styled-components'
import ListCites from './ListCites.tsx'
import Granularity from './Granularity.tsx'
import SelectMetric from './SelectMetric.tsx'
import AddCity from './AddCity.tsx'
import Chart from './Chart.tsx'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

interface WeatherApiEntry {
	dt_txt: string
	main: {
		temp: number
		humidity: number
	}
	wind: {
		speed: number
	}
}

export interface City {
	city: string,
	color: string
}

interface WeatherEntry {
	dt_txt: string
	temp: number
	humidity: number
	wind_speed: number
	[key: string]: number | string
}

export type WeatherData = Record<string, WeatherEntry[]>

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

const WeatherChart = () => {
	const [cities, setCities] = useState<City[]>([])
	const [weatherData, setWeatherData] = useState<WeatherData>({})
	const [granularity, setGranularity] = useState('3h')
	const [selectedMetric, setSelectedMetric] = useState('temp')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [newCity, setNewCity] = useState('')
	const [highlightedCity, setHighlightedCity] = useState<string | null>(null)

	const fetchWeatherData = async (city: string) => {
		setLoading(true)

		try {
			const res = await axios.get(
				`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ru`
			)

			if (res.status !== 200) {
				throw new Error(res.data.message)
			}

			const formattedData: WeatherEntry[] = res.data.list.map(
				(item: WeatherApiEntry) => ({
					dt_txt: item.dt_txt,
					temp: item.main.temp,
					humidity: item.main.humidity,
					wind_speed: item.wind.speed,
				})
			)

			setCities([...cities, { city, color: getRandomHexColor()}])
			setNewCity('')
			setWeatherData(prev => ({ ...prev, [city]: formattedData }))
		} catch (error) {
			console.error('Ошибка при получении данных:', error)
			setError(`Ошибка загрузки данных для ${city}`)
		} finally {
			setLoading(false)
		}
	}

	const addCity = (e: React.FormEvent) => {
		e.preventDefault()

		if (!newCity) return
		setError('')

		if (cities.some(city => city.city === newCity)) {
			setError('Город уже добавлен')
			setHighlightedCity(newCity) // Устанавливаем город для мигания

			// Убираем мигание через 1.5 секунды
			setTimeout(() => setHighlightedCity(null), 1500)
			return
		}

		fetchWeatherData(newCity)
	}

	const removeCity = (city: string) => {
		setCities(cities.filter(c => c.city !== city))
		setWeatherData(prev => {
			const newData = { ...prev }
			delete newData[city]
			return newData
		})
	}

	return (
		<Container>
			{loading && (
				<LoadingOverlay>
					<LoadingSpinner />
					<LoadingText>Загрузка...</LoadingText>
				</LoadingOverlay>
			)}

			<Title className='text-xl font-bold mb-4'>Прогноз погоды на 5 дней</Title>

			<AddCity
				addCity={addCity}
				error={error}
				newCity={newCity}
				setNewCity={setNewCity}
			/>

			<Granularity granularity={granularity} setGranularity={setGranularity} />

			<SelectMetric
				setSelectedMetric={setSelectedMetric}
				selectedMetric={selectedMetric}
			/>

			<Chart
				cities={cities}
				selectedMetric={selectedMetric}
				granularity={granularity}
				weatherData={weatherData}
			/>

			<ListCites cities={cities} removeCity={removeCity} highlightedCity={highlightedCity}/>
		</Container>
	)
}

export default WeatherChart


// Стили с использованием styled-components
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Container = styled.div`
  padding: 16px;
  position: relative;
`

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-in-out;
`

const LoadingText = styled.p`
  font-size: 18px;
  color: white;
  margin-top: 10px;
`

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled.div`
	border: 4px solid rgba(255, 255, 255, 0.3);
	border-top: 4px solid #fff;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: ${spin} 1s linear infinite; /* Применяем анимацию spin */
`

