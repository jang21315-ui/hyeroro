import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type BoardProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 10;

export default async function Board({
  searchParams,
}: BoardProps) {
  const params = await searchParams;

  const q = (params.q ?? "").trim();

  const currentPage = Math.max(
    1,
    Number(params.page ?? "1") || 1
  );

  const supabase = await createClient();

  /*
   * 게시글 전체 조회
   */
  let query = supabase
    .from("posts")
    .select(
      `
        id,
        title,
        created_at,
        profiles(nickname)
      `,
      {
        count: "exact",
      }
    )
    .order("created_at", {
      ascending: false,
    });

  /*
   * 제목 검색
   */
  if (q) {
    query = query.ilike(
      "title",
      `%${q}%`
    );
  }

  /*
   * 페이지 계산
   */
  const from =
    (currentPage - 1) * PAGE_SIZE;

  const to =
    from + PAGE_SIZE - 1;

  const {
    data: posts,
    count,
    error,
  } = await query.range(from, to);

  const totalCount = count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / PAGE_SIZE
    )
  );

  const hasPrevious =
    currentPage > 1;

  const hasNext =
    currentPage < totalPages;

  function makePageUrl(page: number) {
    const search = new URLSearchParams();

    if (q) {
      search.set("q", q);
    }

    search.set(
      "page",
      String(page)
    );

    return `/board?${search.toString()}`;
  }

  return (
    <main className="board-page">

      <style>{`
        .board-page {
          width: 100%;
        }

        /* =========================
           헤더
        ========================= */

        .board-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 20px;
        }

        .board-heading {
          margin: 0;

          color: #fff;

          font-size: 28px;
          font-weight: 900;

          letter-spacing: -1px;
        }

        .board-description {
          margin: 8px 0 0;

          color: #737c88;

          font-size: 13px;
        }

        .write-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          height: 40px;

          padding: 0 16px;

          border-radius: 7px;

          background: #d6a928;
          color: #111;

          font-size: 12px;
          font-weight: 900;

          text-decoration: none;

          white-space: nowrap;
        }

        .write-button:hover {
          background: #f0c43d;
        }

        /* =========================
           검색
        ========================= */

        .search-box {
          display: flex;

          gap: 8px;

          margin-bottom: 14px;
        }

        .search-input {
          flex: 1;

          height: 42px;

          padding: 0 13px;

          border: 1px solid #303743;
          border-radius: 7px;

          background: #0d1219;
          color: #fff;

          font-family: inherit;
          font-size: 13px;

          outline: none;
        }

        .search-input:focus {
          border-color: #d6a928;

          box-shadow:
            0 0 0 2px
            rgba(214, 169, 40, 0.1);
        }

        .search-input::placeholder {
          color: #626b76;
        }

        .search-button {
          min-width: 70px;

          border: 1px solid #d6a928;
          border-radius: 7px;

          background: #d6a928;
          color: #111;

          font-family: inherit;
          font-size: 12px;
          font-weight: 900;

          cursor: pointer;
        }

        .search-button:hover {
          background: #f0c43d;
        }

        /* =========================
           게시판
        ========================= */

        .board-card {
          overflow: hidden;

          border: 1px solid #2a3039;
          border-radius: 12px;

          background: #0b0f15;

          box-shadow:
            0 10px 35px
            rgba(0, 0, 0, 0.25);
        }

        .board-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 15px 18px;

          border-bottom: 1px solid #252b34;

          background: #0e131a;
        }

        .board-name {
          color: #dfe3e8;

          font-size: 12px;
          font-weight: 800;
        }

        .board-count {
          color: #626b76;

          font-size: 11px;
        }

        /* =========================
           게시글
        ========================= */

        .post-row {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            130px;

          min-height: 68px;

          padding: 12px 18px;

          border-bottom: 1px solid #202630;

          color: inherit;

          text-decoration: none;

          transition:
            background 0.15s;
        }

        .post-row:last-child {
          border-bottom: 0;
        }

        .post-row:hover {
          background: #111720;
        }

        .post-main {
          min-width: 0;

          display: flex;
          flex-direction: column;
          justify-content: center;

          gap: 6px;
        }

        .post-title {
          overflow: hidden;

          color: #f4f5f6;

          font-size: 14px;
          font-weight: 700;

          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .post-author {
          color: #626b76;

          font-size: 11px;
        }

        .post-date {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          color: #626b76;

          font-size: 11px;
        }

        /* =========================
           빈 게시판
        ========================= */

        .empty-board {
          padding: 70px 20px;

          color: #626b76;

          text-align: center;

          font-size: 13px;
        }

        /* =========================
           페이지네이션
        ========================= */

        .pagination {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 6px;

          padding: 20px;
        }

        .page-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-width: 34px;
          height: 34px;

          padding: 0 8px;

          border: 1px solid #303743;
          border-radius: 6px;

          background: #11161e;
          color: #aeb5be;

          font-size: 11px;
          font-weight: 700;

          text-decoration: none;
        }

        .page-button:hover {
          border-color: #d6a928;
          color: #fff;
        }

        .page-button.active {
          border-color: #d6a928;

          background: #d6a928;
          color: #111;
        }

        .page-button.disabled {
          opacity: 0.35;

          pointer-events: none;
        }

        /* =========================
           하단
        ========================= */

        .board-bottom {
          display: flex;
          justify-content: space-between;

          margin-top: 16px;

          color: #626b76;

          font-size: 11px;
        }

        /* =========================
           모바일
        ========================= */

        @media (max-width: 600px) {

          .board-header {
            align-items: flex-start;
          }

          .board-heading {
            font-size: 23px;
          }

          .post-row {
            grid-template-columns: 1fr;
          }

          .post-date {
            justify-content: flex-start;
          }

          .search-button {
            min-width: 60px;
          }

          .board-bottom {
            flex-direction: column;

            gap: 6px;
          }

          .pagination {
            overflow-x: auto;
            justify-content: flex-start;
          }
        }
      `}</style>


      {/* =========================
          헤더
      ========================= */}

      <div className="board-header">

        <div>

          <h1 className="board-heading">
            💬 자유게시판
          </h1>

          <p className="board-description">
            혜로로 회원들과 자유롭게 이야기를 나눠보세요.
          </p>

        </div>

        <Link
          href="/board/write"
          className="write-button"
        >
          ✏️ 글쓰기
        </Link>

      </div>


      {/* =========================
          검색
      ========================= */}

      <form
        action="/board"
        method="GET"
        className="search-box"
      >

        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="게시글 제목을 검색해주세요."
          className="search-input"
        />

        <button
          type="submit"
          className="search-button"
        >
          검색
        </button>

      </form>


      {/* =========================
          게시판
      ========================= */}

      <div className="board-card">

        <div className="board-top">

          <span className="board-name">
            {q
              ? `"${q}" 검색 결과`
              : "전체 게시글"}
          </span>

          <span className="board-count">
            총 {totalCount}개
          </span>

        </div>


        {error ? (

          <div className="empty-board">
            게시글을 불러오지 못했습니다.
          </div>

        ) : !posts ||
          posts.length === 0 ? (

          <div className="empty-board">

            {q
              ? "검색 결과가 없습니다."
              : "아직 작성된 게시글이 없습니다."}

          </div>

        ) : (

          posts.map((post: any) => (

            <Link
              href={`/board/${post.id}`}
              key={post.id}
              className="post-row"
            >

              <div className="post-main">

                <span className="post-title">
                  {post.title}
                </span>

                <span className="post-author">
                  {post.profiles?.nickname ??
                    "회원"}
                </span>

              </div>

              <span className="post-date">
                {new Date(
                  post.created_at
                ).toLocaleDateString(
                  "ko-KR"
                )}
              </span>

            </Link>

          ))

        )}


        {/* =========================
            페이지네이션
        ========================= */}

        {totalPages > 1 && (

          <div className="pagination">

            <Link
              href={
                hasPrevious
                  ? makePageUrl(
                      currentPage - 1
                    )
                  : "#"
              }
              className={`page-button ${
                !hasPrevious
                  ? "disabled"
                  : ""
              }`}
            >
              ‹
            </Link>


            {Array.from(
              {
                length: totalPages,
              },
              (_, index) =>
                index + 1
            ).map((page) => (

              <Link
                key={page}
                href={makePageUrl(page)}
                className={`page-button ${
                  page === currentPage
                    ? "active"
                    : ""
                }`}
              >
                {page}
              </Link>

            ))}


            <Link
              href={
                hasNext
                  ? makePageUrl(
                      currentPage + 1
                    )
                  : "#"
              }
              className={`page-button ${
                !hasNext
                  ? "disabled"
                  : ""
              }`}
            >
              ›
            </Link>

          </div>

        )}

      </div>


      {/* =========================
          하단
      ========================= */}

      <div className="board-bottom">

        <span>
          💡 서로를 존중하며 즐거운 커뮤니티를 만들어주세요.
        </span>

        <span>
          HYE RORO
        </span>

      </div>

    </main>
  );
}