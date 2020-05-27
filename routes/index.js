var express = require('express');
const { Client } = require("pg");
var pw = require("./password.js")
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ "Hello": "World!" });
});

/* 장소 검색 */
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

/* 로그인 */
router.get("/auth", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect()
  cl.query(`SELECT * FROM account WHERE id='${req.query.id}' and sha3_512_password='${req.query.pw}'`, (err, re) => {
    if (re.rows.length === 1) {
      res.json({ "code": 200, id: re.rows[0]['id'] })
    } else if (re.rows.length === 0) {
      res.json({ "code": 401, "message": "ID 또는 비밀번호가 잘못되었습니다." });
    } else {
      res.json({ "code": 500, "message": "문제가 발생했습니다." })
    }
    cl.end();
  });
})

/* 회원가입 */
router.post("/auth", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`INSERT FROM account(id, sha3_512_password) VALUES('${req.query.id}', '${req.query.pw}');`, (err, re) => {
    console.error(err);
    console.log(re.rows);
    res.json(re.rows);
    cl.end();
  });
});

module.exports = router;
