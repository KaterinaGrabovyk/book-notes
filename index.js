import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "Katy",
  port: 5432,
});
db.connect();

app.get("/", async (req, res) => {
  try {
    const books = await db.query("SELECT * FROM booknotes ORDER BY id ASC");
    const all = books.rows;
    res.render("index.ejs", {
      books: all,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/add", async (req, res) => {
  res.render("add.ejs");
});
app.post("/add", async (req, res) => {
  try {
    await db.query(
      "INSERT INTO booknotes (title,author,notedate,note) VALUES ($1,$2,NOW(),$3)",
      [req.body.title, req.body.author, req.body.note]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
