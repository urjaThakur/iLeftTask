const express = require("express");
const app = express();
const port = 3000;
require("./db/database");

// const meetingRouter = require("./routers/meeting.routes");
const participantsRouter = require("./routers/participants.route");
app.use(express.json());
// app.use(meetingRouter);
app.use(participantsRouter);

app.listen(port, () => {
  console.log(`server is up on ${port}`);
});
