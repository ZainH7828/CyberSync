import { useContext, useState } from "react";
import Input from "@/elements/Input";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import { useRouter } from "next/router";
import axios from "axios";
import Error from "@/elements/Error";
import { MainContext } from "@/context";
import { verifyEmailAPI } from "../api/auth";
import { updatePasswordAPI } from "../api/auth";
import otp from "../otp-verification/otp";




const VerifyEmail = () => {
  const context = useContext(MainContext);
  const [email, setEmail] = useState<string>(""); // Track email input
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Track error message
  const router = useRouter();

  // Function to handle API call
  const handleVerifyEmail = async () => {
    setLoading(true);
    setError(null);

    try {
      verifyEmailAPI(
        { email: email.toLowerCase().trim() },
        (res) => {
          setLoading(false);
          localStorage.setItem("forgotPassEmail", email);
          router.push(routes.auth.users.verifyOtp);
        },
        (err: string) => {
          setLoading(false);
          setError(err || "Failed to send email. Please try again.");
        }
      );

      // const response = await axios.post(
      //   "http://localhost:3000/api/auth/forget-password",
      //   {
      //     email,
      //   }
      // );

      // if (response.status === 200) {
      //   router.push(routes.auth.users.verifyOtp);
      // }
    } catch (err: any) {
      // Handle errors
      setError(
        err.response?.data?.message || "Failed to send email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layouts type="auth" pageName="Verify Email">
      <Row>
        <Col xs={12}>
          <AuthHeading
            heading="Enter Your Email"
            text="Please provide your email and we'll send you a link to set your new password"
          />
        </Col>
      </Row>
      <Row className="rowGap2">
        <Col xs={12}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(value: string) => setEmail(value)}
            required
          />
        </Col>
      </Row>
      {error && (
        <Row>
          <Col xs={12}>
            <Error error={error} />
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={12}>
          <div className="submitArea">
            <Button
              type="button"
              isLoading={loading}
              isFullWitdh
              onClick={handleVerifyEmail}
            >
              Verify Email
            </Button>
          </div>
        </Col>
      </Row>
    </Layouts>
  );
};

export default VerifyEmail;
