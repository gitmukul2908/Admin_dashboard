const tableBody = document.getElementById('tableBody');
        const selectAllCheckbox = document.getElementById('selectAll');
        const paginationContainer = document.getElementById('pagination');
        const pageSize = 10; // Set your desired page size

        const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', renderTable);


        let currentPage = 1;
        let totalPages = 1;
        let data = [];

        selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
});


function renderTable() {
    tableBody.innerHTML = '';

    const searchFilter = document.getElementById('searchInput').value.toLowerCase();

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const filteredData = data.filter((member) => {
        return (
            member.name.toLowerCase().includes(searchFilter) ||
            member.email.toLowerCase().includes(searchFilter) ||
            member.role.toLowerCase().includes(searchFilter)
        );
    });

    for (let i = startIndex; i < endIndex && i < filteredData.length; i++) {
        const member = filteredData[i];
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td contenteditable="false">${member.name}</td>
            <td contenteditable="false">${member.email}</td>
            <td contenteditable="false">${member.role}</td>
            <td class="actions">
                <button onclick="toggleEditMode(this)">Edit</button>
                <button onclick="deleteEntry('${member.name}')">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    }

    updatePaginationButtons(filteredData.length);
}

function updatePaginationButtons(totalFilteredRows) {
    const totalFilteredPages = Math.ceil(totalFilteredRows / pageSize);

    paginationContainer.innerHTML = `
        <button onclick="firstPage()"><<</button>
        <button onclick="prevPage()"><</button>
    `;

    for (let i = 1; i <= totalFilteredPages; i++) {
        paginationContainer.innerHTML += `
            <button onclick="goToPage(${i})">${i}</button>
        `;
    }

    paginationContainer.innerHTML += `
        <button onclick="nextPage()">></button>
        <button onclick="lastPage()">>></button>
        Page ${currentPage} of ${totalFilteredPages}
    `;
}





        function updatePaginationButtons() {
            paginationContainer.innerHTML = `
                <button onclick="firstPage()"><<</button>
                <button onclick="prevPage()"><</button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `
                    <button onclick="goToPage(${i})">${i}</button>
                `;
            }

            paginationContainer.innerHTML += `
                <button onclick="nextPage()">></button>
                <button onclick="lastPage()">>></button>
                Page ${currentPage} of ${totalPages}
            `;
        }

        function firstPage() {
            currentPage = 1;
            renderTable();
        }

        function lastPage() {
            currentPage = totalPages;
            renderTable();
        }

        function prevPage() {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        }

        function nextPage() {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        }

        function goToPage(page) {
            currentPage = page;
            renderTable();
        }

        function toggleEditMode(button) {
            const row = button.closest('tr');
            const cells = row.querySelectorAll('td');

            cells.forEach(cell => {
                cell.contentEditable = !cell.isContentEditable;
                cell.classList.toggle('edit-mode', cell.isContentEditable);
            });

            if (cells[1].isContentEditable) {
                button.textContent = 'Save';
            } else {
                button.textContent = 'Edit';
                // Implement save logic here if needed
            }
        }

        function deleteEntry(name) {
            if (confirm(`Are you sure you want to delete ${name}?`)) {
                const index = data.findIndex(member => member.name === name);
                data.splice(index, 1);
                renderTable();
            }
        }


        function deleteSelected() {
    if (confirm('Are you sure you want to delete selected entries?')) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            const index = checkbox.closest('tr').rowIndex - 1; // Adjust for header row
            data.splice(index, 1);
        });

        renderTable();
    }
}

        

        // Fetch data from the JSON link
        fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
            .then(response => response.json())
            .then(responseData => {
                data = responseData;
                totalPages = Math.ceil(data.length / pageSize);
                renderTable();
            })
            .catch(error => console.error('Error fetching data:', error));