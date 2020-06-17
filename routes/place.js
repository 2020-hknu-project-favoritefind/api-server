var express = require('express');
var router = express.Router();

/* 장소 검색 */
router.get("/", (req, res, next) => {
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

  if (q.length !== 0) {
    cl.query(`SELECT * FROM place WHERE ${q.join(" and ")};`, (err, re) => {
      console.error(err);
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

module.exports = router;
