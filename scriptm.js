document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    setupFormHandlers();
    setupButtonHandlers();
    setupTableHandlers();
    setupDragAndDrop();
    setupFileUpload();
    setupSliders();
    setupShadowDOM();
    setupAdvancedFeatures();
    setupInfiniteScroll();
}

// Form Handlers
function setupFormHandlers() {
    // Login Form
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const alert = document.getElementById('loginAlert');
        
        // Enhanced validation with specific error messages
        if (username === 'admin' && password === 'password') {
            showAlert('loginAlert', 'Login successful!', 'success');
        } else if (username === 'admin' && password !== 'password') {
            showAlert('loginAlert', 'Invalid password! Please check your password.', 'error');
        } else if (username !== 'admin' && password === 'password') {
            showAlert('loginAlert', 'Invalid username! Please check your username.', 'error');
        } else {
            showAlert('loginAlert', 'Invalid username and password! Please check your credentials.', 'error');
        }
    });

    // Registration Form
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Registration form submitted successfully!');
    });
}

// Button Handlers
function setupButtonHandlers() {
    document.getElementById('clickBtn').addEventListener('click', function() {
        showAlert('buttonAlert', 'Button clicked!', 'success');
    });

    document.getElementById('doubleClickBtn').addEventListener('dblclick', function() {
        showAlert('buttonAlert', 'Button double-clicked!', 'success');
    });

    document.getElementById('rightClickBtn').addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showAlert('buttonAlert', 'Button right-clicked!', 'success');
    });

    document.getElementById('toggleBtn').addEventListener('click', function() {
        const disabledBtn = document.getElementById('disabledBtn');
        disabledBtn.disabled = !disabledBtn.disabled;
        this.textContent = disabledBtn.disabled ? 'Enable Button' : 'Disable Button';
    });

    // Dynamic content
    document.getElementById('loadContentBtn').addEventListener('click', function() {
        const loading = document.getElementById('loadingSpinner');
        const content = document.getElementById('dynamicContent');
        
        loading.style.display = 'inline-block';
        
        setTimeout(() => {
            loading.style.display = 'none';
            content.style.display = 'block';
            document.getElementById('timestamp').textContent = 'Loaded at: ' + new Date().toLocaleTimeString();
        }, 2000);
    });

    document.getElementById('hideContentBtn').addEventListener('click', function() {
        document.getElementById('dynamicContent').style.display = 'none';
    });

    // Alerts
    document.getElementById('alertBtn').addEventListener('click', () => {
        alert('This is a simple alert!');
        document.getElementById('alertResult').innerHTML = '<p>Alert was shown</p>';
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        const result = confirm('Do you want to proceed?');
        document.getElementById('alertResult').innerHTML = '<p>Confirm result: ' + (result ? 'Yes' : 'No') + '</p>';
    });

    document.getElementById('promptBtn').addEventListener('click', () => {
        const result = prompt('Please enter your name:');
        document.getElementById('alertResult').innerHTML = '<p>Prompt result: ' + (result || 'Cancelled') + '</p>';
    });

    // Modal
    document.getElementById('modalBtn').addEventListener('click', () => {
        document.getElementById('testModal').style.display = 'block';
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('testModal').style.display = 'none';
    });
}


function setupTableHandlers() {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    let rowCounter = 3;

    // Add row
    document.getElementById('addRowBtn').addEventListener('click', function() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="checkbox" class="row-select"></td>
            <td>User ${rowCounter}</td>
            <td>user${rowCounter}@example.com</td>
            <td>User</td>
            <td><span class="status active">Active</span></td>
            <td>
                <button class="btn edit-btn" style="padding: 5px 10px;">Edit</button>
                <button class="btn btn-danger delete-btn" style="padding: 5px 10px;">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);
        rowCounter++;
        
        // Add event listeners to new buttons
        setupRowButtons(newRow);
    });

    // Delete selected rows
    document.getElementById('deleteRowBtn').addEventListener('click', function() {
        const selectedRows = document.querySelectorAll('.row-select:checked');
        if (selectedRows.length === 0) {
            alert('Please select at least one row to delete.');
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${selectedRows.length} selected row(s)?`)) {
            selectedRows.forEach(checkbox => {
                checkbox.closest('tr').remove();
            });
        }
    });

    // Select all functionality
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.row-select');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = tableBody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Sort functionality
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            const column = this.dataset.sort;
            sortTable(column);
        });
    });

    // Setup event listeners for existing rows
    setupRowButtons();
}

// Function to setup Edit and Delete buttons
function setupRowButtons(row = null) {
    const rows = row ? [row] : document.querySelectorAll('#tableBody tr');
    
    rows.forEach(row => {
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        if (editBtn) {
            // Remove existing event listeners to prevent duplicates
            editBtn.replaceWith(editBtn.cloneNode(true));
            const newEditBtn = row.querySelector('.edit-btn');
            newEditBtn.addEventListener('click', function() {
                editRow(row);
            });
        }
        
        if (deleteBtn) {
            // Remove existing event listeners to prevent duplicates
            deleteBtn.replaceWith(deleteBtn.cloneNode(true));
            const newDeleteBtn = row.querySelector('.delete-btn');
            newDeleteBtn.addEventListener('click', function() {
                deleteRow(row);
            });
        }
    });
}

// Function to edit a row
function editRow(row) {
    const cells = row.querySelectorAll('td');
    const name = cells[1].textContent;
    const email = cells[2].textContent;
    const role = cells[3].textContent;
    const status = cells[4].querySelector('.status').textContent;
    
    // Create edit form
    const editForm = `
        <div class="edit-form">
            <h3>Edit User</h3>
            <div class="form-group">
                <label>Name:</label>
                <input type="text" id="editName" value="${name}" class="form-control">
            </div>
            <div class="form-group">
                <label>Email:</label>
                <input type="email" id="editEmail" value="${email}" class="form-control">
            </div>
            <div class="form-group">
                <label>Role:</label>
                <select id="editRole" class="form-control">
                    <option value="Admin" ${role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="User" ${role === 'User' ? 'selected' : ''}>User</option>
                    <option value="Manager" ${role === 'Manager' ? 'selected' : ''}>Manager</option>
                    <option value="Developer" ${role === 'Developer' ? 'selected' : ''}>Developer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Status:</label>
                <select id="editStatus" class="form-control">
                    <option value="Active" ${status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Inactive" ${status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
            <div class="form-actions">
                <button class="btn" onclick="saveEdit(${row.rowIndex})">Save</button>
                <button class="btn btn-secondary" onclick="cancelEdit()">Cancel</button>
            </div>
        </div>
    `;
    
    // Show modal with edit form
    showModal(editForm);
}

// Function to delete a row
function deleteRow(row) {
    const name = row.querySelector('td:nth-child(2)').textContent;
    
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        row.remove();
        showAlert('buttonAlert', `${name} has been deleted successfully!`, 'success');
    }
}

// Function to save edit
function saveEdit(rowIndex) {
    const row = document.querySelector(`#tableBody tr:nth-child(${rowIndex})`);
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const role = document.getElementById('editRole').value;
    const status = document.getElementById('editStatus').value;
    
    // Update row data
    row.querySelector('td:nth-child(2)').textContent = name;
    row.querySelector('td:nth-child(3)').textContent = email;
    row.querySelector('td:nth-child(4)').textContent = role;
    
    const statusSpan = row.querySelector('.status');
    statusSpan.textContent = status;
    statusSpan.className = `status ${status.toLowerCase()}`;
    
    // Close modal
    closeModal();
    showAlert('buttonAlert', `${name} has been updated successfully!`, 'success');
}

// Function to cancel edit
function cancelEdit() {
    closeModal();
}

// Function to show modal
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editModal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// Drag and Drop
function setupDragAndDrop() {
    const draggableItems = document.querySelectorAll('.draggable-item');
    const dropZone = document.getElementById('dropZone');
    const droppedItems = document.getElementById('droppedItems');

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.value);
            e.dataTransfer.setData('text/html', this.outerHTML);
        });
    });

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const data = e.dataTransfer.getData('text/html');
        const droppedItem = document.createElement('div');
        droppedItem.innerHTML = data;
        droppedItem.firstChild.style.margin = '5px 0';
        droppedItems.appendChild(droppedItem.firstChild);
    });
}

// File Upload
function setupFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    fileUpload.addEventListener('click', () => fileInput.click());

    fileUpload.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });

    fileUpload.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });

    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        fileList.innerHTML = '<h4>Uploaded Files:</h4>';
        Array.from(files).forEach(file => {
            const fileInfo = document.createElement('div');
            fileInfo.innerHTML = `<p>📄 ${file.name} (${(file.size / 1024).toFixed(2)} KB)</p>`;
            fileList.appendChild(fileInfo);
        });
    }
}

// Sliders and Controls
function setupSliders() {
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = this.value;
    });

    // Color picker
    document.getElementById('colorInput').addEventListener('change', function() {
        document.body.style.setProperty('--accent-color', this.value);
    });
}

// Shadow DOM Setup
function setupShadowDOM() {
    // Simple Shadow DOM
    const simpleShadowHost = document.getElementById('simpleShadowHost');
    const simpleShadowRoot = simpleShadowHost.attachShadow({ mode: 'open' });
    simpleShadowRoot.innerHTML = `
        <style>
            .shadow-content { 
                background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            }
            .shadow-button {
                background: white;
                color: #ff6b6b;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
        </style>
        <div class="shadow-content">
            <h4>Content inside Shadow DOM</h4>
            <p>This content is encapsulated within a shadow DOM</p>
            <button class="shadow-button" id="shadowBtn1">Shadow Button</button>
            <input type="text" placeholder="Shadow input" style="margin: 10px 0; padding: 5px;">
        </div>
    `;

    // Add event listener to shadow DOM button
    simpleShadowRoot.getElementById('shadowBtn1').addEventListener('click', function() {
        alert('Button inside Shadow DOM clicked!');
    });

    // Nested Shadow DOM
    const nestedShadowHost = document.getElementById('nestedShadowHost');
    const nestedShadowRoot = nestedShadowHost.attachShadow({ mode: 'open' });
    nestedShadowRoot.innerHTML = `
        <style>
            .nested-container { 
                background: #e8f0fe;
                padding: 1rem;
                border-radius: 8px;
                border: 2px solid #4285f4;
            }
        </style>
        <div class="nested-container">
            <h4>Level 1 Shadow DOM</h4>
            <div id="nestedShadowHost2"></div>
        </div>
    `;

    // Create nested shadow DOM inside the first one
    const nestedHost2 = nestedShadowRoot.getElementById('nestedShadowHost2');
    const nestedShadowRoot2 = nestedHost2.attachShadow({ mode: 'open' });
    nestedShadowRoot2.innerHTML = `
        <style>
            .nested-content {
                background: linear-gradient(45deg, #4285f4, #1a73e8);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            }
            .nested-button {
                background: white;
                color: #4285f4;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
        </style>
        <div class="nested-content">
            <h5>Level 2 Nested Shadow DOM</h5>
            <p>This is content inside a nested shadow DOM</p>
            <button class="nested-button" id="nestedBtn">Nested Shadow Button</button>
            <select style="margin: 10px; padding: 5px;">
                <option>Shadow Option 1</option>
                <option>Shadow Option 2</option>
                <option>Shadow Option 3</option>
            </select>
        </div>
    `;

    nestedShadowRoot2.getElementById('nestedBtn').addEventListener('click', function() {
        alert('Button inside Nested Shadow DOM clicked!');
    });

    // Shadow DOM Form
    const shadowFormHost = document.getElementById('shadowFormHost');
    const shadowFormRoot = shadowFormHost.attachShadow({ mode: 'open' });
    shadowFormRoot.innerHTML = `
        <style>
            .shadow-form {
                background: #f8fff0;
                padding: 1.5rem;
                border-radius: 10px;
                border: 2px solid #22c55e;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-control {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .shadow-submit {
                background: linear-gradient(45deg, #22c55e, #16a34a);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            label { 
                display: block; 
                margin-bottom: 5px; 
                font-weight: bold; 
            }
        </style>
        <form class="shadow-form" id="shadowForm">
            <h4>Form inside Shadow DOM</h4>
            <div class="form-group">
                <label for="shadowName">Name:</label>
                <input type="text" id="shadowName" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="shadowEmail">Email:</label>
                <input type="email" id="shadowEmail" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="shadowMessage">Message:</label>
                <textarea id="shadowMessage" class="form-control" rows="3"></textarea>
            </div>
            <button type="submit" class="shadow-submit">Submit Shadow Form</button>
        </form>
        <div id="shadowResult" style="margin-top: 1rem;"></div>
    `;

    shadowFormRoot.getElementById('shadowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const result = shadowFormRoot.getElementById('shadowResult');
        result.innerHTML = '<p style="color: #22c55e; font-weight: bold;">Shadow DOM form submitted successfully!</p>';
    });
}

// Advanced Features
function setupAdvancedFeatures() {
    // Window handling
    document.getElementById('openWindowBtn').addEventListener('click', function() {
        const newWindow = window.open('', 'testWindow', 'width=400,height=300');
        newWindow.document.write(`
            <html>
                <head><title>Test Window</title></head>
                <body style="font-family: Arial; padding: 20px;">
                    <h2>New Window</h2>
                    <p>This is a new window for testing.</p>
                    <button onclick="window.close()">Close Window</button>
                </body>
            </html>
        `);
        updateWindowInfo();
    });

    document.getElementById('openTabBtn').addEventListener('click', function() {
        window.open('about:blank', '_blank');
        updateWindowInfo();
    });

    // AJAX simulation
    document.getElementById('ajaxBtn').addEventListener('click', function() {
        const loading = document.getElementById('ajaxLoading');
        const result = document.getElementById('ajaxResult');
        
        loading.style.display = 'inline-block';
        result.innerHTML = '';
        
        // Simulate AJAX call
        setTimeout(() => {
            loading.style.display = 'none';
            result.innerHTML = `
                <div style="background: #e8f0fe; padding: 1rem; border-radius: 8px;">
                    <h4>AJAX Response</h4>
                    <p>Data loaded at: ${new Date().toLocaleTimeString()}</p>
                    <p>Response ID: ${Math.random().toString(36).substr(2, 9)}</p>
                </div>
            `;
        }, 2000);
    });

    // Context menu
    const contextArea = document.getElementById('contextArea');
    const contextMenu = document.getElementById('contextMenu');

    contextArea.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
    });

    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });

    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', function() {
            alert(`Context menu action: ${this.textContent}`);
        });
    });
    setupAutocomplete();
}

// Infinite Scroll
function setupInfiniteScroll() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollContent = document.getElementById('scrollContent');
    const scrollLoading = document.getElementById('scrollLoading');
    let itemCount = 0;

    // Initial content
    for (let i = 0; i < 10; i++) {
        addScrollItem();
    }

    scrollContainer.addEventListener('scroll', function() {
        if (this.scrollTop + this.clientHeight >= this.scrollHeight - 10) {
            loadMoreItems();
        }
    });

    function addScrollItem() {
        const item = document.createElement('div');
        item.style.cssText = 'padding: 10px; margin: 5px 0; background: #f8f9ff; border-radius: 5px; border-left: 3px solid #667eea;';
        item.innerHTML = `<strong>Item ${++itemCount}</strong> - This is scroll item content with some text to test infinite scrolling functionality.`;
        scrollContent.appendChild(item);
    }

    function loadMoreItems() {
        scrollLoading.style.display = 'block';
        
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                addScrollItem();
            }
            scrollLoading.style.display = 'none';
        }, 1000);
    }
}

// Utility Functions
function showAlert(elementId, message, type) {
    const alert = document.getElementById(elementId);
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}

function sortTable(column) {
    const table = document.getElementById('dataTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const columnIndex = {
        'name': 1,
        'email': 2,
        'role': 3,
        'status': 4
    }[column];
    
    rows.sort((a, b) => {
        const aText = a.cells[columnIndex].textContent.trim();
        const bText = b.cells[columnIndex].textContent.trim();
        return aText.localeCompare(bText);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

function updateWindowInfo() {
    const info = document.getElementById('windowInfo');
    info.innerHTML = `<p>Current window count: ${window.length || 1}</p>`;
}

// Smooth scrolling for navigation
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Autocomplete functionality
function setupAutocomplete() {
    const input = document.getElementById('autocompleteInput');
    const list = document.getElementById('autocompleteList');
    const selectedValue = document.getElementById('selectedValue');
    const selectedText = document.getElementById('selectedText');
    
    // Sample data for autocomplete
    const suggestions = [
        'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Laravel',
        'Selenium', 'Cypress', 'Playwright', 'TestCafe', 'Jest', 'Mocha', 'JUnit', 'PyTest',
        'HTML5', 'CSS3', 'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Ant Design',
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Docker', 'Kubernetes', 'AWS', 'Azure',
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase',
        'REST API', 'GraphQL', 'WebSocket', 'JWT', 'OAuth', 'OAuth2'
    ];
    
    let currentFocus = -1;
    let filteredSuggestions = [];
    
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        filteredSuggestions = suggestions.filter(item => 
            item.toLowerCase().includes(value)
        );
        
        if (value.length === 0) {
            hideAutocompleteList();
            return;
        }
        
        showAutocompleteList();
        renderSuggestions();
    });
    
    input.addEventListener('keydown', function(e) {
        const items = list.querySelectorAll('.autocomplete-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentFocus++;
            if (currentFocus >= items.length) currentFocus = 0;
            setActive(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentFocus--;
            if (currentFocus < 0) currentFocus = items.length - 1;
            setActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            }
        } else if (e.key === 'Escape') {
            hideAutocompleteList();
        }
    });
    
    input.addEventListener('blur', function() {
        // Delay hiding to allow for clicks on suggestions
        setTimeout(() => {
            hideAutocompleteList();
        }, 200);
    });
    
    function showAutocompleteList() {
        list.style.display = 'block';
    }
    
    function hideAutocompleteList() {
        list.style.display = 'none';
        currentFocus = -1;
    }
    
    function renderSuggestions() {
        list.innerHTML = '';
        
        if (filteredSuggestions.length === 0) {
            list.innerHTML = '<div class="autocomplete-item">No suggestions found</div>';
            return;
        }
        
        filteredSuggestions.forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = suggestion;
            
            item.addEventListener('click', function() {
                input.value = suggestion;
                selectedText.textContent = suggestion;
                selectedValue.style.display = 'block';
                hideAutocompleteList();
                
                // Show success message
                showAlert('buttonAlert', `Selected: ${suggestion}`, 'success');
            });
            
            item.addEventListener('mouseenter', function() {
                currentFocus = index;
                setActive(list.querySelectorAll('.autocomplete-item'));
            });
            
            list.appendChild(item);
        });
    }
    
    function setActive(items) {
        items.forEach((item, index) => {
            item.classList.remove('highlighted');
            if (index === currentFocus) {
                item.classList.add('highlighted');
            }
        });
    }
}
