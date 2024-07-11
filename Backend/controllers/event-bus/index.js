const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", async (req, res) => {
  const event = req.body;

  events.push(event);

  // Array of service URLs to send events to
  const services = [
    "http://localhost:4000/events",
    "http://localhost:4001/events",
    "http://localhost:4002/events",
    "http://localhost:4003/events"
  ];

  // Use Promise.allSettled to handle each axios.post call
  const results = await Promise.allSettled(
    services.map((service) => axios.post(service, event))
  );

  // Log any errors
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(`Failed to send event to ${services[index]}:`, result.reason);
    }
  });

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});



// const express = require("express");
// const bodyParser = require("body-parser");
// const axios = require("axios");

// const app = express();
// app.use(bodyParser.json());

// const events = [];

// app.post("/events", (req, res) => {
//   const event = req.body;

//   events.push(event);
//   try {
//     axios.post("http://localhost:4000/events", event).catch((err) => {
//       console.log(err);
//     });
//     axios.post("http://localhost:4001/events", event).catch((err) => {
//       console.log(err);
//     });
//     axios.post("http://localhost:4002/events", event).catch((err) => {
//       console.log(err);
//     });
//     axios.post("http://localhost:4003/events", event).catch((err) => {
//       console.log(err);
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   res.send({ status: "OK" });
// });

// app.get("/events", (req, res) => {
//   res.send(events);
// });

// app.listen(4005, () => {
//   console.log("Listening on 4005");
// });

