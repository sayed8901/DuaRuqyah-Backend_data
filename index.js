const express = require("express");
const cors = require("cors"); // Import the CORS middleware

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

app.use(express.json()); // for parsing JSON data


const sqlite3 = require("sqlite3").verbose();
const path = require("path");



// Path to the SQLite DB file
const dbPath = path.resolve(__dirname, 'dua_main.sqlite');

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});


// Getting all dua data            
// http://localhost:5000/all_dua
app.get("/all_dua", (req, res) => {
  const sqlQuery = "SELECT * FROM dua"; // Providing table name

  db.all(sqlQuery, [], (err, rows) => {
    if (err) {
      console.error("Error while querying dua data:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows); // Sending the rows as JSON response
    }
  });
});



// Getting all category             
// http://localhost:5000/categories
app.get("/categories", (req, res) => {
  const sqlQuery = "SELECT * FROM category"; // Providing table name

  db.all(sqlQuery, [], (err, rows) => {
    if (err) {
      console.error("Error while querying dua category:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows); // Sending the rows as JSON response
    }
  });
});


// Getting duas by category ID
// http://localhost:5000/dua_by_category/2
app.get("/dua_by_category/:categoryId", (req, res) => {
  const { categoryId } = req.params; // Extracting the category ID
  console.log("categoryId:", categoryId); // Debugging the route parameter

  const sqlQuery = `
    SELECT * 
    FROM dua
    WHERE cat_id = ?`;

  db.all(sqlQuery, [categoryId], (err, rows) => {
    if (err) {
      console.error("Error while querying category-wise duas:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      if (rows.length == 0) {
        console.log("No duas found for cat_id:", categoryId); // Debugging empty result
        res.status(404).json({ message: "No duas found for this category." });
      } else {
        res.json(rows); // Sending the filtered rows as JSON response
      }
    }
  });
});



// Getting all sub_category         
// http://localhost:5000/sub_categories
app.get("/sub_categories", (req, res) => {
  const sqlQuery = "SELECT * FROM sub_category"; // Providing table name

  db.all(sqlQuery, [], (err, rows) => {
    if (err) {
      console.error("Error while querying dua sub category:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows); // Sending the rows as JSON response
    }
  });
});



// Getting duas by sub_category ID
// http://localhost:5000/dua_by_sub_category/8
app.get("/dua_by_sub_category/:subCategoryId", (req, res) => {
  const { subCategoryId } = req.params; // Extracting the sub category ID
  console.log("subCategoryId:", subCategoryId); // Debugging the route parameter

  const sqlQuery = `
    SELECT * 
    FROM dua
    WHERE subcat_id = ?`;

  db.all(sqlQuery, [subCategoryId], (err, rows) => {
    if (err) {
      console.error("Error while querying category-wise duas:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      if (rows.length == 0) {
        console.log("No duas found for subcat_id:", subCategoryId); // Debugging empty result
        res.status(404).json({ message: "No duas found for this sub category." });
      } else {
        res.json(rows); // Sending the filtered rows as JSON response
      }
    }
  });
});



// Getting sub-category data by category ID
// http://localhost:5000/sub_categories_by_category/1
app.get("/sub_categories_by_category/:categoryId", (req, res) => {
  const { categoryId } = req.params; // Extracting the category ID
  console.log("categoryId:", categoryId); // Debugging the route parameter

  const sqlQuery = `
    SELECT * 
    FROM sub_category
    WHERE cat_id = ?`;

  db.all(sqlQuery, [categoryId], (err, rows) => {
    if (err) {
      console.error("Error while querying sub-categories by category ID:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      if (rows.length == 0) {
        console.log("No sub-categories found for cat_id:", categoryId); // Debugging empty result
        res.status(404).json({ message: "No sub-categories found for this category." });
      } else {
        res.json(rows); // Sending the filtered rows as JSON response
      }
    }
  });
});



// Running the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

