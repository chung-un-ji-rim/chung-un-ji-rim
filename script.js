const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const app = express();
const db = new Database(path.join(__dirname, 'database.db'));
const session = require('express-session');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: '1234567890',
  resave: false,
  saveUninitialized: false
}));

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send('아이디와 비밀번호를 모두 입력해주세요.');
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hashedPassword);
    res.send(`가입 완료! "${username}"로 가입되었습니다.`);
  } catch (err) {
    res.send('이미 있는 아이디예요.');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send('아이디와 비밀번호를 모두 입력해주세요. ');
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user) {
    return res.send('존재하지 않는 아이디예요.');
  }

  if (bcrypt.compareSync(password, user.password)) {
    req.session.userId = username;
    res.send(`로그인 성공! "${username}"로 로그인되었습니다.`);
  } else {
    res.send('비밀번호가 틀렸어요.');
  }

});

app.get('/me', (req, res) => {
  if (req.session.userId) {
    res.send(req.session.userId);
  } else {
    res.send('로그인 안 되어 있음');
  }
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
