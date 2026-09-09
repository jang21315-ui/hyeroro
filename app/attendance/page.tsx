"use client";

import { useEffect, useMemo, useState } from "react";

type AttendanceStatus = {
  checked: boolean;
  minerals?: number;
};

type StreakStatus = {
  streak: number;
};

export default function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState("");

  const [status, setStatus] =
    useState<AttendanceStatus | null>(null);

  const [attendanceDates, setAttendanceDates] =
    useState<string[]>([]);

  const [calendarLoading, setCalendarLoading] =
    useState(true);

  const [streak, setStreak] = useState(0);

  const [streakLoading, setStreakLoading] =
    useState(true);

  /* ========================================
     오늘 날짜
  ======================================== */

  const today = new Date();

  const todayString = today.toLocaleDateString(
    "en-CA",
    {
      timeZone: "Asia/Seoul",
    }
  );

  /* ========================================
     출석 상태 확인
  ======================================== */

  const loadAttendanceStatus = async () => {
    try {
      const response = await fetch(
        "/api/attendance/status",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        setChecking(false);
        return;
      }

      const data = await response.json();

      setStatus({
        checked: data.checked ?? false,
        minerals: data.minerals,
      });
    } catch (error) {
      console.error(
        "출석 상태 확인 오류:",
        error
      );
    } finally {
      setChecking(false);
    }
  };

  /* ========================================
     출석 기록 불러오기
  ======================================== */

  const loadCalendar = async () => {
    try {
      const response = await fetch(
        "/api/attendance/calendar",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      if (data.success) {
        setAttendanceDates(
          data.dates ?? []
        );
      }
    } catch (error) {
      console.error(
        "출석 기록 조회 오류:",
        error
      );
    } finally {
      setCalendarLoading(false);
    }
  };

  /* ========================================
     연속 출석 불러오기
  ======================================== */

  const loadStreak = async () => {
    try {
      const response = await fetch(
        "/api/attendance/streak",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const data =
        await response.json();

      setStreak(data.streak ?? 0);
    } catch (error) {
      console.error(
        "연속 출석 조회 오류:",
        error
      );
    } finally {
      setStreakLoading(false);
    }
  };

  /* ========================================
     초기 데이터 로드
  ======================================== */

  useEffect(() => {
    loadAttendanceStatus();
    loadCalendar();
    loadStreak();
  }, []);

  /* ========================================
     출석체크
  ======================================== */

  const handleAttendance = async () => {
    if (
      loading ||
      status?.checked
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/attendance/check",
        {
          method: "POST",
        }
      );

      const data =
        await response.json();

      if (data.success) {
        setMessage(
          `${data.message} +${data.reward} 미네랄`
        );

        setStatus({
          checked: true,
          minerals:
            typeof data.minerals ===
            "number"
              ? data.minerals
              : status?.minerals,
        });

        await loadCalendar();
        await loadStreak();
      } else {
        setMessage(
          data.message ??
            "출석 처리에 실패했습니다."
        );

        if (
          data.alreadyChecked ===
          true
        ) {
          setStatus({
            checked: true,
            minerals:
              typeof data.minerals ===
              "number"
                ? data.minerals
                : status?.minerals,
          });
        }
      }
    } catch (error) {
      console.error(
        "출석체크 오류:",
        error
      );

      setMessage(
        "출석 처리 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ========================================
     이번 달 정보
  ======================================== */

  const year =
    today.getFullYear();

  const month =
    today.getMonth();

  const monthName =
    `${year}년 ${month + 1}월`;

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  /* ========================================
     달력 날짜 생성
  ======================================== */

  const calendarDays = useMemo(() => {
    const days: (
      number | null
    )[] = [];

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      days.push(day);
    }

    return days;
  }, [
    firstDay,
    daysInMonth,
  ]);

  /* ========================================
     이번 달 출석 횟수
  ======================================== */

  const thisMonthAttendanceCount =
    attendanceDates.filter(
      (date) => {
        return date.startsWith(
          `${year}-${String(
            month + 1
          ).padStart(2, "0")}`
        );
      }
    ).length;

  /* ========================================
     특정 날짜 출석 여부
  ======================================== */

  const isAttendanceDay = (
    day: number
  ) => {
    const dateString =
      `${year}-${String(
        month + 1
      ).padStart(
        2,
        "0"
      )}-${String(
        day
      ).padStart(
        2,
        "0"
      )}`;

    return attendanceDates.includes(
      dateString
    );
  };

  /* ========================================
     화면
  ======================================== */

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0d10",
        color: "#fff",
        padding: "50px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >

        {/* ==================================
            출석체크 카드
        ================================== */}

        <div
          style={{
            background: "#15191f",
            border:
              "1px solid #2b3139",
            borderRadius: "16px",
            padding: "35px",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >

          {/* 아이콘 */}

          <div
            style={{
              fontSize: "46px",
              marginBottom: "12px",
            }}
          >
            📅
          </div>

          {/* 제목 */}

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#d6a928",
              fontWeight: 900,
            }}
          >
            출석체크
          </h1>

          {/* 설명 */}

          <p
            style={{
              color: "#9ca3af",
              marginTop: "12px",
              fontSize: "14px",
            }}
          >
            매일 출석하고 미네랄을
            받아보세요.
          </p>

          {/* ==================================
              오늘의 보상
          ================================== */}

          <div
            style={{
              marginTop: "24px",
              padding: "15px",
              background: "#0f1318",
              border:
                "1px solid #252b33",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                color: "#6b7280",
                fontSize: "12px",
              }}
            >
              오늘의 출석 보상
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#4fd1c5",
                fontSize: "21px",
                fontWeight: 900,
              }}
            >
              ⛏️ +10 미네랄
            </div>
          </div>

          {/* ==================================
              현재 미네랄
          ================================== */}

          {status?.minerals !==
            undefined && (
            <div
              style={{
                marginTop: "12px",
                color: "#737b86",
                fontSize: "12px",
              }}
            >
              현재 보유 미네랄{" "}
              <span
                style={{
                  color: "#4fd1c5",
                  fontWeight: 800,
                }}
              >
                {status.minerals.toLocaleString()}
              </span>
            </div>
          )}

          {/* ==================================
              출석 버튼
          ================================== */}

          <button
            onClick={
              handleAttendance
            }
            disabled={
              loading ||
              checking ||
              status?.checked === true
            }
            style={{
              marginTop: "28px",
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "10px",

              background:
                checking
                  ? "#555"
                  : status?.checked
                  ? "#263b38"
                  : loading
                  ? "#555"
                  : "#d6a928",

              color:
                status?.checked
                  ? "#4fd1c5"
                  : "#111",

              fontSize: "17px",
              fontWeight: 700,

              cursor:
                loading ||
                checking ||
                status?.checked
                  ? "default"
                  : "pointer",

              transition:
                "all 0.2s ease",
            }}
          >
            {checking
              ? "출석 상태 확인 중..."
              : loading
              ? "출석 처리 중..."
              : status?.checked
              ? "오늘 출석 완료 ✓"
              : "오늘 출석하기"}
          </button>

          {/* ==================================
              결과 메시지
          ================================== */}

          {message && (
            <div
              style={{
                marginTop: "18px",
                padding: "13px",
                borderRadius: "10px",
                background:
                  "#20252c",
                color: "#fff",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}
        </div>


        {/* ==================================
            이번 달 출석 현황
        ================================== */}

        <div
          style={{
            marginTop: "20px",
            background: "#15191f",
            border:
              "1px solid #2b3139",
            borderRadius: "16px",
            padding: "28px",
            boxSizing: "border-box",
          }}
        >

          {/* 제목 */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#fff",
              }}
            >
              📊 {monthName} 출석현황
            </h2>

            <div
              style={{
                color: "#4fd1c5",
                fontSize: "14px",
                fontWeight: 800,
              }}
            >
              {thisMonthAttendanceCount}
              일 출석
            </div>
          </div>


          {/* ==================================
              통계
          ================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "10px",
              marginBottom: "20px",
            }}
          >

            {/* 이번 달 출석 */}

            <div
              style={{
                background: "#101419",
                border:
                  "1px solid #252b33",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#737b86",
                  fontSize: "11px",
                }}
              >
                이번 달 출석
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#4fd1c5",
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {thisMonthAttendanceCount}
                일
              </div>
            </div>


            {/* 연속 출석 */}

            <div
              style={{
                background: "#101419",
                border:
                  "1px solid #252b33",
                borderRadius: "10px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#737b86",
                  fontSize: "11px",
                }}
              >
                🔥 연속 출석
              </div>

              <div
                style={{
                  marginTop: "5px",
                  color: "#d6a928",
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {streakLoading
                  ? "-"
                  : `${streak}일`}
              </div>
            </div>

          </div>


          {/* ==================================
              요일
          ================================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(7, 1fr)",
              gap: "6px",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            {[
              "일",
              "월",
              "화",
              "수",
              "목",
              "금",
              "토",
            ].map((day) => (
              <div
                key={day}
                style={{
                  color:
                    day === "일"
                      ? "#ff6675"
                      : day === "토"
                      ? "#66aaff"
                      : "#727b86",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding:
                    "7px 0",
                }}
              >
                {day}
              </div>
            ))}
          </div>


          {/* ==================================
              달력
          ================================== */}

          {calendarLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                color: "#727b86",
                fontSize: "13px",
              }}
            >
              출석 기록을
              불러오는 중...
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: "6px",
              }}
            >
              {calendarDays.map(
                (
                  day,
                  index
                ) => {
                  if (
                    day === null
                  ) {
                    return (
                      <div
                        key={`empty-${index}`}
                        style={{
                          minHeight:
                            "46px",
                        }}
                      />
                    );
                  }

                  const checked =
                    isAttendanceDay(
                      day
                    );

                  const dateString =
                    `${year}-${String(
                      month + 1
                    ).padStart(
                      2,
                      "0"
                    )}-${String(
                      day
                    ).padStart(
                      2,
                      "0"
                    )}`;

                  const isToday =
                    dateString ===
                    todayString;

                  return (
                    <div
                      key={day}
                      style={{
                        minHeight:
                          "46px",
                        borderRadius:
                          "9px",

                        background:
                          checked
                            ? "#263b38"
                            : "#101419",

                        border:
                          isToday
                            ? "1px solid #d6a928"
                            : "1px solid #20262d",

                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        position:
                          "relative",
                      }}
                    >
                      <span
                        style={{
                          fontSize:
                            "13px",

                          color:
                            isToday
                              ? "#d6a928"
                              : checked
                              ? "#fff"
                              : "#737b86",

                          fontWeight:
                            isToday ||
                            checked
                              ? 800
                              : 500,
                        }}
                      >
                        {day}
                      </span>

                      {checked && (
                        <span
                          style={{
                            color:
                              "#4fd1c5",
                            fontSize:
                              "10px",
                            marginTop:
                              "2px",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}


          {/* ==================================
              안내
          ================================== */}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "18px",
              borderTop:
                "1px solid #252b33",
              color: "#59636e",
              fontSize: "11px",
              lineHeight: 1.7,
              textAlign: "center",
            }}
          >
            하루에 한 번
            출석할 수 있습니다.
            <br />
            출석 시 +10 미네랄이
            지급됩니다.
          </div>

        </div>

      </div>
    </main>
  );
}