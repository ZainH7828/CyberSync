import { useState } from "react";
import Input from "@/elements/Input";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import { useRouter } from "next/router";
import axios from "axios";
import CodeEntryField from "./otp";
import { verifyEmailAPI, verifyOTPAPI } from "../api/auth";

const VerifyOtp = () => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // For navigation

  // Handle OTP submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = localStorage.getItem("forgotPassEmail");
    if (!email) {
      setError("Email not found. Please try again.");
      setLoading(false);
      return;
    }

    const data = {
      email: email,
      otp: +otp,
    };

    try {
      verifyOTPAPI(
        data,
        (res) => {
          setLoading(false);
          if (res.success) {
            localStorage.setItem("otp", otp);
            router.push(routes.auth.users.resetPassword);
          } else setError("Invalid OTP. Please try again.");
        },
        (err: string) => {
          setLoading(false);
          setError(err || "Failed to send email. Please try again.");
        }
      );
    } catch (err: any) {
      // Handle error
      setError(
        err.response?.data?.message || "An error occurred while verifying OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layouts type="auth" pageName="Otp Verification">
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Verify Your Code"
              text="Please provide your OTP so you can reset your password."
            />
          </Col>
        </Row>
        <CodeEntryField
          value={otp}
          onChange={(value: string) => setOtp(value)}
          // onChange={(value: string) => setOtp(value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Row>
          <Col xs={12}>
            <div className="submitArea">
              <Button type="submit" isLoading={loading} isFullWitdh>
                Verify
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default VerifyOtp;