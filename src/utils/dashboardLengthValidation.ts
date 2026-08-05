/**
 * @description 대시보드 제목 길이 검사
 * @param title - 대시보드 제목
 * @returns 에러 메시지
 */

export const validateDashboardTitle = (title: string) => {
  return title.length <= 12 ? "" : "12자 이하으로 작성해주세요.";
};
