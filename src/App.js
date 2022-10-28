import React, { useState, useEffect } from 'react'
import { nanoid } from 'nanoid';
import 'App.css'
import Question from './components/Question'


export default function App() {
    const [arrayQuestions, setArrayQuestions] = useState([])
    const [quizChecked, setQuizChecked] = useState({right: false, score: 0})
    const [startMenu, setStartMenu] = useState(true)
    const [difficulty, setDifficulty] = useState('any')
    const [error, setError] = useState('')

    useEffect(() => {

        const url = () => difficulty === 'any' ? 'https://opentdb.com/api.php?amount=5&type=multiple' : `https://opentdb.com/api.php?amount=5&difficulty=${difficulty}&type=multiple`

        if(quizChecked.right === false){
            fetch(url()).then(response => {
                if(!response.ok){
                    throw Error('Could not fetch the data for that resource')
                }
                return response.json()
            }).then(data => setArrayQuestions(createArrayDomande(data)))
            .catch((error) => setError(error.message))
        }  

    }, [quizChecked.right, difficulty])

    function createArrayDomande(data) {

        let returnArray = []

        for(let i = 0; i < data.results.length; i++){

            let arrayAnswersText = data.results[i].incorrect_answers
            arrayAnswersText.splice(Math.floor(Math.random() * 4), 0, data.results[i].correct_answer)
                
            let arrayAnswers = []

            for(let j = 0; j < arrayAnswersText.length; j++) {
                arrayAnswers.push(
                    {
                        id: j,
                        text: arrayAnswersText[j],
                        right: arrayAnswersText[j] === data.results[i].correct_answer ? true : false,
                        selected: false
                    }
                )
            }

            returnArray.push({
                id: i,
                textQuestion: data.results[i].question,
                answers: arrayAnswers
            })
        }

        return returnArray
    }

    function toggleClicked(questionId, answersId) {

        if(!quizChecked.right){
            setArrayQuestions(prevArray => prevArray.map(prevQuestion => {

                if(prevQuestion.id === questionId) {

                    const newAnswers = prevQuestion.answers.map(answer => answer.id === answersId ? {...answer, selected: true} : {...answer, selected: false})
                    return {...prevQuestion, answers: newAnswers} 

                }else {
                    return prevQuestion
                }

            }))
        }

    }

    function toggleQuiz() {

        if(quizChecked.right) {
            setQuizChecked({right: false, score: 0})
            setArrayQuestions([])
        } else {

            let counter = 0;

            arrayQuestions.forEach(question => {
                question.answers.forEach(answer => {
                    if(answer.selected && answer.right){
                        counter++
                    }
                });
            })

            setQuizChecked({right: true, score: counter})
        }

    }

    function changeDifficulty(select) {

        setDifficulty(select.target.value)

    }

    const questionArray = arrayQuestions.map(question => <Question key={question.id} id={question.id} textQuestion={question.textQuestion} answers={question.answers} right={quizChecked.right} toggleClick={toggleClicked}/>)

    return (
        <div className='quizContainer'>
            {startMenu ? 
                <div className='startMenu'>
                    <h1>Trivia Quiz</h1>
                    <p>Select the difficulty</p>
                    <select name="difficulty" id="difficulty" value={difficulty} onChange={changeDifficulty}>
                        <option value="any">Any difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <button className='quizButton' onClick={() => setStartMenu(false)}>Start quiz!</button>
                </div>
            :
            arrayQuestions.length ? 
                <div>
                    {questionArray}
                    <div className='bottomContainer'>
                        {quizChecked.right ?
                        <div className='scoreContainer'><h4>{`You scored: ${quizChecked.score}/5`}</h4><button className='quizButton' onClick={toggleQuiz}>Play again</button></div> 
                        :
                        <button className='quizButton' onClick={toggleQuiz}>Check answers</button>}
                    </div>
                </div>
                : 
                error ? <p>{error}</p> : <h2>Loading...</h2> 
                }
        </div>
    )
}