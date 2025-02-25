import {
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { City, WeatherData } from './WeatherApp'

type MergedData = {
	dt_txt: string
	[key: string]: number | string
}[]

interface WeatherEntry {
	dt_txt: string
	temp: number
	humidity: number
	wind_speed: number
	[key: string]: number | string
}

type TProps = {
	cities: City[]
	selectedMetric: string
	weatherData: WeatherData
	granularity: string
}

const Chart = ({
	cities,
	selectedMetric,
	weatherData,
	granularity,
}: TProps) => {
	const filteredData: Record<string, WeatherEntry[]> = {}

	Object.keys(weatherData).forEach(city => {
		if (granularity === '3h') {
			filteredData[city] = [...weatherData[city]]
		} else {
			filteredData[city] = [
				...weatherData[city].filter(item => item.dt_txt.endsWith('12:00:00')),
			]
		}
	})

	const mergedData: MergedData = Object.keys(filteredData).length
		? filteredData[cities[0].city].map((item, index) => {
				const mergedItem: MergedData[number] = { dt_txt: item.dt_txt }
				cities.forEach(city => {
					if (filteredData[city.city]?.[index]) {
						mergedItem[city.city] = filteredData[city.city][index][selectedMetric]
						mergedItem[`${city.city}_humidity`] = filteredData[city.city][index].humidity
						mergedItem[`${city.city}_wind_speed`] =
							filteredData[city.city][index].wind_speed
					}
				})
				return mergedItem
		  })
		: []

	return (
		<ResponsiveContainer width='100%' height={400}>
			<LineChart data={mergedData}>
				<XAxis
					dataKey='dt_txt'
					tick={props => <CustomTick {...props} granularity={granularity}/>}
					interval={0}
				/>
				<YAxis />
				<Tooltip content={<CustomTooltip />} />
				<Legend />
				strokeWidth={4}
				{cities.map(city => (
					<Line
						key={city.city}
						type='monotone'
						dataKey={city.city}
						stroke={city.color}
						strokeWidth={2}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	)
}

export default Chart

const CustomTick: React.FC<{
	x: number
	y: number
	payload: { value: string }
	granularity: '3h' | 'day'
}> = ({ x, y, payload, granularity }) => {
	const [date, time] = payload.value.split(' ')
	const isMidnight = time === '00:00:00'
	const [_year, month, day] = date.split('-') // Разбиваем дату

	return (
		<g transform={`translate(${x},${y}) rotate(-45)`}>
			<text textAnchor='end' fill='#666' fontSize={12}>
				{granularity === 'day' || isMidnight ? (
					<tspan fontWeight='bold' fontSize={14}>{`${day}.${month}`}</tspan>
				) : (
					<tspan>{time.slice(0, 5)}</tspan>
				)}
			</text>
		</g>
	)
}

const CustomTooltip: React.FC<{
	active?: boolean
	payload?: { dataKey: string; payload: Record<string, string> }[]
}> = ({ active, payload }) => {
	if (!active || !payload || !payload.length) return null

	return (
		<table>
			<thead>
				<tr>
					<th>Город</th>
					<th>🌡 Температура</th>
					<th>💧 Влажность</th>
					<th>💨 Ветер</th>
				</tr>
			</thead>
			<tbody>
				{payload.map(item => (
					<tr key={item.dataKey}>
						<td>{item.dataKey}</td>
						<td>{item.payload[item.dataKey]}°C</td>
						<td>{item.payload[`${item.dataKey}_humidity`]}%</td>
						<td>{item.payload[`${item.dataKey}_wind_speed`]}м/с</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}
