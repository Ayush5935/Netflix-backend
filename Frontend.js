let currentBackend = 'old'; // Initial backend

async function fetchData() {
    const response = await fetch(`/api/data?backend=${currentBackend}`);
    const data = await response.json();

    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = JSON.stringify(data, null, 2);
}

async function switchBackend() {
    // Call the switch endpoint on the current backend
    await fetch('/api/switch');

    // Toggle the backend flag
    currentBackend = currentBackend === 'old' ? 'new' : 'old';

    // Fetch data from the new backend
    await fetchData();
}

// Fetch data when the page loads
fetchData();
￼Enter
