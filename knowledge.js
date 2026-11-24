const id = window.location.pathname.split('/').pop();

function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

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
            if (!post) {
                document.querySelector('#knowledge-details').innerHTML = '<p>존재하지 않는 글이에요.</p>';
                return;
            }
            const editForm = (post.username === currentUser) ? `
                <h3>글 수정</h3>
                <form id="editForm">
                    <input type="hidden" name="id" value="${escapeHtml(post.id)}">
                    <input type="text" name="title" value="${escapeHtml(post.title)}">
                    <textarea name="content">${escapeHtml(post.content)}</textarea>
                    <button type="submit">수정</button>
                </form>
            ` : '';

            document.querySelector('#knowledge-details').innerHTML = `
                <h1>${escapeHtml(post.title)}</h1>
                <p>분야: ${escapeHtml(post.category)}</p>
                <p>작성자: ${escapeHtml(post.username)}</p>
                <p>${escapeHtml(post.content)}</p>
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