document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const searchInput = document.getElementById('search-input');
    const statusFilter = document.getElementById('status-filter');
    const rowsPerPageSelect = document.getElementById('rows-per-page');
    const clearFiltersButton = document.getElementById('clear-filters-button');
    const tableBody = document.getElementById('table-body');
    const tableHeaders = document.querySelectorAll('.data-table th');
    const prevPageButton = document.getElementById('prev-page-button');
    const nextPageButton = document.getElementById('next-page-button');
    const pageInfoSpan = document.getElementById('page-info');

    // --- Simulated CSV Data (at least 6 columns, 50 records) ---
    // In a real application, you might fetch this from a 'data.csv' file using a library,
    // or from a backend API. For simplicity, it's embedded as a string here.
    const csvDataString = `Container ID,Origin Port,Destination Port,Status,Shipment Date,Weight (kg),Volume (m3),Shipper,Consignee,Value (USD)
CONT001,Shanghai,Rotterdam,In Transit,2024-05-01,15000,30,Global Logistics,Euro Imports,50000
CONT002,New York,Hamburg,Delivered,2024-04-20,12000,25,America Freight,German Goods,45000
CONT003,Singapore,Dubai,Pending,2024-05-10,18000,35,Asia Shipping,Middle East Trade,60000
CONT004,Rotterdam,New York,Delayed,2024-05-05,10000,20,Euro Express,US Connect,30000
CONT005,Hamburg,Shanghai,In Transit,2024-05-12,16000,32,German Goods,Asia Shipping,55000
CONT006,Dubai,Singapore,Delivered,2024-04-25,11000,22,Middle East Trade,Asia Shipping,40000
CONT007,New York,London,In Transit,2024-05-15,13000,28,US Connect,UK Imports,48000
CONT008,London,New York,Pending,2024-05-08,17000,33,UK Imports,US Connect,52000
CONT009,Shanghai,Sydney,In Transit,2024-05-18,14000,29,Global Logistics,Aus Goods,47000
CONT010,Sydney,Shanghai,Delivered,2024-04-28,9000,18,Aus Goods,Global Logistics,28000
CONT011,Rotterdam,Tokyo,Delayed,2024-05-03,19000,38,Euro Express,Japan Trade,65000
CONT012,Tokyo,Rotterdam,In Transit,2024-05-20,10500,21,Japan Trade,Euro Express,32000
CONT013,Singapore,Los Angeles,Pending,2024-05-11,15500,31,Asia Shipping,LA Imports,58000
CONT014,Los Angeles,Singapore,Delivered,2024-04-22,12500,26,LA Imports,Asia Shipping,46000
CONT015,Hamburg,Cape Town,In Transit,2024-05-16,17500,34,German Goods,SA Exports,62000
CONT016,Cape Town,Hamburg,Pending,2024-05-09,11500,23,SA Exports,German Goods,38000
CONT017,Dubai,Mumbai,In Transit,2024-05-19,13500,27,Middle East Trade,India Imports,49000
CONT018,Mumbai,Dubai,Delivered,2024-04-29,9500,19,India Imports,Middle East Trade,29000
CONT019,New York,Rio,Delayed,2024-05-06,18500,37,US Connect,Brazil Trade,63000
CONT020,Rio,New York,In Transit,2024-05-21,10000,20,Brazil Trade,US Connect,31000
CONT021,Shanghai,Vancouver,Pending,2024-05-13,16500,33,Global Logistics,Canada Goods,57000
CONT022,Vancouver,Shanghai,Delivered,2024-04-23,13000,27,Canada Goods,Global Logistics,44000
CONT023,Rotterdam,Buenos Aires,In Transit,2024-05-17,14500,29,Euro Express,Argentina Trade,51000
CONT024,Buenos Aires,Rotterdam,Pending,2024-05-10,17000,34,Argentina Trade,Euro Express,53000
CONT025,Singapore,Seoul,In Transit,2024-05-22,12000,24,Asia Shipping,Korea Imports,43000
CONT026,Seoul,Singapore,Delivered,2024-04-26,10000,20,Korea Imports,Asia Shipping,35000
CONT027,Hamburg,Mexico City,Delayed,2024-05-04,19500,39,German Goods,Mexico Trade,68000
CONT028,Mexico City,Hamburg,In Transit,2024-05-23,11000,22,Mexico Trade,German Goods,36000
CONT029,Dubai,Cairo,Pending,2024-05-14,16000,32,Middle East Trade,Egypt Imports,56000
CONT030,Cairo,Dubai,Delivered,2024-04-24,14000,28,Egypt Imports,Middle East Trade,42000
CONT031,New York,Dublin,In Transit,2024-05-20,13000,26,US Connect,Ireland Goods,47500
CONT032,Dublin,New York,Pending,2024-05-11,15000,30,Ireland Goods,US Connect,50500
CONT033,Shanghai,Oslo,Delayed,2024-05-07,17000,34,Global Logistics,Norway Trade,61000
CONT034,Oslo,Shanghai,In Transit,2024-05-24,10000,20,Norway Trade,Global Logistics,33000
CONT035,Rotterdam,Lisbon,Pending,2024-05-15,12000,24,Euro Express,Portugal Imports,41000
CONT036,Lisbon,Rotterdam,Delivered,2024-04-27,11000,22,Portugal Imports,Euro Express,37000
CONT037,Singapore,Bangkok,In Transit,2024-05-25,14000,28,Asia Shipping,Thai Goods,49500
CONT038,Bangkok,Singapore,Pending,2024-05-16,16000,32,Thai Goods,Asia Shipping,54000
CONT039,Hamburg,Warsaw,Delayed,2024-05-08,18000,36,German Goods,Poland Trade,64000
CONT040,Warsaw,Hamburg,In Transit,2024-05-26,10500,21,Poland Trade,German Goods,34000
CONT041,Dubai,Istanbul,Pending,2024-05-17,13000,26,Middle East Trade,Turkey Imports,48000
CONT042,Istanbul,Dubai,Delivered,2024-04-28,9500,19,Turkey Imports,Middle East Trade,30000
CONT043,New York,Madrid,In Transit,2024-05-27,15000,30,US Connect,Spain Goods,51500
CONT044,Madrid,New York,Pending,2024-05-18,17000,34,Spain Goods,US Connect,55000
CONT045,Shanghai,Helsinki,Delayed,2024-05-09,19000,38,Global Logistics,Finland Trade,67000
CONT046,Helsinki,Shanghai,In Transit,2024-05-28,11000,22,Finland Trade,Global Logistics,39000
CONT047,Rotterdam,Athens,Pending,2024-05-19,14000,28,Euro Express,Greece Imports,46000
CONT048,Athens,Rotterdam,Delivered,2024-04-30,12000,24,Greece Imports,Euro Express,40000
CONT049,Singapore,Jakarta,In Transit,2024-05-29,16000,32,Asia Shipping,Indonesia Trade,53500
CONT050,Jakarta,Singapore,Pending,2024-05-20,18000,36,Indonesia Trade,Asia Shipping,59000
`;

    // --- Global State Variables ---
    let allData = []; // Stores the parsed data from CSV
    let filteredAndSortedData = []; // Data after search, filter, and sort applied
    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value); // Initial value from select
    let searchTerm = '';
    let currentFilterStatus = ''; // Filter for 'Status' column
    let sortColumn = '';
    let sortDirection = ''; // 'asc' or 'desc'

    function toCamelCase(str) {
        str = str.trim();
        str = str.replace(/\(kg\)/i, 'Kg');
        str = str.replace(/\(m3\)/i, 'M3');
        str = str.replace(/\(usd\)/i, 'USD');
        // Split by space, lowercase first word, capitalize first letter of next words
        return str
            .split(/\s+/)
            .map((word, i) => {
                if (i === 0) return word.toLowerCase();
                if (word.toUpperCase() === 'ID') return 'Id';
                if (word.toUpperCase() === 'USD') return 'USD';
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join('');
    }

    // --- Data Parsing Function ---
     function parseCSV(csv) {
         const lines = csv.trim().split('\n');
         const headers = lines[0].split(',').map(header => toCamelCase(header.trim()));

         const data = [];
         for (let i = 1; i < lines.length; i++) {
             const values = lines[i].split(',').map(value => value.trim());
             if (values.length === headers.length) {
                 const row = {};
                 headers.forEach((header, index) => {
                     let value = values[index];
                     if (header === 'weightKg' || header === 'volumeM3' || header === 'valueUSD') {
                         row[header] = parseFloat(value);
                     } else {
                         row[header] = value;
                     }
                 });
                 data.push(row);
             }
         }
         return data;
     }

    // --- Filtering, Sorting, and Pagination Logic ---
    function applyFiltersAndSort() {
        let data = [...allData]; // Start with a copy of all original data

        // 1. Apply Search
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            data = data.filter(row =>
                // Check if any of the relevant string columns include the search term
                (row.containerId && row.containerId.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (row.originPort && row.originPort.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (row.destinationPort && row.destinationPort.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (row.status && row.status.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (row.shipper && row.shipper.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (row.consignee && row.consignee.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // 2. Apply Status Filter
        if (currentFilterStatus) {
            data = data.filter(row => row.status === currentFilterStatus);
        }

        // 3. Apply Sorting
        if (sortColumn) {
            data.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];

                // Handle null/undefined values for sorting
                if (aValue === undefined || aValue === null) return sortDirection === 'asc' ? 1 : -1;
                if (bValue === undefined || bValue === null) return sortDirection === 'asc' ? -1 : 1;


                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    // Special handling for date strings if needed, otherwise localeCompare is fine
                    if (sortColumn === 'shipmentDate') {
                        const dateA = new Date(aValue);
                        const dateB = new Date(bValue);
                        if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                        if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                        return 0;
                    }
                    // Case-insensitive string comparison for other strings
                    return sortDirection === 'asc' ?
                        aValue.localeCompare(bValue) :
                        bValue.localeCompare(aValue);
                } else {
                    // Numeric comparison
                    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                }
            });
        }

        filteredAndSortedData = data;
        renderTable(); // Re-render table after filtering and sorting
    }

    function renderTable() {
        tableBody.innerHTML = ''; // Clear existing rows

        const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = filteredAndSortedData.slice(start, end);

        if (paginatedData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-gray-500">No records found.</td></tr>`;
        } else {
            paginatedData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="whitespace-nowrap">${row.containerId || ''}</td>
                    <td>${row.originPort || ''}</td>
                    <td>${row.destinationPort || ''}</td>
                    <td>${row.status || ''}</td>
                    <td>${row.shipmentDate || ''}</td>
                    <td>${row.weightKg !== undefined && row.weightKg !== null ? row.weightKg : ''}</td>
                    <td>${row.volumeM3 !== undefined && row.volumeM3 !== null ? row.volumeM3 : ''}</td>
                    <td>${row.shipper || ''}</td>
                    <td>${row.consignee || ''}</td>
                    <td>${row.valueUSD !== undefined && row.valueUSD !== null ? row.valueUSD : ''}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Update pagination info
        pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages || 1}`;
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages || totalPages === 0;

        // Update sort icons in headers
        tableHeaders.forEach(header => {
            const column = header.dataset.column;
            header.classList.remove('asc', 'desc');
            if (column === sortColumn) {
                header.classList.add(sortDirection);
            }
        });
    }

    // --- Event Listeners ---

    // Search input
    searchInput.addEventListener('input', (event) => {
        searchTerm = event.target.value.trim();
        currentPage = 1; // Reset to first page on new search
        applyFiltersAndSort();
    });

    // Status filter
    statusFilter.addEventListener('change', (event) => {
        currentFilterStatus = event.target.value;
        currentPage = 1; // Reset to first page on new filter
        applyFiltersAndSort();
    });

    // Rows per page select
    rowsPerPageSelect.addEventListener('change', (event) => {
        rowsPerPage = parseInt(event.target.value);
        currentPage = 1; // Reset to first page when rows per page changes
        applyFiltersAndSort();
    });

    // Clear filters button
    clearFiltersButton.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = '';
        rowsPerPageSelect.value = '10'; // Reset to default
        searchTerm = '';
        currentFilterStatus = '';
        rowsPerPage = 10;
        sortColumn = ''; // Clear sort
        sortDirection = ''; // Clear sort direction
        currentPage = 1;
        applyFiltersAndSort();
    });

    // Pagination buttons
    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Table header sorting
    tableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (sortColumn === column) {
                // If same column, toggle direction
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                // If new column, set to ascending
                sortColumn = column;
                sortDirection = 'asc';
            }
            currentPage = 1; // Reset to first page on new sort
            applyFiltersAndSort();
        });
    });

    // --- Initialization ---
    // Parse the CSV data once on load
    allData = parseCSV(csvDataString);
    // Initial render of the table
    applyFiltersAndSort(); // This will call renderTable internally
});
