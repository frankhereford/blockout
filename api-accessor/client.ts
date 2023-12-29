async function fetchData() {
    const res = await fetch('http://localhost:3000/game-get?name=James', { method: 'GET' });
    const body = await res.json(); /* { greeting: 'Hello James!' } */
    console.log(body);
}

fetchData();