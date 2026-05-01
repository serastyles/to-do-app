const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMsg = document.getElementById("emptyMsg");
const fetchDataBtn = document.getElementById("fetchData");
const clearAllBtn = document.getElementById("clearAllBtn");

// CRUD - Create, Read, Update, Delete

// CREATE - Add task (main entry point)

let draggedItem = null; // Variable to hold the currently dragged item
function addTask(taskText = null, isCompleted = false) {
  const newTask = taskText !== null ? taskText : input.value.trim();

  if (newTask === "") {
    //alert if the input is empty
    if (taskText === null) {
      alert("Please enter a task");
    }
    return;
  }

  // create a new list item
  const li = document.createElement("li");
  li.draggable = true; // Make the list item draggable
  li.addEventListener("dragstart", function () {
    draggedItem = li; // Set the dragged item to the current list item when dragging starts
    li.style.opacity = "0.5"; // Reduce opacity to indicate dragging
  });

  li.addEventListener("dragend", function () {
    draggedItem = null; // Clear the dragged item when dragging ends
    li.style.opacity = "1"; // Reset opacity after dragging ends
  });

  li.addEventListener("dragover", function (event) {
    event.preventDefault(); // Allow dropping by preventing default behavior
  });
  li.addEventListener("drop", function (event) {
    event.preventDefault();

    if (draggedItem === li) return;

    const rect = li.getBoundingClientRect();
    const offset = event.clientY - rect.top;

    if (offset > rect.height / 2) {
      list.insertBefore(draggedItem, li.nextSibling); // Insert the dragged item before the current item if dropped in the upper half
    } else {
      list.insertBefore(draggedItem, li); // Insert the dragged item before the current item to move it down if dropped in the lower half
    }
    saveTasks(); // Insert the dragged item after the current item if dropped in the lower half
  });

  // create a span to hold the task text
  const span = document.createElement("span");
  span.textContent = newTask;

  // Creating a checkbox element
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted; // Set the checkbox state based on the task's completion status
  if (isCompleted) {
    span.style.textDecoration = "line-through"; // If the task is completed, strike through the text
    li.style.backgroundColor = "#f0e2ec";
  }

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      span.style.textDecoration = "line-through"; // If the checkbox is checked, strike through the text
      li.style.backgroundColor = "#b5dedf"; // Change background color to indicate completion
    } else {
      span.style.textDecoration = "none"; // If the checkbox is unchecked, remove the strike-through
      li.style.backgroundColor = ""; // Reset background color
    }

    saveTasks(); // Save the updated task list to localStorage whenever a task is marked as completed or uncompleted
  });
  li.prepend(checkbox); // Add the checkbox at the beginning of the list item

  li.appendChild(span); // Add the text to the list item
  input.value = ""; // Clear the input field

  //  EDIT BUTTON
  // Creating the edit button
  const editBtn = document.createElement("button");
  editBtn.innerHTML = '<i class="fas fa-solid fa-pen"></i>'; // Use Font Awesome icon for edit button
  editBtn.classList.add("edit-btn"); // Add a class for styling the edit button

  // When clicked, allow the user to edit the task
  editBtn.addEventListener("click", function () {
    const updatedTask = prompt("Please edit the task", span.textContent);

    if (updatedTask !== null && updatedTask.trim() !== "") {
      span.textContent = updatedTask.trim();
      saveTasks(); // Save the updated task list to localStorage
    }
  });
  li.appendChild(editBtn); // Attach the edit button to the list item

  //  DELETE BUTTON
  // Creating the delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-solid fa-trash"></i>'; // Use Font Awesome icon for delete button
  deleteBtn.classList.add("deleteBtn"); // Add a class for styling the delete button

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

  // REORDER BUTTONS
  // Creating the move up button
  const upBtn = document.createElement("button");
  upBtn.textContent = "↑"; // Use an arrow symbol for the move up button

  upBtn.onclick = function () {
    const prevLi = li.previousElementSibling;
    if (prevLi) {
      list.insertBefore(li, prevLi);
      saveTasks(); // Save the updated task list to localStorage after reordering
    }
  };

  const downBtn = document.createElement("button");
  downBtn.textContent = "↓"; // Use an arrow symbol for the move down button
  downBtn.onclick = function () {
    const nextLi = li.nextElementSibling;
    if (nextLi) {
      list.insertBefore(nextLi, li);
      saveTasks(); // Save the updated task list to localStorage after reordering
    }
  };

  li.appendChild(upBtn);
  li.appendChild(downBtn);

  list.appendChild(li);

  updateUI(); // Update the UI after adding a new task
  saveTasks(); // Save the updated task list to localStorage
}

// UI HELPERS
function updateTaskCount() {
  taskCount.textContent = `Total Tasks: ${list.children.length}`;
}

function toggleEmptyMessage() {
  emptyMsg.style.display = list.children.length === 0 ? "block" : "none";
}

function updateUI() {
  updateTaskCount(); // Update the task count
  toggleEmptyMessage(); // Check if we need to show or hide the empty message
  clearAllBtn.disabled = list.children.length === 0; // Enable or disable the clear all button based on the number of tasks
}

addBtn.addEventListener("click", function () {
  addTask();
});
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

  savedTasks.forEach((task) => {
    addTask(task.text, task.completed); // Add each saved task to the list
  });
}

function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#taskList li").forEach((li) => {
    const text = li.querySelector("span").textContent;
    const completed = li.querySelector("input[type='checkbox']").checked;
    tasks.push({ text, completed });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

input.value = "";

loadTasks();

// FETCH EXTERNAL DATA
// Fetch external data from a fake API and add it to the task list
fetchDataBtn.addEventListener("click", () => {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then((response) => response.json())
    .then((todos) => {
      // Add each fetched todo to the existing task list
      todos.forEach((todo) => {
        addTask(todo.title, todo.completed);
      });

      saveTasks(); // Save the updated task list to localStorage
    });
});

clearAllBtn.addEventListener("click", function () {
  const confirmClear = confirm("Are you sure you want to clear all tasks?");
  if (confirmClear) {
    list.innerHTML = ""; //remove all tasks from UI
    localStorage.setItem("tasks", JSON.stringify([])); // clear storage

    updateTaskCount();
    toggleEmptyMessage();
  }
});
function updateClearButton() {
  clearAllBtn.disabled = list.children.length === 0;
}
updateClearButton(); // Initial check to enable or disable the clear button

// Update the clear button state whenever tasks are added or removed
const observer = new MutationObserver(updateClearButton);
observer.observe(list, { childList: true });
