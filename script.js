document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tasksCount = document.getElementById('tasks-count');
    const clearCompleted = document.getElementById('clear-completed');

    // Initialize todos from localStorage or empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // Update the tasks count
    function updateTasksCount() {
        const remainingTasks = todos.filter(todo => !todo.completed).length;
        tasksCount.textContent = `${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    }

    // Create a new todo item element
    function createTodoElement(todo) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.id = todo.id;

        todoItem.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        // Add event listeners
        const checkbox = todoItem.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => {
            todo.completed = checkbox.checked;
            todoItem.classList.toggle('completed', todo.completed);
            saveTodos();
            updateTasksCount();
        });

        const deleteBtn = todoItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todoItem.classList.add('removing');
            setTimeout(() => {
                todos = todos.filter(t => t.id !== todo.id);
                saveTodos();
                renderTodos();
            }, 300);
        });

        return todoItem;
    }

    // Render all todos
    function renderTodos() {
        todoList.innerHTML = '';
        if (todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    <p>No tasks yet! Add a task to get started.</p>
                </div>
            `;
        } else {
            todos.forEach(todo => {
                todoList.appendChild(createTodoElement(todo));
            });
        }
        updateTasksCount();
    }

    // Add new todo
    function addTodo(text) {
        const todoText = text.trim();
        if (todoText) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };
            todos.unshift(newTodo);
            saveTodos();
            renderTodos();
        }
    }

    // Event Listeners
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(todoInput.value);
        todoInput.value = '';
    });

    clearCompleted.addEventListener('click', () => {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos();
    });

    // Initial render
    renderTodos();
});