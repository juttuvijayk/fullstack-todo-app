import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  AlertTriangle,
  Layers,
  Sparkles,
  ClipboardList
} from "lucide-react";

const API = "http://localhost:8080/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState("");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(API, {
        title,
        description,
        completed: false,
        priority,
        category,
        dueDate: dueDate || null
      });

      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("Work");
      setDueDate("");
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo", error);
    }
  };

  // Toggle complete
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${API}/${todo.id}`, {
        ...todo,
        completed: !todo.completed,
      });
      fetchTodos();
    } catch (error) {
      console.error("Error toggling completion", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo", error);
    }
  };

  // Calculate statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks locally based on controls
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = 
      statusFilter === "All" ||
      (statusFilter === "Completed" && todo.completed) ||
      (statusFilter === "Pending" && !todo.completed);
      
    const matchesPriority = 
      priorityFilter === "All" || 
      todo.priority === priorityFilter;
      
    const matchesCategory = 
      categoryFilter === "All" || 
      todo.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Check if a task is overdue
  const isOverdue = (todo) => {
    if (todo.completed || !todo.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(todo.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  return (
    <div className="app-container">
      {/* Background visual glowing meshes */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      
      <div className="main-card">
        {/* Header */}
        <header className="app-header">
          <div className="logo-section">
            <Sparkles className="icon-glow" size={28} />
            <h1>ZenFlow</h1>
          </div>
          <p className="subtitle">Zen Task Planner & Organizer</p>
        </header>

        {/* Stats Dashboard */}
        <section className="stats-dashboard">
          <div className="stat-box">
            <p className="stat-label">Progress</p>
            <div className="progress-ring-container">
              <span className="stat-value">{completionPercentage}%</span>
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="stat-box">
            <p className="stat-label">Total Tasks</p>
            <p className="stat-number">{totalTasks}</p>
          </div>
          <div className="stat-box">
            <p className="stat-label">Pending</p>
            <p className="stat-number text-highlight">{pendingTasks}</p>
          </div>
        </section>

        {/* Add Todo Form */}
        <section className="form-section">
          <h3><ClipboardList size={18} className="section-icon" /> Create Task</h3>
          <form onSubmit={addTodo} className="task-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="input-text"
              />
            </div>
            
            <div className="input-group">
              <textarea
                placeholder="Task description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="input-textarea"
              />
            </div>

            <div className="form-row">
              <div className="select-container">
                <label>Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="select-control"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="select-container">
                <label>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="select-control"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="select-container">
                <label>Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="date-control"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              <Plus size={18} /> Add Task
            </button>
          </form>
        </section>

        {/* Filters and Search */}
        <section className="filter-section">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <button 
                onClick={() => setStatusFilter("All")}
                className={`filter-btn ${statusFilter === "All" ? "active" : ""}`}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter("Pending")}
                className={`filter-btn ${statusFilter === "Pending" ? "active" : ""}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setStatusFilter("Completed")}
                className={`filter-btn ${statusFilter === "Completed" ? "active" : ""}`}
              >
                Done
              </button>
            </div>

            <div className="select-filters">
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All Categories</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Todo List */}
        <section className="list-section">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <Layers size={40} className="empty-icon" />
              <p>No tasks found match your filters.</p>
            </div>
          ) : (
            <ul className="todo-list">
              {filteredTodos.map((todo) => (
                <li 
                  key={todo.id} 
                  className={`todo-item priority-${todo.priority} ${todo.completed ? "completed" : ""}`}
                >
                  <button 
                    onClick={() => toggleComplete(todo)} 
                    className="btn-checkbox"
                    title={todo.completed ? "Mark Incomplete" : "Mark Complete"}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="check-icon active" size={22} />
                    ) : (
                      <Circle className="check-icon" size={22} />
                    )}
                  </button>

                  <div className="todo-content">
                    <h4 className="todo-title">{todo.title}</h4>
                    {todo.description && (
                      <p className="todo-desc">{todo.description}</p>
                    )}
                    
                    <div className="todo-meta">
                      <span className="meta-tag category-tag">
                        <Tag size={12} /> {todo.category}
                      </span>
                      
                      <span className={`meta-tag priority-tag priority-${todo.priority}`}>
                        {todo.priority.toUpperCase()}
                      </span>

                      {todo.dueDate && (
                        <span className={`meta-tag date-tag ${isOverdue(todo) ? "overdue" : ""}`}>
                          <Calendar size={12} /> 
                          {todo.dueDate} 
                          {isOverdue(todo) && (
                            <span className="overdue-warning">
                              <AlertTriangle size={12} /> Overdue
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => deleteTodo(todo.id)} 
                    className="btn-delete"
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;