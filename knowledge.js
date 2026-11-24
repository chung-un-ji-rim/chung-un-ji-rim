const id = window.location.pathname.split('/').pop();
fetch(`/getPost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: id })
})
.then(response => response.json())
.then(post => {
    document.querySelector('#knowledge-details').innerHTML = `
        <h1>${post.title}</h1>
        <p>작성자: ${post.username}</p>
        <p>${post.content}</p>
    `;
});