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
    setupAutocomplete();
    setupTabs();
    setupToggleSwitches();
    setupOTP();
    setupToastNotifications();
    setupProgressBar();
    setupMultiStepForm();
    setupAccordion();
}

// ─── Form Handlers ───────────────────────────────────────────────────────────
function setupFormHandlers() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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

    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        showToast('success', 'Registration form submitted successfully!');
    });
}

// ─── Button Handlers ─────────────────────────────────────────────────────────
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
        disabledBtn.setAttribute('aria-disabled', disabledBtn.disabled);
        this.textContent = disabledBtn.disabled ? 'Enable Button' : 'Disable Button';
    });

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

    document.getElementById('modalBtn').addEventListener('click', () => {
        document.getElementById('testModal').style.display = 'block';
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('testModal').style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('testModal');
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ─── Table Handlers ───────────────────────────────────────────────────────────
function setupTableHandlers() {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    let rowCounter = 6;

    document.getElementById('addRowBtn').addEventListener('click', function() {
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-testid', `user-row-${rowCounter}`);
        newRow.innerHTML = `
            <td><input type="checkbox" class="row-select" data-testid="row-checkbox-${rowCounter}" aria-label="Select User ${rowCounter}"></td>
            <td data-testid="user-name-${rowCounter}">User ${rowCounter}</td>
            <td data-testid="user-email-${rowCounter}">user${rowCounter}@example.com</td>
            <td data-testid="user-role-${rowCounter}">User</td>
            <td><span class="status active" data-testid="user-status-${rowCounter}">Active</span></td>
            <td>
                <button class="btn edit-btn" data-testid="edit-btn-${rowCounter}" style="padding: 5px 10px;" aria-label="Edit User ${rowCounter}">Edit</button>
                <button class="btn btn-danger delete-btn" data-testid="delete-btn-${rowCounter}" style="padding: 5px 10px;" aria-label="Delete User ${rowCounter}">Delete</button>
            </td>
        `;
        tableBody.appendChild(newRow);
        rowCounter++;
        setupRowButtons(newRow);
    });

    document.getElementById('deleteRowBtn').addEventListener('click', function() {
        const selectedRows = document.querySelectorAll('.row-select:checked');
        if (selectedRows.length === 0) {
            alert('Please select at least one row to delete.');
            return;
        }
        if (confirm(`Are you sure you want to delete ${selectedRows.length} selected row(s)?`)) {
            selectedRows.forEach(checkbox => checkbox.closest('tr').remove());
        }
    });

    document.getElementById('selectAll').addEventListener('change', function() {
        document.querySelectorAll('.row-select').forEach(cb => { cb.checked = this.checked; });
    });

    searchInput.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        tableBody.querySelectorAll('tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    });

    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.addEventListener('click', function() {
            sortTable(this.dataset.sort);
        });
    });

    setupRowButtons();
}

function setupRowButtons(row = null) {
    const rows = row ? [row] : document.querySelectorAll('#tableBody tr');
    rows.forEach(r => {
        const editBtn = r.querySelector('.edit-btn');
        const deleteBtn = r.querySelector('.delete-btn');
        if (editBtn) {
            const fresh = editBtn.cloneNode(true);
            editBtn.replaceWith(fresh);
            fresh.addEventListener('click', () => editRow(r));
        }
        if (deleteBtn) {
            const fresh = deleteBtn.cloneNode(true);
            deleteBtn.replaceWith(fresh);
            fresh.addEventListener('click', () => deleteRow(r));
        }
    });
}

function editRow(row) {
    const cells = row.querySelectorAll('td');
    const name   = cells[1].textContent;
    const email  = cells[2].textContent;
    const role   = cells[3].textContent;
    const status = cells[4].querySelector('.status').textContent;

    const editForm = `
        <div class="edit-form">
            <h3>Edit User</h3>
            <div class="form-group"><label>Name:</label>
                <input type="text" id="editName" value="${name}" class="form-control" data-testid="edit-name-input"></div>
            <div class="form-group"><label>Email:</label>
                <input type="email" id="editEmail" value="${email}" class="form-control" data-testid="edit-email-input"></div>
            <div class="form-group"><label>Role:</label>
                <select id="editRole" class="form-control" data-testid="edit-role-select">
                    <option value="Admin"     ${role==='Admin'     ?'selected':''}>Admin</option>
                    <option value="User"      ${role==='User'      ?'selected':''}>User</option>
                    <option value="Manager"   ${role==='Manager'   ?'selected':''}>Manager</option>
                    <option value="Developer" ${role==='Developer' ?'selected':''}>Developer</option>
                </select></div>
            <div class="form-group"><label>Status:</label>
                <select id="editStatus" class="form-control" data-testid="edit-status-select">
                    <option value="Active"   ${status==='Active'  ?'selected':''}>Active</option>
                    <option value="Inactive" ${status==='Inactive'?'selected':''}>Inactive</option>
                </select></div>
            <div class="form-actions">
                <button class="btn" data-testid="edit-save-btn" onclick="saveEdit(${row.rowIndex})">Save</button>
                <button class="btn btn-secondary" data-testid="edit-cancel-btn" onclick="cancelEdit()">Cancel</button>
            </div>
        </div>`;
    showModal(editForm);
}

function deleteRow(row) {
    const name = row.querySelector('td:nth-child(2)').textContent;
    if (confirm(`Are you sure you want to delete ${name}?`)) {
        row.remove();
        showAlert('buttonAlert', `${name} has been deleted successfully!`, 'success');
    }
}

function saveEdit(rowIndex) {
    const row    = document.querySelector(`#tableBody tr:nth-child(${rowIndex})`);
    const name   = document.getElementById('editName').value;
    const email  = document.getElementById('editEmail').value;
    const role   = document.getElementById('editRole').value;
    const status = document.getElementById('editStatus').value;

    row.querySelector('td:nth-child(2)').textContent = name;
    row.querySelector('td:nth-child(3)').textContent = email;
    row.querySelector('td:nth-child(4)').textContent = role;

    const statusSpan = row.querySelector('.status');
    statusSpan.textContent = status;
    statusSpan.className = `status ${status.toLowerCase()}`;

    closeModal();
    showAlert('buttonAlert', `${name} has been updated successfully!`, 'success');
}

function cancelEdit() { closeModal(); }

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'editModal';
    modal.innerHTML = `<div class="modal-content"><span class="close" onclick="closeModal()" aria-label="Close">&times;</span>${content}</div>`;
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) modal.remove();
}

// ─── Drag and Drop ────────────────────────────────────────────────────────────
function setupDragAndDrop() {
    const dropZone    = document.getElementById('dropZone');
    const droppedItems = document.getElementById('droppedItems');

    document.querySelectorAll('.draggable-item').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.value);
            e.dataTransfer.setData('text/html', this.outerHTML);
        });
    });

    dropZone.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', ()  => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        const html = e.dataTransfer.getData('text/html');
        const wrapper = document.createElement('div');
        wrapper.innerHTML = html;
        const el = wrapper.firstChild;
        el.style.margin = '5px 0';
        droppedItems.appendChild(el);
    });
}

// ─── File Upload ──────────────────────────────────────────────────────────────
function setupFileUpload() {
    const fileUpload = document.getElementById('fileUpload');
    const fileInput  = document.getElementById('fileInput');
    const fileList   = document.getElementById('fileList');

    fileUpload.addEventListener('click',    () => fileInput.click());
    fileUpload.addEventListener('keydown',  e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });
    fileUpload.addEventListener('dragover', e => { e.preventDefault(); fileUpload.classList.add('drag-over'); });
    fileUpload.addEventListener('dragleave',()  => fileUpload.classList.remove('drag-over'));
    fileUpload.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', function() { handleFiles(this.files); });

    function handleFiles(files) {
        fileList.innerHTML = '<h4>Uploaded Files:</h4>';
        Array.from(files).forEach(file => {
            const div = document.createElement('div');
            div.setAttribute('data-testid', 'uploaded-file');
            div.innerHTML = `<p>📄 <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)</p>`;
            fileList.appendChild(div);
        });
    }
}

// ─── Sliders ──────────────────────────────────────────────────────────────────
function setupSliders() {
    const volumeSlider     = document.getElementById('volumeSlider');
    const volumeValue      = document.getElementById('volumeValue');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const brightnessValue  = document.getElementById('brightnessValue');

    volumeSlider.addEventListener('input', function() {
        volumeValue.textContent = this.value;
        this.setAttribute('aria-valuenow', this.value);
    });

    brightnessSlider.addEventListener('input', function() {
        brightnessValue.textContent = this.value;
        this.setAttribute('aria-valuenow', this.value);
    });

    document.getElementById('colorInput').addEventListener('change', function() {
        document.body.style.setProperty('--accent-color', this.value);
    });
}

// ─── Shadow DOM ───────────────────────────────────────────────────────────────
function setupShadowDOM() {
    // Simple Shadow DOM
    const simpleShadowHost = document.getElementById('simpleShadowHost');
    const simpleShadowRoot = simpleShadowHost.attachShadow({ mode: 'open' });
    simpleShadowRoot.innerHTML = `
        <style>
            .shadow-content { background: linear-gradient(45deg,#ff6b6b,#ee5a24); color:white; padding:1rem; border-radius:8px; margin:1rem 0; }
            .shadow-button  { background:white; color:#ff6b6b; border:none; padding:8px 16px; border-radius:5px; cursor:pointer; font-weight:bold; }
            input { margin:10px 0; padding:6px; border:1px solid #ccc; border-radius:4px; display:block; }
        </style>
        <div class="shadow-content">
            <h4>Content inside Shadow DOM</h4>
            <p>This content is encapsulated within a shadow DOM</p>
            <button class="shadow-button" id="shadowBtn1">Shadow Button</button>
            <input type="text" placeholder="Shadow input" id="shadowInput">
        </div>`;
    simpleShadowRoot.getElementById('shadowBtn1').addEventListener('click', () => {
        alert('Button inside Shadow DOM clicked!');
    });

    // Nested Shadow DOM
    const nestedShadowHost = document.getElementById('nestedShadowHost');
    const nestedShadowRoot = nestedShadowHost.attachShadow({ mode: 'open' });
    nestedShadowRoot.innerHTML = `
        <style>
            .nested-container { background:#e8f0fe; padding:1rem; border-radius:8px; border:2px solid #4285f4; }
        </style>
        <div class="nested-container">
            <h4>Level 1 Shadow DOM</h4>
            <div id="nestedShadowHost2"></div>
        </div>`;
    const nestedHost2 = nestedShadowRoot.getElementById('nestedShadowHost2');
    const nestedShadowRoot2 = nestedHost2.attachShadow({ mode: 'open' });
    nestedShadowRoot2.innerHTML = `
        <style>
            .nested-content  { background:linear-gradient(45deg,#4285f4,#1a73e8); color:white; padding:1rem; border-radius:8px; margin:0.5rem 0; }
            .nested-button   { background:white; color:#4285f4; border:none; padding:8px 16px; border-radius:5px; cursor:pointer; font-weight:bold; }
            select { margin:8px; padding:5px; }
        </style>
        <div class="nested-content">
            <h5>Level 2 Nested Shadow DOM</h5>
            <p>This is content inside a nested shadow DOM</p>
            <button class="nested-button" id="nestedBtn">Nested Shadow Button</button>
            <select>
                <option>Shadow Option 1</option>
                <option>Shadow Option 2</option>
                <option>Shadow Option 3</option>
            </select>
        </div>`;
    nestedShadowRoot2.getElementById('nestedBtn').addEventListener('click', () => {
        alert('Button inside Nested Shadow DOM clicked!');
    });

    // Shadow DOM Form
    const shadowFormHost = document.getElementById('shadowFormHost');
    const shadowFormRoot = shadowFormHost.attachShadow({ mode: 'open' });
    shadowFormRoot.innerHTML = `
        <style>
            .shadow-form { background:#f8fff0; padding:1.5rem; border-radius:10px; border:2px solid #22c55e; }
            .form-group  { margin-bottom:1rem; }
            .form-control{ width:100%; padding:8px; border:1px solid #ccc; border-radius:5px; box-sizing:border-box; }
            .shadow-submit{ background:linear-gradient(45deg,#22c55e,#16a34a); color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer; font-weight:bold; }
            label { display:block; margin-bottom:5px; font-weight:bold; }
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
        <div id="shadowResult" style="margin-top:1rem;"></div>`;
    shadowFormRoot.getElementById('shadowForm').addEventListener('submit', function(e) {
        e.preventDefault();
        shadowFormRoot.getElementById('shadowResult').innerHTML =
            '<p style="color:#22c55e;font-weight:bold;">Shadow DOM form submitted successfully!</p>';
    });
}

// ─── Advanced Features ────────────────────────────────────────────────────────
function setupAdvancedFeatures() {
    document.getElementById('openWindowBtn').addEventListener('click', function() {
        const w = window.open('', 'testWindow', 'width=400,height=300');
        w.document.write(`<html><head><title>Test Window</title></head>
            <body style="font-family:Arial;padding:20px;">
                <h2>New Window</h2>
                <p>This is a new window for testing.</p>
                <button onclick="window.close()">Close Window</button>
            </body></html>`);
        updateWindowInfo();
    });

    document.getElementById('openTabBtn').addEventListener('click', function() {
        window.open('about:blank', '_blank');
        updateWindowInfo();
    });

    document.getElementById('ajaxBtn').addEventListener('click', function() {
        const loading = document.getElementById('ajaxLoading');
        const result  = document.getElementById('ajaxResult');
        loading.style.display = 'inline-block';
        result.innerHTML = '';
        setTimeout(() => {
            loading.style.display = 'none';
            result.innerHTML = `
                <div data-testid="ajax-response" style="background:#e8f0fe;padding:1rem;border-radius:8px;">
                    <h4>AJAX Response</h4>
                    <p>Data loaded at: <span data-testid="ajax-timestamp">${new Date().toLocaleTimeString()}</span></p>
                    <p>Response ID: <span data-testid="ajax-response-id">${Math.random().toString(36).substr(2,9)}</span></p>
                </div>`;
        }, 2000);
    });

    const contextArea = document.getElementById('contextArea');
    const contextMenu = document.getElementById('contextMenu');
    contextArea.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top  = e.pageY + 'px';
    });
    document.addEventListener('click', () => { contextMenu.style.display = 'none'; });
    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', function() { alert(`Context menu action: ${this.textContent.trim()}`); });
    });
}

// ─── Infinite Scroll ──────────────────────────────────────────────────────────
function setupInfiniteScroll() {
    const scrollContainer = document.getElementById('scrollContainer');
    const scrollContent   = document.getElementById('scrollContent');
    const scrollLoading   = document.getElementById('scrollLoading');
    let itemCount = 0;
    let loading   = false;

    for (let i = 0; i < 10; i++) addScrollItem();

    scrollContainer.addEventListener('scroll', function() {
        if (!loading && this.scrollTop + this.clientHeight >= this.scrollHeight - 20) {
            loading = true;
            scrollLoading.style.display = 'block';
            setTimeout(() => {
                for (let i = 0; i < 5; i++) addScrollItem();
                scrollLoading.style.display = 'none';
                loading = false;
            }, 1000);
        }
    });

    function addScrollItem() {
        const item = document.createElement('div');
        item.setAttribute('data-testid', `scroll-item-${itemCount + 1}`);
        item.style.cssText = 'padding:10px;margin:5px 0;background:#f8f9ff;border-radius:5px;border-left:3px solid #667eea;';
        item.innerHTML = `<strong>Item ${++itemCount}</strong> — Scroll item content for infinite scroll testing.`;
        scrollContent.appendChild(item);
    }
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────
function setupAutocomplete() {
    const input        = document.getElementById('autocompleteInput');
    const list         = document.getElementById('autocompleteList');
    const selectedDiv  = document.getElementById('selectedValue');
    const selectedText = document.getElementById('selectedText');

    const suggestions = [
        'JavaScript','Python','Java','C++','C#','PHP','Ruby','Go','Swift','Kotlin',
        'React','Angular','Vue.js','Node.js','Express.js','Django','Flask','Laravel',
        'Selenium','Cypress','Playwright','TestCafe','Jest','Mocha','JUnit','PyTest',
        'HTML5','CSS3','Bootstrap','Tailwind CSS','Material-UI','Ant Design',
        'Git','GitHub','GitLab','Bitbucket','Docker','Kubernetes','AWS','Azure',
        'MySQL','PostgreSQL','MongoDB','Redis','Elasticsearch','Firebase',
        'REST API','GraphQL','WebSocket','JWT','OAuth','OAuth2'
    ];

    let currentFocus = -1;
    let filtered = [];

    input.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        filtered = suggestions.filter(s => s.toLowerCase().includes(val));
        currentFocus = -1;
        if (!val) { hideList(); return; }
        renderList();
    });

    input.addEventListener('keydown', function(e) {
        const items = list.querySelectorAll('.autocomplete-item');
        if (e.key === 'ArrowDown')  { e.preventDefault(); currentFocus = Math.min(currentFocus + 1, items.length - 1); setActive(items); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); currentFocus = Math.max(currentFocus - 1, 0); setActive(items); }
        else if (e.key === 'Enter') { e.preventDefault(); if (currentFocus >= 0 && items[currentFocus]) items[currentFocus].click(); }
        else if (e.key === 'Escape') hideList();
    });

    input.addEventListener('blur', () => setTimeout(hideList, 200));

    function renderList() {
        list.innerHTML = '';
        list.style.display = 'block';
        if (!filtered.length) {
            list.innerHTML = '<div class="autocomplete-item" style="color:#999;">No suggestions found</div>';
            return;
        }
        filtered.forEach((s, i) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.setAttribute('role', 'option');
            item.setAttribute('data-testid', `autocomplete-option-${i}`);
            item.textContent = s;
            item.addEventListener('mouseenter', () => { currentFocus = i; setActive(list.querySelectorAll('.autocomplete-item')); });
            item.addEventListener('click', () => {
                input.value = s;
                selectedText.textContent = s;
                selectedDiv.style.display = 'block';
                showAlert('buttonAlert', `Selected: ${s}`, 'success');
                hideList();
            });
            list.appendChild(item);
        });
    }

    function hideList() { list.style.display = 'none'; list.innerHTML = ''; currentFocus = -1; }

    function setActive(items) {
        items.forEach((item, i) => item.classList.toggle('highlighted', i === currentFocus));
    }
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;

            // Update buttons
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // Update panels
            document.querySelectorAll('.tab-panel').forEach(p => { p.style.display = 'none'; });
            const panel = document.getElementById(`tab-panel-${tab}`);
            if (panel) panel.style.display = 'block';
        });
    });
}

// ─── Toggle Switches ──────────────────────────────────────────────────────────
function setupToggleSwitches() {
    const master      = document.getElementById('masterToggle');
    const subToggles  = ['notificationsToggle', 'darkModeToggle', 'analyticsToggle', 'twoFactorToggle'];
    const statusEl    = document.getElementById('toggleStatus');

    master.addEventListener('change', function() {
        subToggles.forEach(id => {
            const el = document.getElementById(id);
            el.disabled = !this.checked;
            el.setAttribute('aria-disabled', !this.checked);
        });
        statusEl.textContent = this.checked
            ? 'Master switch is ON — sub-toggles are now enabled.'
            : 'Master switch is OFF — sub-toggles are disabled.';
    });

    document.getElementById('darkModeToggle').addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        statusEl.textContent = this.checked ? 'Dark mode enabled.' : 'Dark mode disabled.';
    });

    subToggles.forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
            const label = this.closest('.toggle-item')?.querySelector('.toggle-label')?.textContent || id;
            statusEl.textContent = `${label}: ${this.checked ? 'ON' : 'OFF'}`;
        });
    });
}

// ─── OTP Input ────────────────────────────────────────────────────────────────
function setupOTP() {
    const inputs = Array.from(document.querySelectorAll('.otp-input'));
    const CORRECT = '123456';

    inputs.forEach((input, i) => {
        input.addEventListener('input', function() {
            const val = this.value.replace(/[^0-9]/g, '');
            this.value = val ? val.slice(-1) : '';
            if (val && i < inputs.length - 1) inputs[i + 1].focus();
            this.classList.toggle('filled', !!this.value);
            clearOTPError();
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && i > 0) {
                inputs[i - 1].value = '';
                inputs[i - 1].classList.remove('filled');
                inputs[i - 1].focus();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            pasted.split('').slice(0, inputs.length - i).forEach((ch, j) => {
                if (inputs[i + j]) {
                    inputs[i + j].value = ch;
                    inputs[i + j].classList.add('filled');
                }
            });
            const next = Math.min(i + pasted.length, inputs.length - 1);
            inputs[next].focus();
        });
    });

    document.getElementById('verifyOtpBtn').addEventListener('click', function() {
        const otp = inputs.map(i => i.value).join('');
        const result = document.getElementById('otpResult');
        if (otp.length < 6) {
            result.innerHTML = '<p style="color:#f59e0b;font-weight:600;">⚠️ Please enter all 6 digits.</p>';
            return;
        }
        if (otp === CORRECT) {
            result.innerHTML = '<p style="color:#22c55e;font-weight:600;" data-testid="otp-success">✅ OTP verified successfully!</p>';
            inputs.forEach(i => { i.classList.remove('otp-error'); i.classList.add('filled'); });
        } else {
            result.innerHTML = '<p style="color:#ef4444;font-weight:600;" data-testid="otp-error-msg">❌ Invalid OTP. Please try again.</p>';
            inputs.forEach(i => { i.classList.add('otp-error'); i.classList.remove('filled'); });
        }
    });

    document.getElementById('clearOtpBtn').addEventListener('click', function() {
        inputs.forEach(i => { i.value = ''; i.classList.remove('filled', 'otp-error'); });
        document.getElementById('otpResult').innerHTML = '';
        inputs[0].focus();
    });

    function clearOTPError() {
        inputs.forEach(i => i.classList.remove('otp-error'));
        document.getElementById('otpResult').innerHTML = '';
    }
}

// ─── Toast Notifications ─────────────────────────────────────────────────────
function setupToastNotifications() {
    document.getElementById('toastSuccessBtn').addEventListener('click', () =>
        showToast('success', 'Operation completed successfully!'));
    document.getElementById('toastErrorBtn').addEventListener('click', () =>
        showToast('error', 'An error occurred. Please try again.'));
    document.getElementById('toastWarningBtn').addEventListener('click', () =>
        showToast('warning', 'Warning: Please review your input.'));
    document.getElementById('toastInfoBtn').addEventListener('click', () =>
        showToast('info', 'New update available. Refresh to apply.'));
}

function showToast(type, message) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('data-testid', `toast-${type}`);
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close notification" data-testid="toast-close-${type}">×</button>`;

    toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));
    container.appendChild(toast);

    setTimeout(() => dismissToast(toast), 4000);
}

function dismissToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('removing');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function setupProgressBar() {
    const bar       = document.getElementById('progressBar1');
    const label     = document.getElementById('progressValue1');
    const msgEl     = document.getElementById('progressMsg');
    let interval    = null;
    let currentVal  = 0;
    let running     = false;

    document.getElementById('startProgressBtn').addEventListener('click', function() {
        if (running) return;
        if (currentVal >= 100) { resetProgress(); return; }
        running = true;
        this.disabled = true;
        msgEl.textContent = 'Uploading...';

        interval = setInterval(() => {
            currentVal = Math.min(currentVal + Math.floor(Math.random() * 5) + 1, 100);
            bar.style.width = currentVal + '%';
            bar.setAttribute('aria-valuenow', currentVal);
            label.textContent = currentVal;
            if (currentVal >= 100) {
                clearInterval(interval);
                running = false;
                msgEl.innerHTML = '<span data-testid="progress-complete" style="color:#22c55e;font-weight:600;">✅ Upload complete!</span>';
                document.getElementById('startProgressBtn').disabled = false;
            }
        }, 150);
    });

    document.getElementById('resetProgressBtn').addEventListener('click', resetProgress);

    function resetProgress() {
        clearInterval(interval);
        running = false;
        currentVal = 0;
        bar.style.width = '0%';
        bar.setAttribute('aria-valuenow', 0);
        label.textContent = '0';
        msgEl.textContent = '';
        document.getElementById('startProgressBtn').disabled = false;
    }
}

// ─── Multi-Step Form ──────────────────────────────────────────────────────────
function setupMultiStepForm() {
    let currentStep = 1;
    const totalSteps = 4;
    const formData = {};

    function goTo(step) {
        document.querySelectorAll('.step-panel').forEach(p => { p.style.display = 'none'; });
        const panel = document.getElementById(`step-panel-${step}`);
        if (panel) panel.style.display = 'block';

        // Update step indicators
        document.querySelectorAll('.step-item').forEach((item, i) => {
            const n = i + 1; // each step-item, not connectors
            item.classList.remove('active', 'completed');
            if (n < step)      item.classList.add('completed');
            else if (n === step) item.classList.add('active');
        });

        // Update connectors
        document.querySelectorAll('.step-connector').forEach((c, i) => {
            c.classList.toggle('completed', i + 1 < step);
        });

        currentStep = step;
    }

    function showStepError(stepNum, msg) {
        const el = document.getElementById(`step${stepNum}-error`);
        el.textContent = msg;
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 4000);
    }

    // Step 1 → 2
    document.getElementById('step1-next').addEventListener('click', () => {
        const fn = document.getElementById('ms-firstname').value.trim();
        const ln = document.getElementById('ms-lastname').value.trim();
        const em = document.getElementById('ms-email').value.trim();
        if (!fn || !ln || !em) { showStepError(1, 'Please fill in First Name, Last Name and Email.'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { showStepError(1, 'Please enter a valid email address.'); return; }
        formData.firstname = fn; formData.lastname = ln; formData.email = em;
        formData.phone = document.getElementById('ms-phone').value.trim();
        goTo(2);
    });

    // Step 2 → 1
    document.getElementById('step2-back').addEventListener('click', () => goTo(1));

    // Step 2 → 3
    document.getElementById('step2-next').addEventListener('click', () => {
        const addr = document.getElementById('ms-address').value.trim();
        const city = document.getElementById('ms-city').value.trim();
        const zip  = document.getElementById('ms-zip').value.trim();
        const ctry = document.getElementById('ms-country').value;
        if (!addr || !city || !zip || !ctry) { showStepError(2, 'Please fill in Address, City, ZIP and Country.'); return; }
        formData.address = addr; formData.city = city; formData.zip = zip; formData.country = ctry;
        formData.state = document.getElementById('ms-state').value.trim();
        goTo(3);
    });

    // Step 3 → 2
    document.getElementById('step3-back').addEventListener('click', () => goTo(2));

    // Step 3 → 4
    document.getElementById('step3-next').addEventListener('click', () => {
        const cn = document.getElementById('ms-cardname').value.trim();
        const cc = document.getElementById('ms-cardnumber').value.trim();
        const ex = document.getElementById('ms-expiry').value.trim();
        const cv = document.getElementById('ms-cvv').value.trim();
        if (!cn || !cc || !ex || !cv) { showStepError(3, 'Please fill in all card details.'); return; }
        formData.cardname = cn;
        formData.paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'credit';
        buildOrderSummary();
        goTo(4);
    });

    // Step 4 → 3
    document.getElementById('step4-back').addEventListener('click', () => goTo(3));

    // Submit
    document.getElementById('step4-submit').addEventListener('click', () => {
        if (!document.getElementById('ms-terms').checked) {
            showStepError(4, 'You must agree to the Terms and Conditions.');
            return;
        }
        const orderNum = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
        document.getElementById('orderNumber').textContent = orderNum;

        // Mark all steps complete
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.remove('active');
            item.classList.add('completed');
        });
        document.querySelectorAll('.step-connector').forEach(c => c.classList.add('completed'));

        document.querySelectorAll('.step-panel').forEach(p => { p.style.display = 'none'; });
        document.getElementById('step-panel-success').style.display = 'block';
    });

    // Start new order
    document.getElementById('startNewOrderBtn').addEventListener('click', () => {
        ['ms-firstname','ms-lastname','ms-email','ms-phone',
         'ms-address','ms-city','ms-state','ms-zip',
         'ms-cardname','ms-cardnumber','ms-expiry','ms-cvv'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('ms-country').value = '';
        document.getElementById('ms-terms').checked = false;
        document.querySelectorAll('.step-connector').forEach(c => c.classList.remove('completed'));
        goTo(1);
    });

    function buildOrderSummary() {
        const ctryMap = { us:'United States', uk:'United Kingdom', ca:'Canada', in:'India', au:'Australia' };
        document.getElementById('order-summary-content').innerHTML = `
            <p><strong>Name:</strong> ${formData.firstname} ${formData.lastname}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Ship to:</strong> ${formData.address}, ${formData.city} ${formData.zip}, ${ctryMap[formData.country] || formData.country}</p>
            <p><strong>Payment:</strong> ${formData.paymentMethod.charAt(0).toUpperCase() + formData.paymentMethod.slice(1)} Card</p>
            <p><strong>Cardholder:</strong> ${formData.cardname}</p>`;
    }

    goTo(1);
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function setupAccordion() {
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            const isOpen   = this.getAttribute('aria-expanded') === 'true';
            const bodyId   = this.getAttribute('aria-controls');
            const body     = document.getElementById(bodyId);

            // Close all
            document.querySelectorAll('.accordion-header').forEach(h => {
                h.setAttribute('aria-expanded', 'false');
                const b = document.getElementById(h.getAttribute('aria-controls'));
                if (b) b.style.display = 'none';
            });

            // Open clicked (toggle)
            if (!isOpen) {
                this.setAttribute('aria-expanded', 'true');
                if (body) body.style.display = 'block';
            }
        });
    });
}

// ─── Utility Functions ────────────────────────────────────────────────────────
function showAlert(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = `alert alert-${type}`;
    el.textContent = message;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 3000);
}

function sortTable(column) {
    const tbody = document.querySelector('#dataTable tbody');
    const rows  = Array.from(tbody.querySelectorAll('tr'));
    const colIndex = { name:1, email:2, role:3, status:4 }[column];
    rows.sort((a, b) => a.cells[colIndex].textContent.trim().localeCompare(b.cells[colIndex].textContent.trim()));
    rows.forEach(r => tbody.appendChild(r));
}

function updateWindowInfo() {
    document.getElementById('windowInfo').innerHTML = `<p data-testid="window-count">Current window handles: ${window.length || 1}</p>`;
}

// Smooth scroll for nav links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});
