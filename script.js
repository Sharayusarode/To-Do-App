let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const numbers = document.getElementById("numbers");

taskForm.addEventListener("submit", e => {
    e.preventDefault();
    addTask();
});

function addTask() {
    if (taskInput.value.trim() === "") return;

    tasks.push({
        text: taskInput.value,
        date: dateInput.value,
        completed: false
    });

    taskInput.value = "";
    dateInput.value = "";
    save();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    save();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    save();
}

function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText) tasks[index].text = newText;
    save();
}

function setFilter(value) {
    filter = value;
    render();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    save();
}

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    render();
}

function render() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        li.innerHTML = `
            <div class="task-info" onclick="toggleTask(${index})">
                ${task.text}
                <div class="task-date">${task.date || ""}</div>
            </div>
            <div class="task-actions">
                <button onclick="toggleTask(${index})">✔</button>
                <button onclick="editTask(${index})">✏️</button>
                <button onclick="deleteTask(${index})">🗑️</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function updateStats() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    numbers.innerText = `${completed}/${total}`;
    progress.style.width = total ? (completed / total) * 100 + "%" : "0%";
}

render();