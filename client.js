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
