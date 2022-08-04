const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51LQ5yKSCJ31Lis8n2z5ecjhCQelKV9ldT4LW0UZS1m2TvAZlHQ9IfbOeIZLNt4A620lDECMsBPvJY20466w0UMl800fltIxbYQ"
);

const { orderModel } = require("./collections");
//uses
const app = express();

app.use(express.json());
app.use(cors());

 
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.w4kl75w.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("<center><h1>Roy's backend</h1></center>");
});

app.get("/getallorders/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  orderModel.find({ email: id }, (error, data) => {
    if (error) {
      res.status(404).json({ error: "data item not found! (client error response)" });
    } else {
      res.json(data);
    }
  });
});

app.get("/getorderbystripeId/:id", (req, res) => {
  const { id } = req.params;
  orderModel.findOne({ userId_stripe: id }, (error, data) => {
    if (error) {
      res.status(404).json({ error: "data item not found!" });
    } else {
      console.log(data);
      res.json(data);
    }
  });
});

app.patch("/cancelorder/:id", (req, res) => {
  const { id } = req.params;
  orderModel.findOneAndUpdate(
    { userId_stripe: id },
    { isCancelled: true },
    (error, data) => {
      if (error) {
        res.status(404).json({ error: "data item not found!" });
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/payments", (req, res) => {
  const { user, event, product } = req.body;
  const orderObject = new orderModel({
    userId_auth: user.sub,
    userId_stripe: event.id,
    cardId: event.card.id,
    email: user.email,
    timeStamp: new Date(event.created),
    planName: product.name,
    amount: product.amount,
    currency: product.currency,
    isCancelled: false,
  });
  orderObject
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.status(404).json({ err }));
});

app.listen(process.env.PORT, () => console.log("listening at port 8282"));
