import Button from "@/elements/Button";
import Error from "@/elements/Error";
import Input from "@/elements/Input";
import { validateEmail } from "@/functions";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { loginAPI } from "@/pages/api/auth";
import routes from "@/routes";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";

const LoginUI: React.FC<{ isAdmin?: boolean }> = ({ isAdmin = false }) => {
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setError("");
    setLoading(true);

    loginAPI(
      { email: email.toLowerCase().trim(), password: password },
      () => {
        setLoading(false);
        router.push(routes.loading);
      },
      (err: string) => {
        setError(err);
        setLoading(false);
      }
    );
  };

  return (
    <Layouts type="auth" pageName={`${isAdmin ? "Admin " : ""}Login`}>
      <form onSubmit={submitHandler}>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Welcome!"
              text={`Please login to access your ${
                isAdmin ? "System Administrator " : ""
              }Portal`}
            />
          </Col>
        </Row>
        <Row className="rowGap2">
          <Col xs={12}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              setValue={setEmail}
              autoComplete="username"
              required
            />
          </Col>
          <Col xs={12}>
            <Input
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
              autoComplete="current-password"
              required
            />
          </Col>
          {error ? (
            <Col xs={12}>
              <Error error={error} />
            </Col>
          ) : null}
          <Col xs={12}>
            <Input label="Remember me" type="checkbox" name="remember" />
          </Col>
          <Col xs={12}>
            <Link href={routes.auth.users.verifyEmail} >
              <h6 className="forgetpass">Forgot Password</h6>
            </Link>
          </Col>
        </Row>

        <Row>
          <Col xs={12}>
            <div className="submitArea">
              <Button type="submit" isLoading={loading}>
                Login
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default LoginUI;
