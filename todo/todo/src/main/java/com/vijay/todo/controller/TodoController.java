package com.vijay.todo.controller;

import com.vijay.todo.entity.Todo;
import com.vijay.todo.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TodoController {

    private final TodoService service;

    public TodoController(TodoService service) {
        this.service = service;
    }

    // Create Todo
    @PostMapping
    public ResponseEntity<Todo> create(@Valid @RequestBody Todo todo) {
        return ResponseEntity.ok(service.createTodo(todo));
    }

    // Get All Todos (Optional filter)
    @GetMapping
    public ResponseEntity<List<Todo>> getAll(
            @RequestParam(required = false) Boolean completed) {
        return ResponseEntity.ok(service.getAllTodos(completed));
    }

    // Update Todo
    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(
            @PathVariable Long id,
            @RequestBody Todo todo) {
        return ResponseEntity.ok(service.updateTodo(id, todo));
    }

    // Delete Todo
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}