# 협업 가이드 (Git / GitHub 처음 쓰는 사람용)

이 문서는 git을 처음 써보는 팀원을 기준으로, 이 프로젝트에 기여하는 방법을 처음부터 끝까지 설명합니다. 순서대로 따라 하면 됩니다.

## 0. 꼭 알아야 할 개념 3가지

- **레포(repository)**: 이 프로젝트 전체를 담고 있는 저장소. 지금 보고 있는 `chung-un-ji-rim/chung-un-ji-rim`이 그 레포예요.
- **브랜치(branch)**: 작업을 위한 "복사본" 같은 거예요. `main` 브랜치는 완성된 코드만 두는 곳이고, 각자 작업할 땐 별도 브랜치를 새로 만들어서 거기서 작업해요. 그래야 내가 작업 중인 코드가 다른 사람 작업을 망가뜨리지 않아요.
- **PR (Pull Request)**: "내 브랜치의 작업을 main에 합쳐줘"라고 요청하는 것. 팀원들이 코드를 리뷰하고 괜찮으면 승인해서 합쳐요(merge). **절대로 main에 직접 작업하지 않습니다.**

## 1. 처음 한 번만 하는 설정

### 1-1. Git 설치 확인
터미널(VS Code 기준: 메뉴 Terminal → New Terminal)에 아래를 입력:
```
git --version
```
버전이 나오면 설치돼 있는 거예요. 안 나오면 [git-scm.com](https://git-scm.com)에서 설치하세요.

CURSOR 쓰는 사람 등 부자 일동은 알아서 잘 할 것

### 1-2. GitHub CLI 로그인 (최초 1회)
```
gh auth login
```
나오는 질문에: `GitHub.com` → `HTTPS` → `Login with a web browser` 선택. 터미널에 뜨는 코드를 복사해서 브라우저에 붙여넣고 로그인하면 끝.

### 1-3. 레포 받기 (clone)
아직 로컬에 레포가 없다면:
```
git clone https://github.com/chung-un-ji-rim/chung-un-ji-rim.git
cd chung-un-ji-rim
npm install
```

## 2. 작업 시작할 때마다 하는 것

### 2-1. 최신 상태로 맞추기
작업 시작 전엔 항상 main을 최신으로 받아두세요:
```
git checkout main
git pull
```

### 2-2. 내 작업용 브랜치 만들기
브랜치 이름은 `무엇을-하는지`가 드러나게 짓는 걸 추천해요 (예: `feature/프로필-페이지`, `fix/로그인-버그`).
```
git checkout -b feature/작업이름
```

### 2-3. 코드 작업하기
평소처럼 파일 수정/추가하면 됩니다.

### 2-4. 변경사항 저장하기 (commit)
무엇을 바꿨는지 git에게 기록으로 남기는 단계예요.
```
git add .
git commit -m "무엇을 했는지 한 줄로"
```
- `git add .` : 바뀐 파일 전부를 "이번 기록에 포함시킬 목록"에 추가
- `git commit -m "..."` : 그 목록을 하나의 기록(커밋)으로 저장. `-m` 뒤에는 바꾼 내용을 짧게 설명

커밋은 작업하다가 의미 있는 단위마다 여러 번 나눠서 해도 괜찮아요.

### 2-5. GitHub에 올리기 (push)
```
git push -u origin feature/작업이름
```
(처음 그 브랜치를 올릴 때만 `-u origin 브랜치이름`을 붙이고, 그 다음부턴 그냥 `git push`만 하면 됩니다.)

## 3. PR(Pull Request) 만들기

push 하면 터미널에 PR 만들기 링크가 뜨거나, GitHub 웹사이트에서 레포에 들어가면 "Compare & pull request" 버튼이 보여요. 아니면 터미널에서:
```
gh pr create
```
제목과 설명(무엇을 왜 바꿨는지)을 적고 생성하면 됩니다.

그 다음:
1. 팀원에게 리뷰 요청 (PR 페이지에 링크 공유하거나 GitHub에서 리뷰어 지정)
2. 팀원이 코드 보고 괜찮으면 Approve
3. "Merge pull request" 버튼으로 main에 합치기

## 4. 자주 겪는 문제

**"이미 누가 같은 파일을 고쳤는데 어떻게 하죠?" (충돌/conflict)**
`git pull`이나 merge할 때 "충돌났다"는 메시지가 뜰 수 있어요. 당황하지 말고, git이 충돌난 파일에 아래처럼 표시를 남겨줘요:
```
<<<<<<< HEAD
내 코드
=======
다른 사람 코드
>>>>>>> 브랜치이름
```
둘 중 맞는 걸 고르거나 합쳐서 직접 고친 다음, `git add .` → `git commit`으로 마무리하면 돼요. 헷갈리면 팀원에게 바로 물어보는 게 제일 빨라요.

**"커밋했는데 push가 안 돼요"**
다른 사람이 같은 브랜치에 먼저 push했을 수 있어요. `git pull` 먼저 받고 다시 `git push` 해보세요.

**"실수로 main에서 바로 작업해버렸어요"**
괜찮아요, 아직 커밋 안 했다면 바로 브랜치를 새로 만들면 지금 작업 내용이 그대로 옮겨져요:
```
git checkout -b feature/작업이름
```

## 5. 요약 치트시트

| 하고 싶은 것 | 명령어 |
|---|---|
| 레포 받기 | `git clone <주소>` |
| 최신 main 받기 | `git checkout main` → `git pull` |
| 새 브랜치 만들기 | `git checkout -b 브랜치이름` |
| 변경사항 확인 | `git status` |
| 변경사항 기록하기 | `git add .` → `git commit -m "설명"` |
| GitHub에 올리기 | `git push` (처음엔 `git push -u origin 브랜치이름`) |
| PR 만들기 | `gh pr create` |

막히는 부분 있으면 혼자 끌지 말고 바로 팀원이나 Claude에게 물어보세요.
