import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";

const color = {
  Cases: "#0A79DF",
  Deaths: "#fb4443",
  Recovered: "#7dd71d",
};

function InfoBox({ title, cases, total, setType }) {
  return (
    <Card
      className={InfoBox}
      onClick={() => {
        setType(title.toLowerCase());
      }}
      className="infoBox"
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2 className="infoBox__cases" style={{ color: color[title] }}>
          + {numeral(cases).format("0.0a")}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          Total{" "}
          <strong style={{ color: "black" }}>
            {numeral(total).format("0.0a")}{" "}
          </strong>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
