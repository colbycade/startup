async function displayUserInfo() {
    try {
        const userResponse = await fetch('/api/user');
        const userInfo = await userResponse.json();

        const usernameEl = document.getElementById("usernameDisplay");
        usernameEl.textContent = userInfo.username || "Unknown";

        const familyCodeEl = document.getElementById("familyCodeDisplay");
        familyCodeEl.textContent = userInfo.familyCode || "Unknown";
    } catch (error) {
        console.error('Error fetching user information:', error);
    }
}

// Save profile picture
async function saveProfilePic(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = async function (e) {
            const base64Image = e.target.result.split(',')[1];

            try {
                const response = await fetch('/api/user/profile-pic', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ profilePic: base64Image })
                });

                if (response.ok) {
                    displayProfilePic();
                } else {
                    console.error('Error saving profile picture:', response.statusText);
                }
            } catch (error) {
                console.error('Error saving profile picture:', error);
            }
        };

        reader.readAsDataURL(file);
    }
}

// Display profile picture or generic profile picture if not found
async function displayProfilePic() {
    try {
        const response = await fetch('/api/user/profile-pic');

        if (response.ok) {
            const data = await response.json();
            const profilePicEl = document.getElementById('profilePic');
            profilePicEl.src = data.profilePic ? `data:image/jpeg;base64,${data.profilePic}` : 'assets/generic_profile.jpeg';
        } else if (response.status === 404) {
            const profilePicEl = document.getElementById('profilePic');
            profilePicEl.src = 'assets/generic_profile.jpeg';
        } else {
            console.error('Error fetching profile picture:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}

// Run when the page loads
window.onload = async () => {
    await displayUserInfo();
    await displayProfilePic();
    await initializeTaskLists();
};

document.getElementById('profilePicInput').addEventListener('change', saveProfilePic);

// TASK LIST

async function initializeTaskLists() {
    try {
        const familyCodeResponse = await fetch('/api/family/family-code');
        const { familyCode } = await familyCodeResponse.json();

        const response = await fetch(`/api/tasks/${familyCode}`);
        const familyTaskLists = await response.json();

        const dropdownEl = document.getElementById('task-list-dropdown');
        dropdownEl.innerHTML = '';

        for (const member in familyTaskLists) {
            dropdownEl.innerHTML += `<option value="${member}">${member}'s To-Do List</option>`;
        }

        await loadSelectedTaskList(); // Load default family list
        document.getElementById('task-list-dropdown') // Listen for new selection
            .addEventListener('change', loadSelectedTaskList);
    } catch (error) {
        console.error('Error fetching task lists:', error);
    }
}

async function loadSelectedTaskList() {
    const selectedList = document.getElementById('task-list-dropdown').value;
    const tbody = document.getElementById('task-list-data');
    tbody.innerHTML = ''; // Clear existing rows

    try {
        const familyCodeResponse = await fetch('/api/family/family-code');
        const { familyCode } = await familyCodeResponse.json();

        const response = await fetch(`/api/tasks/${familyCode}/${selectedList}`);
        const taskList = await response.json();

        taskList.forEach((task, index) => {
            const newRow = tbody.insertRow();

            if (task.completed) {
                newRow.classList.add('completed-task');
            }

            const completeTaskCell = newRow.insertCell(0);
            completeTaskCell.innerHTML = `<span class="checkbox ${task.completed ? 'completed' : ''}" 
        onclick="toggleTaskCompletion('${selectedList}', ${index}, this)"></span>`;

            const taskCell = newRow.insertCell(1);
            taskCell.textContent = task.name;

            const dateCell = newRow.insertCell(2);
            dateCell.textContent = task.dueDate;

            const addToCalendarCell = newRow.insertCell(3);
            addToCalendarCell.className = 'add-to-calendar';
            addToCalendarCell.innerHTML = '<button>Add to Calendar</button>';

            const removeTaskCell = newRow.insertCell(4);
            removeTaskCell.className = 'remove-task';
            removeTaskCell.innerHTML = `<button onclick="removeTask(this, '${selectedList}', ${index})">Remove</button>`;
        });

        const tableBody = document.getElementById('task-list-data');
        const isAscending = tableBody.getAttribute('data-sort-ascending') === 'true';
        tableBody.setAttribute('data-sort-ascending', !isAscending);
        sortByDate();
    } catch (error) {
        console.error('Error fetching task list:', error);
    }
}

async function toggleTaskCompletion(listName, taskIndex, checkBoxEl) {
    try {
        const familyCodeResponse = await fetch('/api/family/family-code');
        const { familyCode } = await familyCodeResponse.json();

        const response = await fetch(`/api/tasks/${familyCode}/${listName}`);
        const tasks = await response.json();

        tasks[taskIndex].completed = !tasks[taskIndex].completed;

        await fetch(`/api/tasks/${familyCode}/${listName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasks)
        });

        await loadSelectedTaskList();
    } catch (error) {
        console.error('Error updating task list:', error);
    }
}

async function getUserRole() {
    try {
        const userResponse = await fetch('/api/user');
        const userInfo = await userResponse.json();
        return userInfo.role;
    } catch (error) {
        console.error('Error fetching user role:', error);
    }
}

async function removeTask(button, listName, taskIndex) {
    try {
        const userRole = await getUserRole();

        if (userRole !== 'Parent') {
            alert('Only parents have permission to remove tasks');
            return;
        }

        const familyCodeResponse = await fetch('/api/family/family-code');
        const { familyCode } = await familyCodeResponse.json();

        const response = await fetch(`/api/tasks/${familyCode}/${listName}`);
        const tasks = await response.json();

        tasks.splice(taskIndex, 1); // Remove the task at the specified index

        await fetch(`/api/tasks/${familyCode}/${listName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tasks)
        });

        await loadSelectedTaskList();
    } catch (error) {
        console.error('Error updating task list:', error);
    }
}

async function addTask() {
    const taskName = document.getElementById('new-task-name').value;
    const taskDueDate = document.getElementById('new-task-date').value;
    const selectedList = document.getElementById('task-list-dropdown').value;

    if (!taskName) {
        alert('Please enter a task name');
        return;
    }

    const newTask = { name: taskName, dueDate: taskDueDate, completed: false };

    try {
        const familyCodeResponse = await fetch('/api/family/family-code');
        const { familyCode } = await familyCodeResponse.json();

        await fetch(`/api/tasks/${familyCode}/${selectedList}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        });

        await loadSelectedTaskList();
        document.getElementById('new-task-name').value = '';
        document.getElementById('new-task-date').value = '';
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

function sortByDate() {
    const tableBody = document.getElementById('task-list-data');

    const rows = Array.from(tableBody.rows);
    if (!rows) return;

    // Determine the current sorting direction
    const isAscending = tableBody.getAttribute('data-sort-ascending') === 'true';

    rows.sort((a, b) => {
        const dateA = a.cells[2].textContent ? new Date(a.cells[2].textContent) : new Date(0); // if no date set
        const dateB = b.cells[2].textContent ? new Date(b.cells[2].textContent) : new Date(0);

        return isAscending ? dateA - dateB : dateB - dateA;
    });

    // Re-append rows in sorted order
    rows.forEach(row => tableBody.appendChild(row));

    // Toggle the sorting direction for the next click
    tableBody.setAttribute('data-sort-ascending', !isAscending);
}

document.getElementById('date-sort-icon').addEventListener('click', sortByDate);