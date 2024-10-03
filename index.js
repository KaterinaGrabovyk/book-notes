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

function isValidISBN10(isbn) {
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += (10 - i) * isbn[i];
  }
  const checkDigit = isbn[9].toUpperCase() === "X" ? 10 : isbn[9];
  sum += checkDigit;
  return sum % 11 === 0;
}

function isValidISBN13(isbn) {
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += (i % 2 === 0 ? 1 : 3) * isbn[i];
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === isbn[12];
}

function isValidISBN(isbn) {
  if (isbn.length === 10) {
    return isValidISBN10(isbn);
  }
  if (isbn.length === 13) {
    return isValidISBN13(isbn);
  }
  return false;
}

app.post("/add", async (req, res) => {
  try {
    if (!isValidISBN(req.body.isbn)) {
      res.render("add.ejs", {
        errorISBN: "wrong ISBN code",
      });
    }
    const cover = await axios.get(
      `https://bookcover.longitood.com/bookcover/${req.body.isbn}`
    );
    console.log(cover.data.url);
    await db.query(
      "INSERT INTO booknotes (title,author,notedate,note,rating,isbn,cover) VALUES ($1,$2,NOW(),$3,$4,$5,$6)",
      [
        req.body.title,
        req.body.author,
        req.body.note,
        req.body.rating,
        req.body.isbn,
        cover.data.url,
      ]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
