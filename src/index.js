const express = require("express");
const bodyParser = require("body-parser");
const customers = require("./customers.json");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // console.log(customers);
  res.status(201).json({ message: "done!" });
});

// tast A
app.get("/customers/list", (req, res) => {
  const filter = req.query.filter;
  if (!filter) return res.send(customers);
  let result = customers.filter(
    (val) => val.first_name === filter || val.last_name === filter
  );
  res.send(result);
});

// tast B
app.get("/customers", (req, res) => {
  const query = req.query;

  const car_make = query.car_make;
  const gender = query.gender;

  const sortBy =
    query.sort !== undefined ? query.sort.split(":")[0] : undefined;
  const sort = query.sort !== undefined ? query.sort.split(":")[1] : undefined; // ASC DESC

  const limit = parseInt(query.limit) || customers.length;
  const page = parseInt(query.page) || 0;

  console.log(car_make, gender, sort, limit, page);

  //// compare function for sorting
  function compare(a, b) {
    if (a[sortBy] < b[sortBy]) {
      return -1;
    }
    if (a[sortBy] > b[sortBy]) {
      return 1;
    }
    return 0;
  }
  //// end of function

  var result = [];

  if (car_make !== undefined) {
    console.log(car_make);
    result = customers.filter((val) => {
      return val.car_make.toLowerCase() === car_make.toLocaleLowerCase();
    });
  }

  if (gender !== undefined) {
    result = result.filter((val) => {
      return val.gender.toLowerCase() === gender.toLocaleLowerCase();
    });
  }

  result = result.slice(page + 1, page + limit + 1);

  if (sort !== undefined) {
    if (sort === "ASC") result = result.sort(compare);
    else if (sort === "DESC") result = result.sort(compare).reverse();
  }

  res.send(result);
});

app.listen(3000, function () {
  console.log("Server is running on 3000");
});
