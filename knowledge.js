const id = window.location.pathname.split('/').pop();
fetch('/me')
    .then(response => response.text())
    .then(currentUser => {
        fetch(`/getPost`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ id: id })
        })
        .then(response => response.json())
        .then(post => {
            const editForm = (post.username === currentUser) ? `
                <h3>글 수정</h3>
                <form id="editForm">
                    <input type="hidden" name="id" value="${post.id}">
                    <input type="text" name="title" value="${post.title}">
                    <textarea name="content">${post.content}</textarea>
                    <button type="submit">수정</button>
                </form>
            ` : '';

            document.querySelector('#knowledge-details').innerHTML = `
                <h1>${post.title}</h1>
                <p>작성자: ${post.username}</p>
                <p>${post.content}</p>
                ${editForm}
            `;

            if (post.username === currentUser) {
                document.querySelector('#editForm').addEventListener('submit', async (event) => {
                    event.preventDefault();
                    fetch('/editPost', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams(new FormData(event.target))
                    })
                    .then(() => {location.reload();})
                });
            }
        });
    });