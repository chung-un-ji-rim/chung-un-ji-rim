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
                const deleteButton = (post.username === currentUser) ? `<button onclick="deletePost(${post.id})">삭제</button>` : '';
                return `<p><a href="knowledge/${post.id}">${post.title}</a> ${deleteButton}</p>`;
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
loadPosts();