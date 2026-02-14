// This file handles data storage, including saving and retrieving user drawings from local storage or a database.

const storageKey = 'userDrawings';

// Save drawing to local storage
function saveDrawing(drawing) {
    let drawings = getDrawings();
    drawings.push(drawing);
    localStorage.setItem(storageKey, JSON.stringify(drawings));
}

// Retrieve drawings from local storage
function getDrawings() {
    const drawings = localStorage.getItem(storageKey);
    return drawings ? JSON.parse(drawings) : [];
}

// Clear all drawings from local storage
function clearDrawings() {
    localStorage.removeItem(storageKey);
}

// Example of saving a drawing
// saveDrawing({ id: 1, content: 'drawing data here' });

export { saveDrawing, getDrawings, clearDrawings };