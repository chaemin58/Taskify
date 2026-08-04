/**
 * ISO 날짜 문자열을 한국식 날짜로 변환
 * @param dateString ISO Date String (예: 2026-04-30T20:43:01.640Z)
 * @returns yyyy년 m월 d일 형식의 문자열 (예: 2026년 4월 30일)
 */
export function getFormatDate(dateString: string) {
  const date = new Date(dateString);

  const dateStr = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return dateStr;
}

/**
 * ISO 날짜 문자열을 한국식 시간으로 변환
 * @param dateString ISO Date String (예: 2026-04-30T20:43:01.640Z)
 * @returns 오전/오후 HH:MM 형식의 문자열 (예: 오후 8:43)
 */
export function getFormatTime(dateString: string) {
  const date = new Date(dateString);

  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return timeStr;
}

/**
 * ISO 날짜 문자열을 날짜만(YYYY-MM-DD, UTC 기준)으로 변환
 * @param dateString ISO Date String (예: 2026-08-05T09:02:00.000Z)
 * @returns 예: 2026-08-05 (값이 없거나 잘못된 값이면 빈 문자열)
 */
export function getFormatDueDateShort(dateString?: string | null) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * ISO 날짜 문자열을 마감일 표시용(YYYY-MM-DD HH:mm, 24시간제, UTC 기준)으로 변환
 * @param dateString ISO Date String (예: 2026-08-05T09:02:00.000Z)
 * @returns 예: 2026-08-05 09:02 (값이 없거나 잘못된 값이면 빈 문자열)
 */
export function getFormatDueDate(dateString?: string | null) {
  const day = getFormatDueDateShort(dateString);
  if (!day) return "";

  const date = new Date(dateString as string);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const min = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day} ${hh}:${min}`;
}
