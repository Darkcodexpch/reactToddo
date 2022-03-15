import React, { useState, useEffect } from 'react'
import { db } from '../src/FirebaseConfig';
import './styles/Todo.css'

export default function Todo() {
    const [text, setText] = useState('');
    const [todoData, setTodoData] = useState([]);
    const [todoEdit, setTodoEdit] = useState(-1);
    const [todoText, setTodoText] = useState('')

    // fetching datafrom firebase

    useEffect(() => {
        db.ref("data").child("tasks").on('value', (snapshot) => {
            let newdata = [];
            snapshot.forEach(data => {
                newdata.push({
                    id: data.key,
                    task: data.val()
                })
                setTodoData(newdata)
            })
        })
    }, [])

    const EditHandler = (id) => {
        db.ref("data").child(`tasks/${id}`).update({ text: todoText }).then(() => {
            alert("Data Updated")
            setTodoEdit(-1);

        })
    }

    const deleteHandler = (id) => {
        db.ref("data").child("tasks").child(id).remove()
        setTodoData(todoData.filter((elem, index)=>{ if (elem.id!=id) return elem }))

    }

    //add form data to firebase
    const formHandler = (e) => {
        e.preventDefault();
        if (text === '') {
            alert("Please enter Something first")
        }
        else {
            db.ref('data').child('tasks').push({ text }).then(() => {
                setText('')
            })

                .catch((error) => {
                    console.log(error)
                })
        }
        setText('')
    }
    return (
        <div className='Containerr' >
            <h1>To-Do List</h1>
            <form onSubmit={formHandler}>
                <div className='todo-header'>
                    <input type="text" className='todo-input' value={text} onChange={(e) => setText(e.target.value)} />
                    <button className='todo-add'>+</button>
                </div>
            </form>
            <div className='todo-list'>
                {todoData.map((data, index) => {
                    console.log(data)
                    if (data === "") {
                        <p>No Todo Added Yet</p>
                    }
                    else {
                        return (
                            <div key={index} className='todo-item'>
                                {index == todoEdit ?
                                    <>
                                        <div style={{ display: 'flex', gap: '1rem', width: '100%', alignItems: 'center' }} >
                                            <p>{index + 1}</p>
                                            <input className='todo-input' value={todoText} onChange={(e) => setTodoText(e.target.value)} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button onClick={() => EditHandler(data.id)}>Save</button>
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div style={{ display: 'flex', gap: '1rem' }} >
                                            <p>{index + 1}</p>
                                            <p>{data.task.text}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button onClick={() => { setTodoEdit(index); setTodoText(data.task.text) }}>Edit</button>
                                            <button onClick={() => deleteHandler(data.id)}>Delete</button>
                                        </div>
                                    </>}
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}
