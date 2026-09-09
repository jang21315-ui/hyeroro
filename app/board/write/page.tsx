import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function WritePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="write-page">

      <style>{`
        .write-page {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        .write-header {
          margin-bottom: 20px;
        }

        .write-title {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .write-description {
          margin: 8px 0 0;
          color: #737c88;
          font-size: 13px;
        }

        .write-card {
          padding: 28px;
          border: 1px solid #2a3039;
          border-radius: 12px;
          background: #0b0f15;
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
        }

        .form-group {
          margin-bottom: 22px;
        }

        .form-group:last-of-type {
          margin-bottom: 0;
        }

        .form-label {
          display: block;
          margin-bottom: 9px;
          color: #dfe3e8;
          font-size: 13px;
          font-weight: 800;
        }

        .form-label span {
          color: #d6a928;
        }

        .write-input,
        .write-textarea {
          width: 100%;
          border: 1px solid #303743;
          border-radius: 8px;
          background: #0d1219;
          color: #f5f5f5;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .write-input {
          height: 48px;
          padding: 0 15px;
        }

        .write-textarea {
          min-height: 380px;
          padding: 15px;
          resize: vertical;
          line-height: 1.7;
        }

        .write-input:focus,
        .write-textarea:focus {
          border-color: #d6a928;
          box-shadow: 0 0 0 2px rgba(214, 169, 40, 0.12);
        }

        .write-input::placeholder,
        .write-textarea::placeholder {
          color: #626b76;
        }

        .write-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #252b34;
        }

        .write-notice {
          color: #626b76;
          font-size: 11px;
          line-height: 1.6;
        }

        .write-actions {
          display: flex;
          gap: 9px;
        }

        .cancel-button,
        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 18px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .cancel-button {
          border: 1px solid #343b46;
          background: #11161e;
          color: #b9c0c9;
        }

        .cancel-button:hover {
          background: #171d26;
          color: #ffffff;
        }

        .submit-button {
          border: 1px solid #d6a928;
          background: #d6a928;
          color: #111111;
        }

        .submit-button:hover {
          background: #f0c43d;
        }

        .login-message {
          padding: 70px 20px;
          text-align: center;
        }

        .login-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .login-title {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
        }

        .login-text {
          margin: 10px 0 20px;
          color: #737c88;
          font-size: 13px;
        }

        .login-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          padding: 0 18px;
          border-radius: 7px;
          background: #d6a928;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
        }

        @media (max-width: 600px) {
          .write-title {
            font-size: 23px;
          }

          .write-card {
            padding: 18px;
          }

          .write-textarea {
            min-height: 300px;
          }

          .write-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .write-actions {
            width: 100%;
          }

          .cancel-button,
          .submit-button {
            flex: 1;
          }
        }
      `}</style>


      {/* =========================
          제목
      ========================= */}

      <div className="write-header">
        <h1 className="write-title">
          ✏️ 글쓰기
        </h1>

        <p className="write-description">
          혜로로 회원들과 이야기를 나눠보세요.
        </p>
      </div>


      {/* =========================
          로그인 확인
      ========================= */}

      <div className="write-card">

        {!user ? (

          <div className="login-message">

            <div className="login-icon">
              🔒
            </div>

            <h2 className="login-title">
              로그인이 필요합니다.
            </h2>

            <p className="login-text">
              게시글을 작성하려면 먼저 로그인해주세요.
            </p>

            <Link
              href="/auth"
              className="login-button"
            >
              로그인 / 회원가입
            </Link>

          </div>

        ) : (

          <form
            action="/api/posts"
            method="POST"
          >

            {/* 제목 */}

            <div className="form-group">

              <label
                htmlFor="title"
                className="form-label"
              >
                제목 <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                className="write-input"
                placeholder="제목을 입력해주세요."
                required
                maxLength={100}
              />

            </div>


            {/* 내용 */}

            <div className="form-group">

              <label
                htmlFor="content"
                className="form-label"
              >
                내용 <span>*</span>
              </label>

              <textarea
                id="content"
                name="content"
                className="write-textarea"
                placeholder="내용을 입력해주세요."
                required
              />

            </div>


            {/* 하단 */}

            <div className="write-footer">

              <div className="write-notice">
                등록한 게시글은 커뮤니티 규칙에 따라 관리될 수 있습니다.
                <br />
                서로 존중하는 글을 작성해주세요.
              </div>

              <div className="write-actions">

                <Link
                  href="/board"
                  className="cancel-button"
                >
                  취소
                </Link>

                <button
                  type="submit"
                  className="submit-button"
                >
                  📝 게시글 등록
                </button>

              </div>

            </div>

          </form>

        )}

      </div>

    </main>
  );
}