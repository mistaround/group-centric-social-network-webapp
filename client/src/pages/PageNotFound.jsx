import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

function PageNotFound() {
  const history = useHistory();
  return (
    <div>
      <Result
        style={{ marginTop: "180px" }}
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push("/user/home");
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
}

export default PageNotFound;
