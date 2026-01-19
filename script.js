let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const filterButtons = document.querySelectorAll(".filters button");

addBtn.onclick = addTask;
taskInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";
    saveAndRender();
}

function renderTasks() {
    taskList.innerHTML = "";

    const filtered = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("completed");

        const span = document.createElement("span");
        span.textContent = task.text;
        span.className = "task-text";
        span.onclick = () => toggleTask(task.id);

        const actions = document.createElement("div");
        actions.className = "actions";

        const edit = document.createElement("button");
        edit.innerHTML = "✏️";
        edit.className = "edit";
        edit.onclick = () => editTask(task.id);

        const del = document.createElement("button");
        del.innerHTML = "🗑️";
        del.className = "delete";
        del.onclick = () => deleteTask(task.id);

        actions.append(edit, del);
        li.append(span, actions);
        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveAndRender();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const updated = prompt("Edit task:", task.text);
    if (updated && updated.trim()) {
        task.text = updated.trim();
        saveAndRender();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

filterButtons.forEach(btn => {
    btn.onclick = () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filter = btn.dataset.filter;
        renderTasks();
    };
});

renderTasks();
