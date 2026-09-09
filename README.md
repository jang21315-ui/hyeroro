# 혜로로 팬커뮤니티

왕츄.com과 같은 형태의 팬 커뮤니티를 목표로 만든 **Next.js + Supabase 기본 운영 프로젝트**입니다.

## 포함
- 회원가입 / 로그인 (Supabase Auth)
- 회원 프로필 / 닉네임 / 미네랄
- 게시판 / 게시글 작성
- 미네랄 랭킹
- 미네랄 상점 데이터
- 미니게임 예제
- 관리자 권한 구조
- PostgreSQL + RLS 보안 정책
- 모바일 반응형 기본 UI

## 시작

1. Node.js 설치
2. Supabase 프로젝트 생성
3. Supabase SQL Editor에서 `supabase/schema.sql` 전체 실행
4. `.env.example`을 `.env.local`로 복사하고 Supabase 값을 입력
5. 실행:

```bash
npm install
npm run dev
```

6. `http://localhost:3000` 접속

## 관리자 지정

회원가입 후 Supabase의 `profiles`에서 자신의 UUID를 확인하고 SQL Editor에서:

```sql
update public.profiles
set role='admin'
where id='YOUR_USER_UUID';
```

## 중요
- `.env.local`은 GitHub에 올리지 마세요.
- `SUPABASE_SECRET_KEY`는 브라우저 코드에 절대 넣지 마세요.
- 미네랄은 이 프로젝트에서 **비환금성 커뮤니티 포인트**로 설계했습니다.
- 실제 운영 전에는 이메일 인증, 비밀번호 정책, 신고/차단, 관리자 감사로그, rate limiting, 이미지 업로드 검증 등을 추가하는 것을 권장합니다.
