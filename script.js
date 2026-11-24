const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const app = express();
const db = new Database(path.join(__dirname, 'database.db'));
const session = require('express-session');

//User db
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

//Knowledge db
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '선택 안 함',
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`); 

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: '1234567890',
  resave: false,
  saveUninitialized: false
}));

//회원가입, 로그인, 로그아웃, 글 작성, 글 조회, 글 삭제 라우트 설정
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

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('로그아웃 실패');
    }
    res.send('로그아웃 성공');
  });
});

app.post('/post', (req, res) => {
  if (!req.session.userId) {
    return res.send('로그인 후에 글을 작성할 수 있어요.');
  }

  const { content } = req.body;
  const username = req.session.userId;
  const title = req.body.title || '제목 없음';
  const category = req.body.category || '선택 안 함';
  const source = req.body.source || '';

  if (!content) {
    return res.send('글 내용을 입력해주세요.');
  }
  if (!title) {
    return res.send('글 제목을 입력해주세요.');
  }
  if (!category || category === '선택 안 함') {
    return res.send('대분야를 선택해주세요.');
}
  
  db.prepare('INSERT INTO posts (username, title, content, category, source) VALUES (?, ?, ?, ?, ?)').run(username, title, content, category, source);
  res.send('게시 성공');
});

app.post('/getPosts', (req, res) => {
  const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
  res.json(posts);
});

app.post('/getPost', (req, res) => {
  const { id } = req.body;
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  res.json(post || null);
});

app.post('/deletePost', (req, res) => {
  if (!req.session.userId) {
    return res.send('로그인 후에 글을 삭제할 수 있어요.');
  }
  const { id } = req.body;
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) {
    return res.send('존재하지 않는 글이에요.');
  }
  if (post.username !== req.session.userId) {
    return res.send('자신의 글만 삭제할 수 있어요.');
  }
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  res.send('삭제 성공');
});

app.post('/editPost', (req, res) => {
  if (!req.session.userId) {
    return res.send('로그인 후에 글을 수정할 수 있어요.');
  }
  const { id, title, content, source } = req.body;
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) {
    return res.send('존재하지 않는 글이에요.');
  }
  if (post.username !== req.session.userId) {
    return res.send('자신의 글만 수정할 수 있어요.');
  }
  if (!title || !content) {
    return res.send('제목과 내용을 모두 입력해주세요.');
  }
  db.prepare('UPDATE posts SET title = ?, content = ?, source = ? WHERE id = ?').run(title, content, source, id);
  res.send('수정 성공');
});

//HTML 파일 제공
app.get('/knowledge/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'knowledge.html'));
});

app.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
});
