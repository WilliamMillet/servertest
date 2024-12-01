function addData() {
    
    fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'John', age: 25 }),
    })
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error('Error adding data:', error);
    });
}

const btn = document.getElementById("add-button")

btn.addEventListener("click", addData)
/*
const tableBody = document.getElementById("tableBody")

document.addEventListener("DOMContentLoaded", () => {
    tableBody.
})
*/