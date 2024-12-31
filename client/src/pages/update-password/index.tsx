import { useContext, useState } from "react";
import Input from "@/elements/Input";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import { Col, Row } from "react-bootstrap";
import Button from "@/elements/Button";
import routes from "@/routes";
import { useRouter } from "next/router";
import { logoutAPI, updatePasswordAPI } from "../api/auth";
import Error from "@/elements/Error";
import { MainContext } from "@/context";

const UpdatePassword = () => {
  const context = useContext(MainContext);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const router = useRouter();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    updatePasswordAPI(
      { newPassword: password },
      () => {
        logoutAPI(() => {
          if (context) {
            context.userData.set(undefined);
            context.organizationData.set(undefined);
          }
          setTimeout(() => {
            setLoading(false);
            router.push(routes.auth.users.login);
          }, 500);
        });
      },
      (err: string) => {
        setError(err);
        setLoading(false);
      }
    );
  };
  return (
    <Layouts type="auth" pageName="Update Password">
      <form onSubmit={submitHandler}>
        <Row>
          <Col xs={12}>
            <AuthHeading
              heading="Update Your Password"
              text="Enter your new password"
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
          {error ? (
            <Col xs={12}>
              <Error error={error} />
            </Col>
          ) : null}
        </Row>
        <Row>
          <Col xs={12}>
            <div className="submitArea">
              <Button type="submit" isLoading={loading} isFullWitdh>
                Update Password
              </Button>
            </div>
          </Col>
        </Row>
      </form>
    </Layouts>
  );
};

export default UpdatePassword;
