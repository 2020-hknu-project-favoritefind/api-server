const { Client } = require("pg");
var pw = require("./password.js")
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

/* 문자열로 장소 검색 */
router.get("/search", (req, res, next) => {
  let cl = new Client(pw);
  cl.query(`SELECT * FROM place WHERE name LIKE '%${req.query.q}%';`, (err, re) => {
    res.json(re.rows)
  })
})

/* 장소 추가 */
router.post("/", (req, res, next) => {
  let cl = new Client(pw);
  cl.query(`INSERT INTO place(name, province, city, full_address, coord_latitude, coord_longitude, contact, category, subdivision, last_update) 
      VALUES ('${req.query.name}', '경기도', '${req.query.city}', '${req.query.address}', ${co_lat}, ${co_lon}, '${req.query.contact}', '${req.query.category}', '${req.query.subdivision}', NOW());`), (err, re) => {
      res.json(re.rows)
    }
});

/* 장소 좋아요 */
router.put("/:id/like", (req, res, next) => {
  let cl = new Client(pw);
  cl.query(`UPDATE place SET likes=likes+1 WHERE place_id=${req.params.id}`, (err, re) => {
    res.json(re.rows)
  })
});

/* 장소 좋아요 취소 */
router.put("/:id/dislike", (req, res, next) => {
  let cl = new Client(pw);
  cl.query(`UPDATE place SET likes=likes-1 WHERE place_id=${req.params.id}`, (err, re) => {
    res.json(re.rows)
  })
});

/* 좋아요 개수 TOP 20개 반환 */
router.get("/best", (req, res, next) => {
  let cl = new Client(pw);
  cl.query(`SELECT * FROM place ORDER BY likes LIMIT 20;`, (err, re) => {
    res.json(re.rows);
  })
});

module.exports = router;
