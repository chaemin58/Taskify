"use client";

import Image from "next/image";
import { useState } from "react";

import { login } from "@/actions/auth";
import LoginImg from "@/assets/img-login.png";
import { AuthForm } from "@/components/AuthForm/AuthForm";
import { Dialog } from "@/components/dialog/Dialog";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { validationEmail, validationPassword } from "@/utils/authValidation";

export default function LoginPage() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setEmailError(validationEmail(e.target.value));
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setPasswordError(validationPassword(e.target.value));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = `${formData.get("email") || ""}`;
    const password = `${formData.get("password") || ""}`;

    const newEmailError = validationEmail(email);
    const newPasswordError = validationPassword(password);

    setEmailError(newEmailError);
    setPasswordError(newPasswordError);

    if (newEmailError || newPasswordError) {
      return;
    }

    const response = await login(formData);
    if (!response.success) {
      setMessage(response.message);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center px-6 xl:gap-x-40">
      <AuthForm type="login" onSubmit={handleSubmit}>
        <Input errorMessage={emailError}>
          <Label htmlFor="email">아이디</Label>
          <Input.Wrapper>
            <Input.Field
              type="text"
              id="email"
              name="email"
              placeholder="아이디를 입력해주세요."
              onBlur={handleEmailBlur}
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
              placeholder="8자 이상 입력해주세요."
              onBlur={handlePasswordBlur}
            />
            <Input.PasswordToggle />
          </Input.Wrapper>
          <Input.Error />
        </Input>
      </AuthForm>

      <Image
        src={LoginImg}
        alt="image"
        width={900}
        height={920}
        className="hidden xl:block"
        loading="eager"
      />

      {isDialogOpen && (
        <Dialog
          description={message}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}
