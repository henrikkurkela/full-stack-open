import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Headline = ({ headline }) => {
	return <h1>{headline}</h1>
}

const Button = ({ text, eventHandler }) => {
	return <button onClick={eventHandler}>{text}</button>
}

const Statistics = ({ good, neutral, bad }) => {
	if (good + neutral + bad > 0) {
		return <table>
			<tbody>
				<StatisticLine text="good" value={good} />
				<StatisticLine text="neutral" value={neutral} />
				<StatisticLine text="bad" value={bad} />
				<StatisticLine text="all" value={good + neutral + bad} />
				<StatisticLine text="average" value={(good - bad) / (good + neutral + bad)} />
				<StatisticLine text="positive" value={(100 * good) / (good + neutral + bad) + " %"} />
			</tbody>
		</table>
	} else return <p>No feedback given</p>
}

const StatisticLine = ({text, value}) => {
	return <tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
}

const App = () => {
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<div>
			<Headline headline={"Give feedback"} />
			<Button text={"good"} eventHandler={() => setGood(good + 1)} />
			<Button text={"neutral"} eventHandler={() => setNeutral(neutral + 1)} />
			<Button text={"bad"} eventHandler={() => setBad(bad + 1)} />
			<Headline headline={"statistics"} />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

ReactDOM.render(<App />,
	document.getElementById('root')
)