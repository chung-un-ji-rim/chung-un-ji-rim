document.querySelector('#LoginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(event.target))
        })
    .then(response => response.text())
    .then(message => alert(message));
});

document.querySelector('#CheckLoginStatus').addEventListener('click', () => {
    fetch('/me')
    .then(response => response.text())
    .then(message => alert(message));
});

document.querySelector('#SignupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(event.target))
        })
    .then(response => response.text())
    .then(message => alert(message));
});

document.querySelector('#LogoutForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.text())
    .then(message => alert(message));
});

document.querySelector('#PostForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    fetch('/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(new FormData(event.target))
    })
    .then(response => response.text())
    .then(message => {
        loadPosts(); 
    });
});


function loadPosts() {
    fetch('/me')
    .then(response => response.text())
    .then(currentUser => {
        fetch('/getPosts', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(posts => {
            const container = document.querySelector('#posts');
            container.innerHTML = posts.map(post => {
                const deleteButton = (post.username === currentUser) ? `<button onclick="deletePost(${escapeHtml(post.id)})">삭제</button>` : '';
                return `<p>[${escapeHtml(post.category)}] <a href="knowledge/${escapeHtml(post.id)}">${escapeHtml(post.title)}</a> ${deleteButton}</p>`;
            }).join('');
        });
    });
}

function deletePost(id) {
    fetch('/deletePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id: id })
    })
    .then(response => response.text())
    .then(message => {
        loadPosts();
    });
}

function editPost(id, title, content) {
    fetch('/editPost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id: id, title: title, content: content })
    })
    .then(response => response.text())
    .then(message => {
        loadPosts();
    });
}

function escapeHtml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

loadPosts();