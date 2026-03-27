let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const task = document.querySelectorAll(".task");
const columns = [todo, progress, done];

let dragElement = null;

function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
        <div class="task-content">
          <h2>${title}</h2>
          <p>${desc}</p>
        </div>
        <div class="task-actions">
          <button class="move-btn">Move</button>
          <button class="delete-btn">Delete</button>
        </div>
    `;

  column.appendChild(div);

  const moveBtn = div.querySelector(".move-btn");
  const deleteBtn = div.querySelector(".delete-btn");

  moveBtn.addEventListener("click", () => {
    const currentColumnId = div.parentElement.id;
    let nextColumn;

    if (currentColumnId === "todo") {
      nextColumn = progress;
    } else if (currentColumnId === "progress") {
      nextColumn = done;
    } else {
      nextColumn = todo;
    }

    nextColumn.appendChild(div);
    taskUpdateCount();
  });

  deleteBtn.addEventListener("click", () => {
    div.remove();
    taskUpdateCount();
  });

  div.addEventListener("dragstart", (e) => {
    dragElement = div;
    div.classList.add("dragging");
  });

  div.addEventListener("dragend", () => {
    dragElement = null;
    div.classList.remove("dragging");
  });

  return div;
}

function taskUpdateCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const countDisplay = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((task) => {
      return {
        title: task.querySelector("h2").textContent,
        description: task.querySelector("p").textContent,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(tasksData));
    countDisplay.textContent = tasks.length;
  });
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
      addTask(task.title, task.description, column);
    });

    taskUpdateCount();
  }
}


function addDragEvent(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    // console.log("droped", dragElement, column);

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    taskUpdateCount();
  });
}

addDragEvent(todo);
addDragEvent(progress);
addDragEvent(done);

const toggleModal = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");

const modalBg = document.querySelector(".bg");

const addtaskBtn = document.querySelector("#add-new-task");

toggleModal.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addtaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDescription = document.querySelector("#task-desc-input").value;

  addTask(taskTitle, taskDescription, todo);

  taskUpdateCount();
  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});

// THEME TOGGLE
const themeToggle = document.querySelector("#theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌞";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeToggle.textContent = "🌞";
    localStorage.setItem("theme", "light");
  } else {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
});
