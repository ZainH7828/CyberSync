import { useState } from "react";
import Input from "@/elements/Input";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import { useRouter } from "next/router";
import { resetPasswordAPI } from "../api/auth";

const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle password reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const email = localStorage.getItem("forgotPassEmail");
    const otp = localStorage.getItem("otp");
    if (!email || !otp) {
      setError("Invalid request. Please try again.");
      setLoading(false);
      return;
    }

    const data = {
      email,
      otp: +otp,
      password: password,
      rePassword: confirmPassword,
    };

    setLoading(true);
    setError(null);

    try {
      resetPasswordAPI(
        data,
        (res) => {
          setLoading(false);
          if (res.success) {
            localStorage.removeItem("forgotPassEmail");
            localStorage.removeItem("otp");
            router.push(routes.auth.users.login)
          }
          else setError("Invalid OTP. Please try again.");
        },
        (err: string) => {
          setLoading(false);
          setError(err || "Failed to send email. Please try again.");
        }
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layouts type="auth" pageName="Reset Password">
      <form onSubmit={handleResetPassword}>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Reset Your Password"
              text="Please provide your new password."
            />
          </Col>
        </Row>
        <Row className="rowGap2">
          <Col xs={12}>
            <Input
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
              required
            />
          </Col>
          <Col xs={12}>
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              setValue={setConfirmPassword}
              required
            />
          </Col>
        </Row>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Row>
          <Col xs={12}>
            <div className="submitArea">
              <Button type="submit" isLoading={loading} isFullWitdh>
                Reset Password
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default ResetPassword;
