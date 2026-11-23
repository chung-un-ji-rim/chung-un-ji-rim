# 청운지림

**현대청운고 지식공동체 공식 활동기록 시스템**

청운지림은 현대청운고 지식공동체의 회원 정보와 지식 활동(Knowledge, Response 등)을 공식으로 기록하기 위한 웹 서비스입니다. 이 시스템의 DB가 공동체 공식 활동기록의 기준(Source of Truth)이 되는 것을 목표로 합니다.

> ⚠️ **현재 상태: 프로토타입**
> 지금은 **회원가입 / 로그인** 기능만 구현된 초기 단계입니다. 전체 기능 범위는 `지식공동체 시스템 전체 기능명세서 v1.0`을 기준으로 합니다.

---

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| 런타임 | Node.js (22 이상, `better-sqlite3` 요구사항) |
| 서버 | [Express 5](https://expressjs.com/) |
| 데이터베이스 | SQLite ([better-sqlite3](https://github.com/WiseLibs/better-sqlite3)) |
| 비밀번호 암호화 | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| 로그인 유지 | [express-session](https://github.com/expressjs/session) (쿠키 기반 세션) |
| 프론트엔드 | 순수 HTML + JavaScript (프레임워크 없음) |

---

## 설치 및 실행

### 1. 준비물

- [Node.js](https://nodejs.org/) 22 이상 (`node -v`로 확인)
- Git

### 2. 레포 받기 & 패키지 설치

```bash
git clone https://github.com/chung-un-ji-rim/chung-un-ji-rim.git
cd chung-un-ji-rim
npm install
```

### 3. 서버 실행

```bash
npm start
```

터미널에 `서버 실행 중: http://localhost:3000`이 뜨면 성공입니다. 브라우저에서 http://localhost:3000 에 접속하세요.

서버를 끄려면 터미널에서 `Ctrl + C`를 누릅니다.

### 데이터베이스

- 서버를 처음 실행하면 프로젝트 폴더에 `database.db` 파일이 자동으로 만들어지고, `users` 테이블이 없으면 생성됩니다. 따로 DB를 설치하거나 설정할 필요가 없습니다.
- `database.db`는 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다. 즉, 가입한 계정은 **각자 컴퓨터에만** 저장됩니다.
- DB를 초기화하고 싶으면 서버를 끈 뒤 `database.db` 파일을 지우고 다시 실행하면 됩니다.

---

## 환경 변수

현재 코드는 **환경 변수를 사용하지 않습니다.** 아래 값들은 `script.js` 안에 직접 적혀 있습니다.

| 항목 | 현재 값 | 위치 |
|---|---|---|
| 서버 포트 | `3000` | `script.js`의 `app.listen(3000, ...)` |
| 세션 secret | 코드에 고정된 문자열 | `script.js`의 `session({ secret: ... })` |
| DB 파일 경로 | 프로젝트 폴더의 `database.db` | `script.js`의 `new Database(...)` |

> 실제 배포 전에는 세션 secret 같은 값을 `.env` 등 환경 변수로 분리하는 것이 일반적입니다. (아래 로드맵 참고)

---

## 폴더 구조

```
chung-un-ji-rim/
├── script.js          # 서버 (Express): 회원가입·로그인·세션 API, DB 초기화
├── index.html         # 메인 페이지: 회원가입·로그인 폼, 로그인 상태 확인 버튼
├── client.js          # 브라우저 쪽 JS: 폼 제출을 fetch로 보내고 결과를 alert로 표시
├── style.css          # 스타일시트 (현재 비어 있음)
├── package.json       # 프로젝트 정보, 의존성, 실행 스크립트
├── package-lock.json  # 의존성 버전 고정
├── CONTRIBUTING.md    # Git/GitHub 협업 가이드 (처음 쓰는 사람용)
├── LICENSE            # MIT 라이선스
└── .gitignore         # node_modules/, database.db 제외
```

> `database.db`, `node_modules/`는 실행·설치 후에 생기는 파일이라 레포에는 없습니다.

---

## 구현된 기능 (프로토타입)

### 회원가입

- 아이디와 비밀번호를 입력해 가입합니다.
- 비밀번호는 그대로 저장하지 않고 **bcrypt로 해시**해서 저장합니다.
- 아이디는 중복될 수 없습니다 (DB의 `UNIQUE` 제약). 이미 있는 아이디면 `이미 있는 아이디예요.`를 돌려줍니다.
- 아이디나 비밀번호가 비어 있으면 안내 메시지를 돌려줍니다.

### 로그인

- 아이디로 사용자를 찾고, 입력한 비밀번호를 저장된 해시와 비교합니다.
- 성공하면 세션에 아이디를 저장해 로그인 상태를 유지합니다.
- 실패 시 `존재하지 않는 아이디예요.` 또는 `비밀번호가 틀렸어요.`를 돌려줍니다.

### 로그인 상태 확인

- 메인 페이지의 **로그인 상태 확인** 버튼을 누르면 현재 로그인한 아이디를 보여주고, 로그인하지 않았으면 `로그인 안 되어 있음`을 보여줍니다.

### API 목록

| 메서드 | 경로 | 요청 데이터 | 설명 |
|---|---|---|---|
| `POST` | `/signup` | `username`, `password` (form-urlencoded) | 회원가입 |
| `POST` | `/login` | `username`, `password` (form-urlencoded) | 로그인, 세션 생성 |
| `GET` | `/me` | 없음 | 현재 로그인한 아이디 확인 |

모든 응답은 JSON이 아니라 **한국어 텍스트**입니다. `index.html`, `client.js` 같은 정적 파일은 Express가 프로젝트 폴더에서 그대로 제공합니다.

### DB 구조

`users` 테이블

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | INTEGER | 기본키, 자동 증가 |
| `username` | TEXT | 아이디 (중복 불가, 필수) |
| `password` | TEXT | bcrypt 해시된 비밀번호 (필수) |

### 아직 없는 것

현재 코드 기준으로 아래 기능은 아직 없습니다.

- 로그아웃
- 회원 정보 수정 / 탈퇴
- 세션 저장소: 기본 메모리 저장소를 쓰기 때문에 **서버를 재시작하면 로그인이 풀립니다.** (계정 자체는 `database.db`에 남아 있습니다.)

---

## 로드맵

기능명세서(`지식공동체 시스템 전체 기능명세서 v1.0`) 기준으로 다음 단계를 진행할 예정입니다.

### 다음 단계

1. **Knowledge 등록** (명세서 PART 3)
   - 회원이 신규 Knowledge를 공식 등록 (KNW-001)
   - 작성자, 공식 등록시각, 대분야(14개 공식 대분야), 자유태그, 본문, 출처정보 등을 저장 (KNW-002~004)
   - 작성자 본인의 Knowledge 수정. 수정해도 공식 활동 시각은 바뀌지 않음 (KNW-007)
2. **Response 등록** (명세서 PART 4)
   - 대상 Knowledge에 연결된 Response 작성 (RSP-001)
   - 작성자·내용·공식 등록시각 저장 (RSP-002)
3. **활동일 계산** (명세서 PART 5, Activity Engine)
   - KST(한국 시간) 기준 일별 공식 활동 여부 계산 (ACT-001)
   - 해당 날짜에 신규 Knowledge / Response / PASS 중 하나가 있으면 활동 완료
   - Reaction·Recommend·Save는 활동으로 계산하지 않음 (ACT-002)

### 그 이후

- 로그아웃, 세션 secret 등 설정값의 환경 변수 분리
- Recommend · Save (PART 4)
- 3일·3분야 진행도, 최근 28일 활동률 (PART 5)
- PASS · 휴면, 큐레이터 기능, Weekly / Monthly / Annual 등 (PART 6 이후)

---

## 협업

처음 Git/GitHub을 쓰는 팀원은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 먼저 읽어주세요. `main`에 직접 작업하지 않고, 브랜치 → PR → 리뷰 → merge 순서로 진행합니다.

## 라이선스

[MIT License](./LICENSE)
