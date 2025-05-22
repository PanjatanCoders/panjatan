// Simulate a JSON data source
// In a real application, this would be a separate file (e.g., data.json)
// or fetched from a backend API endpoint.
const simulatedApiData = {
    "automationExercises": [
        { id: 1, title: 'Login Form Validation', description: 'Automate testing of a login form with various inputs (valid, invalid, empty).', type: 'automation' },
        { id: 2, title: 'E-commerce Product Search', description: 'Test product search functionality, including filtering and sorting.', type: 'automation' },
        { id: 3, title: 'Dynamic Table Interaction', description: 'Automate interactions with a table that loads data dynamically and allows pagination.', type: 'automation' },
        { id: 4, title: 'API Endpoint Testing', description: 'Simulate API calls and validate responses for a mock REST API.', type: 'automation' },
        { id: 5, title: 'Drag and Drop Element', description: 'Automate testing of a drag-and-drop interface.', type: 'automation' }
    ],
    "manualScenarios": [
        { id: 101, title: 'E-commerce Checkout Flow', description: 'Manually test the entire checkout process, including edge cases like invalid payment, out-of-stock items, and discount codes.', type: 'manual' },
        { id: 102, title: 'Social Media Post Creation', description: 'Test creating, editing, and deleting posts on a social media platform, including character limits and media uploads.', type: 'manual' },
        { id: 103, title: 'User Profile Management', description: 'Verify user profile updates, password changes, privacy settings, and account deletion.', type: 'manual' },
        { id: 104, title: 'Responsive Design Testing', description: 'Manually test the website\'s layout and functionality across various screen sizes (mobile, tablet, desktop).', type: 'manual' },
        { id: 105, title: 'Accessibility Testing', description: 'Perform basic accessibility checks using keyboard navigation and screen reader simulations.', type: 'manual' }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const automationExercisesDiv = document.getElementById('automation-exercises');
    const manualScenariosDiv = document.getElementById('manual-scenarios');
    const newTodoInput = document.getElementById('new-todo-input');
    const addTodoButton = document.getElementById('add-todo-button');
    const todoList = document.getElementById('todo-list');
    const todoMessage = document.getElementById('todo-message');

    // --- Function to fetch and display dynamic content ---
    async function fetchAndDisplayContent() {
        // In a real deployment, you would fetch from a data.json file like this:
        // const response = await fetch('data.json');
        // const data = await response.json();

        // For this example, we use the simulatedApiData object directly
        const data = simulatedApiData;

        // Render Automation Exercises
        if (data.automationExercises && data.automationExercises.length > 0) {
            automationExercisesDiv.innerHTML = ''; // Clear previous content
            data.automationExercises.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card', 'hover:shadow-lg', 'transition-shadow', 'duration-300');
                card.innerHTML = `
                    <h4 class="text-xl font-semibold text-gray-800 mb-2">${item.title}</h4>
                    <p class="text-gray-600 mb-4">${item.description}</p>
                    <button class="button button-primary text-sm">Start Exercise</button>
                `;
                automationExercisesDiv.appendChild(card);

                card.querySelector('button').addEventListener('click', () => {
                    // Using a simple alert for demonstration.
                    // In a real app, this would navigate to a detailed exercise page
                    // or load the interactive component directly.
                    alert(`Starting Automation Exercise: ${item.title}!`);
                });
            });
        } else {
            automationExercisesDiv.innerHTML = `<p class="text-gray-500">No automation exercises available yet. Check back soon!</p>`;
        }

        // Render Manual Scenarios
        if (data.manualScenarios && data.manualScenarios.length > 0) {
            manualScenariosDiv.innerHTML = ''; // Clear previous content
            data.manualScenarios.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('card', 'hover:shadow-lg', 'transition-shadow', 'duration-300');
                card.innerHTML = `
                    <h4 class="text-xl font-semibold text-gray-800 mb-2">${item.title}</h4>
                    <p class="text-gray-600 mb-4">${item.description}</p>
                    <button class="button button-secondary text-sm">View Scenario</button>
                `;
                manualScenariosDiv.appendChild(card);

                card.querySelector('button').addEventListener('click', () => {
                    alert(`Viewing Manual Scenario: ${item.title}!`);
                });
            });
        } else {
            manualScenariosDiv.innerHTML = `<p class="text-gray-500">No manual testing scenarios available yet. Check back soon!</p>`;
        }
    }

    // Call the function to load dynamic content when the page loads
    fetchAndDisplayContent();

    // --- To-Do List Application Logic ---
    let todos = []; // Array to store to-do items

    function renderTodos() {
        todoList.innerHTML = ''; // Clear existing list
        if (todos.length === 0) {
            todoMessage.classList.remove('hidden');
        } else {
            todoMessage.classList.add('hidden');
            todos.forEach((todo, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('todo-item');
                if (todo.completed) {
                    listItem.classList.add('completed');
                }
                listItem.setAttribute('data-id', index); // Use index as a simple ID for now

                listItem.innerHTML = `
                    <div class="flex items-center flex-grow">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                        <span class="text-lg text-gray-700 flex-grow ml-2">${todo.text}</span>
                    </div>
                    <button class="delete-todo-button">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                `;
                todoList.appendChild(listItem);
            });
        }
    }

    function addTodo() {
        const todoText = newTodoInput.value.trim();
        if (todoText) {
            todos.push({ text: todoText, completed: false });
            newTodoInput.value = ''; // Clear input
            renderTodos();
        } else {
            alert('Please enter a task!'); // Manual testing: try adding an empty task
        }
    }

    function toggleTodoComplete(event) {
        const listItem = event.target.closest('.todo-item');
        const id = parseInt(listItem.getAttribute('data-id'));
        if (!isNaN(id) && todos[id]) {
            todos[id].completed = event.target.checked;
            renderTodos(); // Re-render to apply strikethrough
        }
    }

    function deleteTodo(event) {
        const listItem = event.target.closest('.todo-item');
        const id = parseInt(listItem.getAttribute('data-id'));
        if (!isNaN(id) && todos[id]) {
            todos.splice(id, 1); // Remove item from array
            renderTodos(); // Re-render the list
        }
    }

    // Event Listeners for To-Do List
    addTodoButton.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
    todoList.addEventListener('change', (event) => {
        if (event.target.classList.contains('todo-checkbox')) {
            toggleTodoComplete(event);
        }
    });
    todoList.addEventListener('click', (event) => {
        if (event.target.closest('.delete-todo-button')) {
            deleteTodo(event);
        }
    });

    // Initial render of todos (empty list)
    renderTodos();


    // --- Example of form submission handling (client-side) ---
    const contactForm = document.querySelector('#contact form');
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Basic validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // In a real application, you would send this data to a backend server
        console.log('Form Submitted:', { name, email, message });
        alert('Thank you for your message! We will get back to you shortly.'); // Using alert for simplicity
        contactForm.reset(); // Clear the form
    });

    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
