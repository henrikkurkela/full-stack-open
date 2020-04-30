import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({text, eventHandler}) => {
	return <button onClick={eventHandler}>{text}</button>
}

const Anecdote = ({text, score}) => {
	return <p>
		{text} <br />
		has {score} votes
	</p>
}

const Headline = ({text}) => {
	return <h1>{text}</h1>
}

const App = (props) => {
	const [selected, setSelected] = useState(0)
	const [votes, setVotes] = useState(new Array(props.anecdotes.length).fill(0))
	
	return (
		<div>
			<Headline text="Anecdote of the day" />
			<Anecdote text={anecdotes[selected]} score={votes[selected]} />
			<Button text="vote" eventHandler={() => {
				const copy = [...votes]
				copy[selected] += 1
				setVotes(copy)
			}} />
			<Button text="next anecdote" eventHandler={() => {
				const random = Math.floor(Math.random() * props.anecdotes.length)
				setSelected(random)
			}}/>
			<Headline text="Anecdote with most votes" />
			<Anecdote text={anecdotes[votes.indexOf(Math.max(...votes))]} score={votes[votes.indexOf(Math.max(...votes))]} />
		</div>
	)
}

const anecdotes = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
	<App anecdotes={anecdotes} />,
	document.getElementById('root')
)