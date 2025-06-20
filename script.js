// DOM Elements
const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTask');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Save tasks to localStorage
const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Render tasks
const renderTasks = (filteredTasks = tasks) => {
    todoList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <div class="todo-content">
                <div class="todo-text">${task.text}</div>
                <div class="todo-category">${task.category}</div>
            </div>
            <span class="todo-priority priority-${task.priority}">${task.priority}</span>
            <div class="todo-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Checkbox event
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(index));

        // Edit button event
        const editBtn = taskElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editTask(index));

        // Delete button event
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(index));

        todoList.appendChild(taskElement);
    });
};

// Add new task
const addTask = () => {
    const text = taskInput.value.trim();
    if (text) {
        const task = {
            text,
            category: categorySelect.value,
            priority: prioritySelect.value,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
};

// Toggle task completion
const toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

// Edit task
const editTask = (index) => {
    const task = tasks[index];
    const newText = prompt('Edit task:', task.text);
    if (newText !== null) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
};

// Delete task
const deleteTask = (index) => {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }
};

// Filter tasks
const filterTasks = (filter) => {
    let filteredTasks;
    switch (filter) {
        case 'active':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        default:
            filteredTasks = tasks;
    }
    renderTasks(filteredTasks);
};

// Event Listeners
addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterTasks(btn.dataset.filter);
    });
});

// Initial render
renderTasks(); 