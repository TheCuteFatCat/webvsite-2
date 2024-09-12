function searchImages() {
    const tagInput = document.getElementById('tagInput').value;
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    // Wenn das Tag-Feld leer ist, alle Bilder laden
    const query = tags.length ? `?tags=${tags.join(',')}` : '';

    fetch(`/api/images${query}`)
        .then(response => response.json())
        .then(images => {
            const imageContainer = document.getElementById('imageContainer');
            imageContainer.innerHTML = '';  // Clear previous images
            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = `/Pictures/${image}`;
                imageContainer.appendChild(imgElement);
            });
        });
}

// Initial alle Bilder anzeigen
document.addEventListener('DOMContentLoaded', () => {
    searchImages();
});

let allTags = []; // Will hold all tags from the backend

// Fetch all tags initially and store them
function fetchTags() {
    fetch('/api/tags')
        .then(response => response.json())
        .then(tags => {
            allTags = tags;
        });
}

// Show tag suggestions based on user input
function showTagSuggestions(inputValue) {
    const tagInput = inputValue.split(',').map(tag => tag.trim()).filter(tag => tag); // Split by comma and trim spaces
    const lastTag = tagInput[tagInput.length - 1] || ''; // Get the last typed tag fragment

    const suggestions = allTags
        .filter(tag => tag.startsWith(lastTag) && !tagInput.includes(tag)) // Filter tags that start with the input and are not already selected
        .slice(0, 10); // Limit suggestions to 10

    const suggestionBox = document.getElementById('suggestionBox');
    suggestionBox.innerHTML = '';

    suggestions.forEach(suggestedTag => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        suggestionItem.textContent = suggestedTag;
        suggestionItem.onclick = () => selectTag(suggestedTag, tagInput);
        suggestionBox.appendChild(suggestionItem);
    });
}

// Function to select a tag and replace the last part of the input
function selectTag(selectedTag, tagInput) {
    tagInput[tagInput.length - 1] = selectedTag; // Replace the last fragment with the selected tag
    document.getElementById('tagInput').value = tagInput.join(', ') + ', '; // Update input field
    document.getElementById('suggestionBox').innerHTML = ''; // Clear suggestions
    searchImages(); // Search with the updated tag input
}

// Event listener for input changes in the search field
document.getElementById('tagInput').addEventListener('input', (event) => {
    const inputValue = event.target.value;
    showTagSuggestions(inputValue);
});

// Fetch all tags when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchTags();
    searchImages(); // Load all images initially
});
