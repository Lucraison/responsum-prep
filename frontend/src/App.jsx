import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');


  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  const addTodo = () => {
    if(!input.trim()) return; // Prevent adding empty todos

    fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input, completed: false })
    })
      .then(response => response.json())
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setInput('');  // ✅ Clear the input
      })
      .catch(error => console.error('Error adding todo:', error));
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/api/todos/${id}`, { 
      method: 'DELETE' })
      .then(() => setTodos(prev => prev.filter(todo => todo._id !== id)))
      .catch(error => console.error('Error deleting todo:', error));
  }

  const updateTodo = (id, updatedData) => {
    fetch(`http://localhost:5000/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then(response => response.json())
      .then(updatedTodo => {
        setTodos(prev => prev.map(todo => todo._id === id ? updatedTodo : todo));
      })
      .catch(error => console.error('Error updating todo:', error));
  }

  return (
    <div className="card">
      <h1>My Todos</h1>
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button className="btn-add" onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <span className={todo.completed ? 'completed' : ''}>
              {todo.title}
            </span>
            <button
              className={todo.completed ? 'btn-incomplete' : 'btn-complete'}
              onClick={() => updateTodo(todo._id, { completed: !todo.completed })}
            >
              {todo.completed ? 'Undo' : 'Done'}
            </button>
            <button className="btn-delete" onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
