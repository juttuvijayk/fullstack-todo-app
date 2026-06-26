package com.vijay.todo.service;

import com.vijay.todo.entity.Todo;
import com.vijay.todo.repository.TodoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    private final TodoRepository repository;

    public TodoService(TodoRepository repository) {
        this.repository = repository;
    }

    // Create Todo
    public Todo createTodo(Todo todo) {
        return repository.save(todo);
    }

    // Get All Todos
    public List<Todo> getAllTodos(Boolean completed) {
        if (completed != null) {
            return repository.findByCompleted(completed);
        }
        return repository.findAll();
    }

    // Update Todo
    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        existing.setTitle(updatedTodo.getTitle());
        existing.setDescription(updatedTodo.getDescription());
        existing.setCompleted(updatedTodo.isCompleted());
        existing.setPriority(updatedTodo.getPriority());
        existing.setCategory(updatedTodo.getCategory());
        existing.setDueDate(updatedTodo.getDueDate());

        return repository.save(existing);
    }

    // Delete Todo
    public void deleteTodo(Long id) {
        repository.deleteById(id);
    }
}