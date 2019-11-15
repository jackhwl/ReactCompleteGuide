import React from 'react'
import UserInput from './UserInput/UserInput'
import UserOutput from './UserOutput/UserOutput'
import Validation from './Validation/Validation'
import Char from './Char/Char'

const Assignment2 = (props) => {
    return (
        <div>
            {/* <ol>
                <li>Assignment 2</li>
                <li>Create an input field (in App component) with a change listener which outputs the length of the entered text below it (e.g. in a paragraph).</li>
                <li>Create a new component (=> ValidationComponent) which receives the text length as a prop</li>
                <li>Inside the ValidationComponent, either output "Text too short" or "Text long enough" depending on the text length (e.g. take 5 as a minimum length)</li>
                <li>Create another component (=> CharComponent) and style it as an inline box (=> display: inline-block, padding: 16px, text-align: center, margin: 16px, border: 1px solid black).</li>
                <li>Render a list of CharComponents where each CharComponent receives a different letter of the entered text (in the initial input field) as a prop.</li>
                <li>When you click a CharComponent, it should be removed from the entered text.</li>
                </ol>
                <p>Hint: Keep in mind that JavaScript strings are basically arrays!</p> */
            }
            <input type="text" onChange={props.changed} value={props.a2text} />
            <p></p>{props.a2text.length}
            <Validation length={props.a2text.length}></Validation>
            {
                props.a2text.split('').map((c, index) =>
                    <Char char={c} key={index} click={props.clicked}></Char>
                )
            }

            <UserInput nameChange={props.nameChange} username={props.username}></UserInput>
            <UserOutput username={props.username}></UserOutput>
            <UserOutput username={props.username}></UserOutput>
        </div>
    )
}

export default Assignment2
