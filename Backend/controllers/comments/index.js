const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  console.log("qwe", req.params.id, commentsByPostId[req.params.id] || []);
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commendId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commendId, content, status: "Pending" });

  commentsByPostId[req.params.id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commendId,
      content,
      postId: req.params.id,
      status: "Pending"
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
    console.log("Event received", req.body.type);

    const { type, data } = req.body

    if(type === 'CommentModerated') {
      const { postId, id, status, content } = data
      const comments = commentsByPostId[postId]

      const comment = comments.find((comment) => {
        return comment.id === id
      })
      comment.status = status

      await axios.post('http://localhost:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content
        }
      })
    }

    res.send({})
})

app.listen(4001, () => {
  console.log("Listening at port 4001");
});
