const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint for fetching images
app.get('/api/images', (req, res) => {
    const tags = req.query.tags ? req.query.tags.split(',') : [];
    const tagsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tags.json'), 'utf8'));
    
    // Wenn keine Tags eingegeben wurden, alle Bilder anzeigen
    if (tags.length === 0) {
        return res.json(Object.keys(tagsData));
    }

    const images = [];
    for (const [image, imageTags] of Object.entries(tagsData)) {
        if (tags.every(tag => imageTags.includes(tag))) {
            images.push(image);
        }
    }

    res.json(images);
});

// Endpoint to fetch all tags
app.get('/api/tags', (req, res) => {
    const tagsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tags.json'), 'utf8'));
    const allTags = [...new Set(Object.values(tagsData).flat())]; // Get all unique tags
    res.json(allTags);
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
