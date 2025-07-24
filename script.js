// ========== DOM ELEMENT REFERENCES ==========
// Grab key elements from the HTML to interact with the UI
const app = document.getElementById('app');
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const filters = document.querySelectorAll('.filters button');
const themeToggle = document.getElementById('themeToggle');
const deviceSelector = document.getElementById('deviceSelector');

// ========== APP STATE ==========
// Retrieve existing tasks from localStorage or start fresh
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';  // Default task filter

// ========== STORAGE HANDLING ==========
// Save the current task array to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ========== TASK RENDERING LOGIC ==========
// Display tasks in the UI based on current filter. Applies 'fadeIn' animation to each task element on load.
function renderTasks() {
  taskList.innerHTML = '';
  const visible = tasks.filter(task => filter === 'all' || task.status === filter);

  visible.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.status;
    li.style.animation = 'fadeIn 0.3s ease-in';

    li.innerHTML = `
      <div>${task.text}</div>
      <div class="task-meta">Added: ${task.timestamp}</div>
      <div class="btn-group">
        <button class="complete" title="Mark Completed">✔</button>
        <button class="cancel" title="Cancel Task">✘</button>
        <button class="delete" title="Delete Task">🗑</button>
      </div>
    `;

    const completeBtn = li.querySelector('.complete');
    const cancelBtn = li.querySelector('.cancel');
    const deleteBtn = li.querySelector('.delete');

    completeBtn.onclick = () => updateStatus(index, 'completed');
    cancelBtn.onclick = () => updateStatus(index, 'cancelled');
    deleteBtn.onclick = () => deleteTask(index);

    taskList.appendChild(li);
  });
}

// ========== TASK STATUS UPDATES ==========
// Change status to 'completed' or 'cancelled', then re-render
function updateStatus(index, status) {
  tasks[index].status = status;
  saveTasks();
  renderTasks();
}

// ========== TASK DELETION WITH ANIMATION ==========
// Applies 'fadeOut' animation before removing a task
function deleteTask(index) {
  taskList.children[index].style.animation = 'fadeOut 0.3s forwards';
  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 300);
}

// ========== ADD NEW TASK ==========
// Adds a new task with timestamp and default 'pending' status
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({
      text,
      status: 'pending',
      timestamp: new Date().toLocaleString()
    });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  }
}

// ========== EVENT LISTENERS: ADD TASK ==========
// Responds to button click or 'Enter' key press to add task
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// ========== FILTER BUTTON FUNCTIONALITY ==========
// Highlights active filter and triggers task re-render
filters.forEach(btn => {
  btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    renderTasks();
  });
});

// ========== THEME TOGGLE HANDLING ==========
// Switches between light and dark themes, updates icon accordingly
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

//  ========== DEVICE PREVIEW MODE SWITCHING ==========
// Switches layout mode based on screen type selected from dropdown
deviceSelector.addEventListener('change', e => {
  app.classList.remove('desktop', 'tablet', 'mobile');
  app.classList.add(e.target.value);
});

// ========== AUTO-DETECTION BASED ON SCREEN WIDTH ==========
// Dynamically sets layout mode (desktop, tablet, mobile) on window resize
function autoDetectScreenSize() {
  const width = window.innerWidth;
  let mode = 'desktop';

  if (width <= 480) {
    mode = 'mobile';
  } else if (width <= 768) {
    mode = 'tablet';
  }

  app.classList.remove('desktop', 'tablet', 'mobile');
  app.classList.add(mode);
  deviceSelector.value = mode;
}

window.addEventListener('resize', autoDetectScreenSize);
autoDetectScreenSize();

// ========== INITIAL RENDER ==========
// Display tasks when app loads
renderTasks();