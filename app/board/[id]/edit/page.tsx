"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();

  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data: post, error } =
        await supabase
          .from("posts")
          .select(
            "id, user_id, title, content"
          )
          .eq("id", postId)
          .single();

      if (error || !post) {
        setError(
          "게시글을 찾을 수 없습니다."
        );
        setLoading(false);
        return;
      }

      if (post.user_id !== user.id) {
        setError(
          "본인이 작성한 게시글만 수정할 수 있습니다."
        );
        setLoading(false);
        return;
      }

      setTitle(post.title);
      setContent(post.content);

      setLoading(false);
    }

    loadPost();
  }, [postId, router]);


  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setSaving(true);
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 필요합니다.");
      setSaving(false);
      return;
    }

    const { error: updateError } =
      await supabase
        .from("posts")
        .update({
          title: title.trim(),
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId)
        .eq("user_id", user.id);

    if (updateError) {
      console.error(
        "게시글 수정 오류:",
        updateError
      );

      setError(
        updateError.message ||
          "게시글 수정에 실패했습니다."
      );

      setSaving(false);
      return;
    }

    router.push(`/board/${postId}`);
    router.refresh();
  }


  /* =========================
     불러오는 중
  ========================= */

  if (loading) {
    return (
      <main className="edit-page">

        <style>{`
          .edit-page {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
          }

          .edit-loading {
            padding: 70px 20px;

            border: 1px solid #2a3039;
            border-radius: 12px;

            background: #0b0f15;

            color: #737c88;

            text-align: center;
            font-size: 13px;
          }
        `}</style>

        <div className="edit-loading">
          게시글을 불러오는 중입니다...
        </div>

      </main>
    );
  }


  /* =========================
     오류
  ========================= */

  if (error && !title && !content) {
    return (
      <main className="edit-page">

        <style>{`
          .edit-page {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
          }

          .error-card {
            padding: 50px 30px;

            border: 1px solid #2a3039;
            border-radius: 12px;

            background: #0b0f15;

            text-align: center;
          }

          .error-icon {
            margin-bottom: 14px;
            font-size: 35px;
          }

          .error-title {
            margin: 0;

            color: #ffffff;

            font-size: 20px;
            font-weight: 800;
          }

          .error-message {
            margin: 10px 0 22px;

            color: #d96b73;

            font-size: 13px;
          }

          .back-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;

            height: 40px;
            padding: 0 16px;

            border: 1px solid #343b46;
            border-radius: 7px;

            background: #11161e;
            color: #c3c9d1;

            font-size: 12px;
            font-weight: 700;

            cursor: pointer;
          }

          .back-button:hover {
            background: #171d26;
            color: #ffffff;
          }
        `}</style>

        <div className="error-card">

          <div className="error-icon">
            ⚠️
          </div>

          <h1 className="error-title">
            게시글 수정
          </h1>

          <p className="error-message">
            {error}
          </p>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              router.push(
                `/board/${postId}`
              )
            }
          >
            ← 게시글로 돌아가기
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="edit-page">

      <style>{`
        .edit-page {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* =========================
           제목
        ========================= */

        .edit-header {
          margin-bottom: 20px;
        }

        .edit-title {
          margin: 0;

          color: #ffffff;

          font-size: 28px;
          font-weight: 900;

          letter-spacing: -1px;
        }

        .edit-description {
          margin: 8px 0 0;

          color: #737c88;

          font-size: 13px;
        }

        /* =========================
           카드
        ========================= */

        .edit-card {
          padding: 28px;

          border: 1px solid #2a3039;
          border-radius: 12px;

          background: #0b0f15;

          box-shadow:
            0 10px 35px
            rgba(0, 0, 0, 0.25);
        }

        /* =========================
           입력
        ========================= */

        .form-group {
          margin-bottom: 22px;
        }

        .form-label {
          display: block;

          margin-bottom: 9px;

          color: #dfe3e8;

          font-size: 13px;
          font-weight: 800;
        }

        .form-input,
        .form-textarea {
          display: block;

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

        .form-input {
          height: 48px;

          padding: 0 15px;
        }

        .form-textarea {
          min-height: 400px;

          padding: 15px;

          resize: vertical;

          line-height: 1.7;
        }

        .form-input:focus,
        .form-textarea:focus {
          border-color: #d6a928;

          box-shadow:
            0 0 0 2px
            rgba(214, 169, 40, 0.12);
        }

        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #626b76;
        }

        /* =========================
           오류 메시지
        ========================= */

        .form-error {
          margin: 0 0 18px;

          padding: 12px 14px;

          border: 1px solid #47282d;
          border-radius: 7px;

          background: #160e11;

          color: #e07b83;

          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================
           하단
        ========================= */

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 24px;
          padding-top: 20px;

          border-top: 1px solid #252b34;
        }

        .edit-tip {
          color: #626b76;

          font-size: 11px;
          line-height: 1.6;
        }

        .form-actions {
          display: flex;
          gap: 9px;
        }

        .cancel-button,
        .submit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 85px;
          height: 42px;

          padding: 0 17px;

          border-radius: 7px;

          font-size: 12px;
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

        .cancel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-button {
          border: 1px solid #d6a928;

          background: #d6a928;
          color: #111111;
        }

        .submit-button:hover {
          background: #f0c43d;
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* =========================
           모바일
        ========================= */

        @media (max-width: 600px) {
          .edit-title {
            font-size: 23px;
          }

          .edit-card {
            padding: 18px;
          }

          .form-textarea {
            min-height: 300px;
          }

          .form-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .form-actions {
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

      <div className="edit-header">

        <h1 className="edit-title">
          ✏️ 게시글 수정
        </h1>

        <p className="edit-description">
          작성한 게시글의 내용을 수정할 수 있습니다.
        </p>

      </div>


      {/* =========================
          수정 카드
      ========================= */}

      <div className="edit-card">

        <form onSubmit={handleSubmit}>

          {/* 제목 */}

          <div className="form-group">

            <label
              htmlFor="title"
              className="form-label"
            >
              제목
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="제목을 입력해주세요."
              maxLength={100}
              disabled={saving}
              className="form-input"
            />

          </div>


          {/* 내용 */}

          <div className="form-group">

            <label
              htmlFor="content"
              className="form-label"
            >
              내용
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="내용을 입력해주세요."
              rows={15}
              disabled={saving}
              className="form-textarea"
            />

          </div>


          {/* 오류 */}

          {error && (
            <p className="form-error">
              ⚠️ {error}
            </p>
          )}


          {/* 하단 */}

          <div className="form-footer">

            <div className="edit-tip">
              수정한 내용은 바로 게시글에 반영됩니다.
              <br />
              내용을 확인한 후 수정 완료를 눌러주세요.
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  router.push(
                    `/board/${postId}`
                  )
                }
                disabled={saving}
              >
                취소
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={saving}
              >
                {saving
                  ? "수정 중..."
                  : "✓ 수정 완료"}
              </button>

            </div>

          </div>

        </form>

      </div>

    </main>
  );
}