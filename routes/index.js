var express = require('express');
const { Client } = require("pg");
var pw = require("./password.js")
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("테스트")
  res.json({ "Hello": "World!" });
});

router.get("/place", (req, res, next) => {
  let cl = new Client(pw);
  let t = {
    place_id: req.query.id,
    city: req.query.city,
    category: req.query.category,
    subdivision: req.query.subdivision
  }
  let q = [];
  Object.keys(t).forEach(i => {
    if (t[i] !== undefined) {
      if (i === 'place_id') {
        q.push(`${i}=${t[i]}`)
      } else {
        q.push(`${i}='${t[i]}'`)
      }
    }
  })
  cl.connect();

  if (q) {
    cl.query(`SELECT * FROM place WHERE ${q.join(" and ")};`, (err, re) => {
      if (re.rows) {
        res.json(re["rows"]);
      }

      cl.end();
    })
  } else {
    cl.query("SELECT * FROM place;", (err, re) => {
      res.json(re["rows"]);
      cl.end();
    })
  }
});


router.get("/place/id/:id", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`SELECT * FROM place WHERE place_id=${decodeURI(req.params.id)};`, (err, re) => {
    res.json(re["rows"]);
    cl.end();
  })
})

router.get("/place/city/:city", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`SELECT * FROM place WHERE city='${decodeURI(req.params.city)}';`, (err, re) => {
    res.json(re["rows"]);
    cl.end();
  })
})

router.get("/place/category/:type", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`SELECT * FROM place WHERE category='${decodeURI(req.params.type)}';`, (err, re) => {
    res.json(re["rows"]);
    cl.end();
  })
})

router.put("/place/id/:id/like", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`UPDATE place SET likes=likes+1 WHERE place_id=${decodeURI(req.params.id)};`, (err, re) => {
    res.json({});
    cl.end();
  })
})

router.put("/place/id/:id/dislike", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`UPDATE place SET likes=likes-1 WHERE place_id=${decodeURI(req.params.id)};`, (err, re) => {
    res.json({});
    cl.end();
  })
})

module.exports = router;
