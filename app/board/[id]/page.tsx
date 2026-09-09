import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CommentDeleteButton from "./CommentDeleteButton";
import LikeButton from "./LikeButton";
import PostDeleteButton from "./PostDeleteButton";
import ViewCountTracker from "./ViewCountTracker";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  // 현재 로그인한 사용자
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 게시글 조회
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      id,
      user_id,
      title,
      content,
      created_at,
      updated_at,
      view_count
    `)
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  // 게시글 작성자
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", post.user_id)
    .single();

  // 좋아요
  const { data: likes } = await supabase
    .from("post_likes")
    .select("id, user_id")
    .eq("post_id", post.id);

  const likeCount = likes?.length ?? 0;

  const userLiked = user
    ? (likes ?? []).some(
        (like) => like.user_id === user.id
      )
    : false;

  // 댓글
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      id,
      user_id,
      content,
      created_at
    `)
    .eq("post_id", post.id)
    .order("created_at", {
      ascending: true,
    });

  // 댓글 작성자 ID
  const commentUserIds = [
    ...new Set(
      (comments ?? []).map(
        (comment) => comment.user_id
      )
    ),
  ];

  // 댓글 작성자 프로필
  let commentProfiles: {
    id: string;
    nickname: string;
  }[] = [];

  if (commentUserIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", commentUserIds);

    commentProfiles = data ?? [];
  }

  // 댓글 닉네임
  const getCommentNickname = (
    userId: string
  ) => {
    const commentProfile =
      commentProfiles.find(
        (profile) =>
          profile.id === userId
      );

    return (
      commentProfile?.nickname ??
      "알 수 없는 사용자"
    );
  };

  // 날짜
  const createdDate = new Date(
    post.created_at
  );

  const formattedDate =
    createdDate.toLocaleDateString(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );

  const formattedTime =
    createdDate.toLocaleTimeString(
      "ko-KR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  return (
    <main className="post-page">

      <style>{`
        .post-page {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
        }

        /* =========================
           게시글 카드
        ========================= */

        .post-card {
          overflow: hidden;

          border: 1px solid #2a3039;
          border-radius: 12px;

          background: #0b0f15;

          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.25);
        }

        .post-header {
          padding: 28px 30px 22px;

          border-bottom: 1px solid #252b34;

          background: #0e131a;
        }

        .post-category {
          display: inline-flex;
          align-items: center;

          margin-bottom: 12px;
          padding: 5px 8px;

          border-radius: 4px;

          background: rgba(214, 169, 40, 0.12);
          color: #d6a928;

          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .post-title {
          margin: 0;

          color: #ffffff;

          font-size: 26px;
          font-weight: 900;
          line-height: 1.4;

          letter-spacing: -0.8px;

          word-break: break-word;
        }

        .post-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          gap: 9px;

          margin-top: 14px;

          color: #68717d;
          font-size: 12px;
        }

        .post-author {
          color: #c9ced5;
          font-weight: 700;
        }

        .meta-dot {
          color: #3f4650;
        }

        .post-body {
          min-height: 280px;

          padding: 34px 30px 42px;

          color: #d9dde3;

          font-size: 15px;
          line-height: 1.9;

          white-space: pre-wrap;
          word-break: break-word;
        }

        /* =========================
           버튼 영역
        ========================= */

        .post-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 16px;
        }

        .action-left,
        .action-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 40px;
          padding: 0 14px;

          border: 1px solid #343b46;
          border-radius: 7px;

          background: #11161e;
          color: #b9c0c9;

          font-size: 12px;
          font-weight: 700;

          transition:
            background 0.2s,
            border-color 0.2s,
            color 0.2s;
        }

        .action-button:hover {
          background: #171d26;
          border-color: #555e6c;
          color: #ffffff;
        }

        /* =========================
           댓글
        ========================= */

        .comment-card {
          margin-top: 20px;
          padding: 25px 30px;

          border: 1px solid #2a3039;
          border-radius: 12px;

          background: #0b0f15;

          box-shadow:
            0 10px 35px rgba(0, 0, 0, 0.2);
        }

        .comment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding-bottom: 18px;

          border-bottom: 1px solid #252b34;
        }

        .comment-title {
          margin: 0;

          color: #ffffff;

          font-size: 17px;
          font-weight: 800;
        }

        .comment-count {
          margin-left: 5px;

          color: #d6a928;

          font-size: 13px;
        }

        .comment-list {
          margin-top: 2px;
        }

        .comment-item {
          padding: 19px 0;

          border-bottom: 1px solid #20252d;
        }

        .comment-item:last-child {
          border-bottom: 0;
        }

        .comment-user {
          display: flex;
          align-items: center;
          gap: 9px;

          margin-bottom: 9px;
        }

        .comment-avatar {
          display: flex;
          align-items: center;
          justify-content: center;

          width: 28px;
          height: 28px;

          border-radius: 50%;

          background: #151b23;
          border: 1px solid #303743;

          font-size: 13px;
        }

        .comment-nickname {
          color: #dfe3e8;
          font-size: 12px;
          font-weight: 800;
        }

        .comment-time {
          color: #626b76;
          font-size: 10px;
        }

        .comment-content {
          padding-left: 37px;

          color: #c3c9d1;

          font-size: 13px;
          line-height: 1.7;

          white-space: pre-wrap;
          word-break: break-word;
        }

        .comment-delete {
          padding-left: 37px;
          margin-top: 8px;
        }

        /* =========================
           댓글 없음
        ========================= */

        .empty-comments {
          padding: 35px 0;

          text-align: center;

          color: #626b76;

          font-size: 12px;
        }

        .empty-comments-icon {
          margin-bottom: 8px;
          font-size: 25px;
        }

        /* =========================
           댓글 작성
        ========================= */

        .comment-form {
          margin-top: 20px;
          padding-top: 20px;

          border-top: 1px solid #252b34;
        }

        .comment-textarea {
          display: block;

          width: 100%;
          min-height: 105px;

          padding: 13px 14px;

          border: 1px solid #303743;
          border-radius: 8px;

          background: #0d1219;
          color: #f5f5f5;

          font-family: inherit;
          font-size: 13px;

          resize: vertical;
          outline: none;

          line-height: 1.6;
        }

        .comment-textarea:focus {
          border-color: #d6a928;

          box-shadow:
            0 0 0 2px
            rgba(214, 169, 40, 0.12);
        }

        .comment-textarea::placeholder {
          color: #626b76;
        }

        .comment-submit-area {
          display: flex;
          justify-content: flex-end;

          margin-top: 9px;
        }

        .comment-submit {
          min-height: 38px;

          padding: 0 15px;

          border: 1px solid #d6a928;
          border-radius: 7px;

          background: #d6a928;
          color: #111111;

          font-size: 12px;
          font-weight: 800;

          cursor: pointer;
        }

        .comment-submit:hover {
          background: #f0c43d;
        }

        /* =========================
           로그인 안내
        ========================= */

        .login-comment {
          margin-top: 20px;
          padding: 22px;

          border: 1px solid #252b34;
          border-radius: 8px;

          background: #0e131a;

          text-align: center;
        }

        .login-comment-text {
          margin: 0 0 12px;

          color: #737c88;
          font-size: 12px;
        }

        .login-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 38px;
          padding: 0 15px;

          border-radius: 7px;

          background: #d6a928;
          color: #111111;

          font-size: 12px;
          font-weight: 800;
        }

        /* =========================
           모바일
        ========================= */

        @media (max-width: 600px) {
          .post-header {
            padding: 22px 18px 18px;
          }

          .post-title {
            font-size: 21px;
          }

          .post-body {
            min-height: 240px;
            padding: 25px 18px 32px;
            font-size: 14px;
          }

          .post-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }

          .action-left,
          .action-right {
            width: 100%;
          }

          .action-right {
            justify-content: flex-end;
          }

          .action-button {
            min-height: 38px;
          }

          .comment-card {
            padding: 20px 18px;
          }

          .comment-content,
          .comment-delete {
            padding-left: 0;
          }
        }
      `}</style>


      {/* ==================================
          게시글
      ================================== */}

      <article className="post-card">

        <div className="post-header">

          <div className="post-category">
            FREE BOARD
          </div>

          <h1 className="post-title">
            {post.title}
          </h1>

          <div className="post-meta">

            <span className="post-author">
              {profile?.nickname ??
                "알 수 없는 사용자"}
            </span>

            <span className="meta-dot">
              ·
            </span>

            <span>
              {formattedDate}{" "}
              {formattedTime}
            </span>

            <span className="meta-dot">
              ·
            </span>

            <span>
              조회{" "}
              <ViewCountTracker
                postId={post.id}
                initialCount={
                  post.view_count ?? 0
                }
              />
            </span>

          </div>

        </div>


        {/* 내용 */}

        <div className="post-body">
          {post.content}
        </div>

      </article>


      {/* ==================================
          게시글 버튼
      ================================== */}

      <div className="post-actions">

        <div className="action-left">

          <Link
            href="/board"
            className="action-button"
          >
            ← 목록으로
          </Link>

        </div>


        <div className="action-right">

          {user?.id === post.user_id && (
            <Link
              href={`/board/${post.id}/edit`}
              className="action-button"
            >
              ✏️ 수정
            </Link>
          )}

          {user?.id === post.user_id && (
            <PostDeleteButton
              postId={post.id}
            />
          )}

          <LikeButton
            postId={post.id}
            initialLiked={userLiked}
            initialCount={likeCount}
            isLoggedIn={!!user}
          />

        </div>

      </div>


      {/* ==================================
          댓글
      ================================== */}

      <section className="comment-card">

        <div className="comment-header">

          <h2 className="comment-title">
            💬 댓글
            <span className="comment-count">
              {comments?.length ?? 0}
            </span>
          </h2>

        </div>


        {/* 댓글 목록 */}

        <div className="comment-list">

          {comments &&
          comments.length > 0 ? (

            comments.map((comment) => (

              <div
                key={comment.id}
                className="comment-item"
              >

                <div className="comment-user">

                  <div className="comment-avatar">
                    👤
                  </div>

                  <span className="comment-nickname">
                    {getCommentNickname(
                      comment.user_id
                    )}
                  </span>

                  <span className="comment-time">
                    ·{" "}
                    {new Date(
                      comment.created_at
                    ).toLocaleString(
                      "ko-KR"
                    )}
                  </span>

                </div>


                <div className="comment-content">
                  {comment.content}
                </div>


                {user?.id ===
                  comment.user_id && (

                  <div className="comment-delete">

                    <CommentDeleteButton
                      commentId={
                        comment.id
                      }
                    />

                  </div>

                )}

              </div>

            ))

          ) : (

            <div className="empty-comments">

              <div className="empty-comments-icon">
                💬
              </div>

              아직 댓글이 없습니다.
              <br />
              첫 번째 댓글을 남겨보세요.

            </div>

          )}

        </div>


        {/* 댓글 작성 */}

        {user ? (

          <form
            action="/api/comments"
            method="POST"
            className="comment-form"
          >

            <input
              type="hidden"
              name="post_id"
              value={post.id}
            />

            <textarea
              name="content"
              placeholder="댓글을 입력해주세요."
              rows={4}
              required
              maxLength={500}
              className="comment-textarea"
            />

            <div className="comment-submit-area">

              <button
                type="submit"
                className="comment-submit"
              >
                댓글 등록
              </button>

            </div>

          </form>

        ) : (

          <div className="login-comment">

            <p className="login-comment-text">
              댓글을 작성하려면
              로그인이 필요합니다.
            </p>

            <Link
              href="/auth"
              className="login-button"
            >
              로그인하기
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}