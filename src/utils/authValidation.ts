import { AUTH_ERROR_MESSAGE } from "@/constants/Auth";

/**
 * @description 이메일 유효성 검사
 * @param email - 이메일
 * @returns 에러 메시지
 */
export function validationEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return emailRegex.test(email) ? "" : AUTH_ERROR_MESSAGE.EMAIL_ERROR;
}

/**
 * @description 비밀번호 유효성 검사
 * @param password - 비밀번호
 * @returns 에러 메시지
 */
export function validationPassword(password: string) {
  return password.length >= 8 ? "" : AUTH_ERROR_MESSAGE.PASSWORD_ERROR;
}

/**
 * @description 비밀번호 중복 검사
 * @param password - 비밀번호
 * @returns 에러 메시지
 */
export function validationPasswordCheck(
  password: string,
  passwordCheck: string
) {
  return password === passwordCheck
    ? ""
    : AUTH_ERROR_MESSAGE.PASSWORD_CHECK_ERROR;
}

/**
 * @description 닉네임 유효성 검사
 * @param nickname - 닉네임
 * @returns 에러 메시지
 */
export function validationNickname(nickname: string) {
  return nickname.length <= 10 ? "" : AUTH_ERROR_MESSAGE.NICKNAME_ERROR;
}
