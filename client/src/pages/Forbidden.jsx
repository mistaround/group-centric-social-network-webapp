import React from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom";

function Forbidden() {
  const history = useHistory();
  return (
    <div>
      <Result
        style={{ marginTop: "180px" }}
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
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

export default Forbidden;
