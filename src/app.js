const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.listen(process.env.PORT);

const userRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const likesRouter = require("./routes/likes");
const ordersRouter = require("./routes/orders");
const cartRouter = require("./routes/cart");

app.use("/users", userRouter);
app.use("/books", booksRouter);
app.use("/likes", likesRouter);
app.use("/orders", ordersRouter);
app.use("/cart", cartRouter);
