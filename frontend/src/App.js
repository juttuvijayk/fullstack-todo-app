import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all todos
  const fetchTodos = async () => {
    const response = await axios.get(API);
    setTodos(response.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async () => {
    if (!title.trim()) return;

    await axios.post(API, {
      title,
      description,
      completed: false,
    });

    setTitle("");
    setDescription("");
    fetchTodos();
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    await axios.put(`${API}/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTodos();
  };

  return (
  <div
    style={{
      padding: "20px",
      maxWidth: "600px",
      margin: "auto",
      fontFamily: "Arial",
    }}
  >
    <h2 style={{ textAlign: "center" }}>Todo Application</h2>
      <h2>Todo Application</h2>

      <div style={{ marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
  />

  <input
    type="text"
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
  />

  <button
    onClick={addTodo}
    style={{
      padding: "8px 12px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      cursor: "pointer",
    }}
  >
    Add Todo
  </button>
</div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginTop: "10px" }}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => toggleComplete(todo)}
            >
              {todo.title} - {todo.description}
            </span>
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;