import React from 'react'
import { nanoid } from 'nanoid';
import he from 'he'

export default function Question(props) {

    const buttons = props.answers.map(answer => <button className={props.right && answer.right ? 'button button-checked' : answer.selected ? 'button button-clicked' : 'button' } key={answer.id} onClick={() => props.toggleClick(props.id, answer.id, answer.text)}>{he.decode(answer.text)}</button>)

    return (
        <div className='questions'>
            <h4>{he.decode(props.textQuestion)}</h4>
            <div className='buttons'>{buttons}</div>
        </div>
    )
}