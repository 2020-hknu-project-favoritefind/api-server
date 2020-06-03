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

/** 장소 좋아요 표시 */
router.put("/place/:id/like", (req, res, next) => {
  let cl = new Client(pw);

  if (isUser(req.query.id)) {
    // TODO
    res.status(503);
    res.json({ "message": "해당 부분 미구현" });
  } else {
    res.status(401);
    res.json({ "message": "로그인을 해 주세요." });
  }
})

/** 장소 좋아요 표시 취소 */
router.put("/place/:id/dislike", (req, res, next) => {
  // TODO
  res.status(503);
  res.json({ "message": "해당 부분 미구현" });
})

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

async function isUser(id) {
  let cl = new Client(pw);
  cl.connect();
  let re = await cl.query(`SELECT * FROM account WHERE id=${id};`);
  if (re.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}
