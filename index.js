const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// CRUD - Create, Read, Update, Delete

// CREATE - Add task (main entry point)
function addTask(taskText = null) {
  const newTask = taskText || input.value.trim();

  if (newTask === "") {
    alert("Please enter a task");
    return;
  }

  // create a new list item
  const li = document.createElement("li");

  // create a span to hold the task text
  const span = document.createElement("span");
  span.textContent = newTask;

  // Creating a checkbox element
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  checkbox.addEventListener("change", function () {
    span.style.textDecoration = checkbox.checked ? "line-through" : "none";
  });
  li.prepend(checkbox); // Add the checkbox at the beginning of the list item

  li.appendChild(span); // Add the text to the list item
  input.value = ""; // Clear the input field

  // 🔹 EDIT BUTTON
  // Creating the edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  // When clicked, allow the user to edit the task
  editBtn.addEventListener("click", function () {
    const updatedTask = prompt("Please edit the task", span.textContent);

    if (updatedTask !== null && updatedTask.trim() !== "") {
      span.textContent = updatedTask.trim();
      saveTasks(); // Save the updated task list to localStorage
    }
  });
  li.appendChild(editBtn); // Attach the edit button to the list item

  // 🔹 DELETE BUTTON
  // Creating the delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  // When clicked, remove the task from the list
  deleteBtn.addEventListener("click", function () {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (confirmDelete) {
      li.remove();
      updateTaskCount(); // Update the task count after deleting a task
      toggleEmptyMessage(); // Check if we need to show or hide the empty message
      saveTasks(); // Save the updated task list to localStorage
    }
  });
  li.appendChild(deleteBtn); // Attach the delete button to the list item
  list.appendChild(li);
  updateTaskCount(); // Update the task count after adding a new task
  toggleEmptyMessage(); // Check if we need to show or hide the empty message
  saveTasks(); // Save the updated task list to localStorage
}

addBtn.addEventListener("click", function () {
  addTask();
});
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function updateTaskCount() {
  const taskCount = list.children.length;
  document.getElementById("taskCount").textContent =
    `Total Tasks: ${taskCount}`;
}
toggleEmptyMessage(); // Initial check to show or hide the empty message

function toggleEmptyMessage() {
  const emptyMsg = document.getElementById("emptyMsg");

  if (list.children.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) => {
    addTask(task); // Add each saved task to the list
  });
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li span").forEach((span) => {
    tasks.push(span.textContent);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

input.value = "";

loadTasks();
