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
    const books = await db.query(`SELECT * FROM booknotes ORDER BY id ASC`);
    const all = books.rows;
    res.render("index.ejs", {
      books: all,
    });
  } catch (err) {
    console.log(err);
  }
});
//sorting
app.post("/", async (req, res) => {
  try {
    const sort = req.body.sort;
    let query;

    if (sort === "rating") {
      query = "SELECT * FROM booknotes ORDER BY rating DESC";
    } else if (sort === "recency") {
      query = "SELECT * FROM booknotes ORDER BY notedate DESC";
    } else {
      query = "SELECT * FROM booknotes ORDER BY id ASC";
    }
    const books = await db.query(query);
    const all = books.rows;
    res.render("index.ejs", {
      books: all,
    });
  } catch (err) {
    console.log(err);
  }
});
//gets add page
app.get("/add", async (req, res) => {
  res.render("add.ejs");
});
//functions for handling ISBN codes
function isValidISBN(isbn) {
  if (isbn.length === 10 || isbn.length === 13) {
    return true;
  } else {
    return false;
  }
}
//Adds new book review
app.post("/add", async (req, res) => {
  try {
    if (isValidISBN(req.body.isbn) === false) {
      res.render("add.ejs", {
        errorISBN: "wrong ISBN code",
      });
    } else {
      const cover = await axios.get(
        `https://bookcover.longitood.com/bookcover/${req.body.isbn}`
      );
      console.log(cover.data.url);
      await db.query(
        "INSERT INTO booknotes (title,author,notedate,note,rating,isbn,cover,updated) VALUES ($1,$2,NOW(),$3,$4,$5,$6,NOW())",
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
    }
  } catch (err) {
    console.log(err);
  }
});

//Update
app.get("/update/:id", async (req, res) => {
  const id = req.params.id;
  const b = await db.query(`SELECT * FROM booknotes WHERE id=${id}`);
  res.render("update.ejs", {
    book: b.rows[0],
  });
});
app.post("/update/:id", async (req, res) => {
  try {
    if (isValidISBN(req.body.isbn) === false) {
      const id = req.params.id;
      const b = await db.query(`SELECT * FROM booknotes WHERE id=${id}`);
      res.render("update.ejs", {
        book: b.rows[0],
        errorISBN: "Previous ISBN code was wrong. Data wasn't updated",
      });
    } else {
      const cover = await axios.get(
        `https://bookcover.longitood.com/bookcover/${req.body.isbn}`
      );
      await db.query(
        `UPDATE booknotes SET title = ($1),author = ($2),note = ($3),rating = ($4),isbn = ($5),cover = ($6),updated = NOW() WHERE id = ${req.params.id}`,
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
    }
  } catch (err) {
    console.log(err);
  }
});
//Deletes
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await db.query(`DELETE FROM booknotes WHERE id=${id}`);
    console.log("element was deleted.");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
//look at post
app.get("/:id/:title", async (req, res) => {
  try {
    const id = req.params.id;
    const books = await db.query(`SELECT * FROM booknotes WHERE id=${id}`);
    const all = books.rows;
    res.render("book.ejs", {
      book: all[0],
    });
  } catch (err) {
    console.log(err);
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
