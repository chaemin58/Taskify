"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signup } from "@/actions/auth";
import { AuthForm } from "@/components/AuthForm/AuthForm";
import { Checkbox } from "@/components/Checkbox";
import { Dialog } from "@/components/dialog/Dialog";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import {
  validationEmail,
  validationNickname,
  validationPassword,
  validationPasswordCheck,
} from "@/utils/authValidation";

export default function SignupPage() {
  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  const router = useRouter();

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEmailError(validationEmail(e.target.value));
  };

  const handleNicknameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setNicknameError(validationNickname(e.target.value));
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPasswordError(validationPassword(e.target.value));
  };

  const handleConfirmPasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const password = document.getElementById("password") as HTMLInputElement;
    if (password.value !== e.target.value) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmPasswordError(validationPassword(e.target.value));
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    if (isSuccess) {
      router.push("/mydashboard");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = `${formData.get("email") || ""}`;
    const password = `${formData.get("password") || ""}`;
    const confirmPassword = `${formData.get("passwordCheck") || ""}`;
    const nickname = `${formData.get("nickname") || ""}`;

    const newEmailError = validationEmail(email);
    const newPasswordError = validationPassword(password);
    const newConfirmPasswordError = validationPasswordCheck(
      password,
      confirmPassword
    );
    const newNicknameError = validationNickname(nickname);

    setEmailError(newEmailError);
    setPasswordError(newPasswordError);
    setConfirmPasswordError(newConfirmPasswordError);
    setNicknameError(newNicknameError);

    if (
      newEmailError ||
      newPasswordError ||
      newConfirmPasswordError ||
      newNicknameError
    ) {
      return;
    }

    if (!isAgreed) {
      setIsDialogOpen(true);
      setDialogMessage("모든 약관에 동의해주세요.");
      return;
    }

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    });

    const result = await response.json();

    setIsSuccess(result.success);

    if (!result.success) {
      setIsSuccess(false);
      setDialogMessage(result.message);
      setIsDialogOpen(true);
      return;
    }
    setIsSuccess(true);
    setDialogMessage(result.message ?? "회원가입이 완료되었습니다.");
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen items-center justify-center px-6">
      <AuthForm type="signup" onSubmit={handleSubmit}>
        <Input errorMessage={emailError}>
          <Label htmlFor="email">이메일</Label>
          <Input.Wrapper>
            <Input.Field
              type="text"
              id="email"
              name="email"
              placeholder="이메일을 입력해주세요."
              onBlur={handleEmailBlur}
            />
          </Input.Wrapper>
          <Input.Error />
        </Input>

        <Input errorMessage={nicknameError}>
          <Label htmlFor="nickname">닉네임</Label>
          <Input.Wrapper>
            <Input.Field
              type="text"
              id="nickname"
              name="nickname"
              placeholder="닉네임을 입력해주세요"
              onBlur={handleNicknameBlur}
            />
          </Input.Wrapper>
          <Input.Error />
        </Input>

        <Input errorMessage={passwordError}>
          <Label htmlFor="password">비밀번호</Label>
          <Input.Wrapper>
            <Input.Field
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력해주세요"
              onBlur={handlePasswordBlur}
            />
            <Input.PasswordToggle />
          </Input.Wrapper>
          <Input.Error />
        </Input>

        <Input errorMessage={confirmPasswordError}>
          <Label htmlFor="passwordCheck">비밀번호 확인</Label>
          <Input.Wrapper>
            <Input.Field
              type="password"
              id="passwordCheck"
              name="passwordCheck"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              onBlur={handleConfirmPasswordBlur}
            />
            <Input.PasswordToggle />
          </Input.Wrapper>
          <Input.Error />
        </Input>

        <Checkbox
          checked={isAgreed}
          onChange={() => setIsAgreed((prev) => !prev)}
          description="모든 약관에 동의합니다."
        />
      </AuthForm>

      {isDialogOpen && (
        <Dialog
          description={dialogMessage}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
    </div>
  );
}
