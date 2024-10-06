# Book Notes

**Book Notes** is a tool for organizing and managing notes from books you've read. It helps readers keep track of key ideas, quotes, and personal reflections in a structured way.

## Table of Contents
1. [Programs required](#programs_required)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [Screenshots](#screenshots)
   
## Programs_required
To run this program you are required to have VScode, Node.js and Postgres.

## Installation
I. Creating data base:
1. Open Postgres
2. right mouse button ![image](https://github.com/user-attachments/assets/4a6f5dd1-b5f2-4d92-9344-9ad4d4f83ffb) -> create -> book_notes (as name)
3. Click this ![image](https://github.com/user-attachments/assets/250e009c-1efb-43d9-a659-24daee270ffc)
4. Run command
   ```
   CREATE TABLE base(
   id SERIAL PRIMARY KEY,
   title VARCHAR(100),
   author VARCHAR(100),
   notedate DATE,
   note TEXT,
   rating INT,
   isbn NUMERIC(15),
   cover VARCHAR(200),
   updated DATE
   )
   ```
II. Installing program:
1. Clone the repository:
    ```bash
    git clone https://github.com/KaterinaGrabovyk/book-notes.git
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
# Before you run program
## 1. Inside index.js change this password to the password you set for Postgres on your PC
```
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "Katy",
  port: 5432,
});
```
## 2. Inside views/index.ejs and book.ejs you'll find this part of code
```
.toLocaleDateString('uk-UA');
```
## The toLocaleDateString() method instances returns a string with a language-sensitive representation of the date portion of this date in the local timezone. Change it to your timezone (google or use chatGPT)

3. Run the project:
    ```bash
    node index.js
    ```

## Usage
After running the project, you can:
- Add book you've read with rating and personal notes.
- Sort books by rating, recency or defoult.
- View each book.
- Update information about book.
- Delete book.
  
## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a Pull Request.

## Built With
- Node.js
- Express.js
- PostgreSQL

## Screenshots
![image](https://github.com/user-attachments/assets/0dfa30a4-9a1c-44a1-b950-eea5cd5a6d32)
![image](https://github.com/user-attachments/assets/b9405c13-94b5-49a7-b45a-d90f47249906)
![image](https://github.com/user-attachments/assets/1409822f-dab0-4ae8-b936-d787eec5a523)
![image](https://github.com/user-attachments/assets/2cf54545-f85a-4b3f-a51d-18072dfe7d31)
