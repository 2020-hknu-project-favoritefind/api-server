const { Client } = require("pg");
var pw = require("./password.js")
var express = require('express');
var router = express.Router();

/* 로그인 */
router.get("/", (req, res, next) => {
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
router.post("/", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`INSERT INTO account(id, sha3_512_password, username) VALUES('${req.query.id}', '${req.query.pw}', '${req.query.username}');`, (err, re) => {
    res.json(re.rows);
    cl.end();
  });
});

/* 즐겨찾기 조회 */
router.get("/:id/favorite", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`SELECT favorite_place FROM account WHERE id='${req.params.id}';`, (err, re) => {
    res.json(re.rows.favorite_place);
    cl.end();
  });
})

/* 즐겨찾기 추가 */
router.post("/:id/favorite", (req, res, next) => {
  let cl = new Client(pw);
  cl.connect();
  cl.query(`UPDATE place SET favorite_place || ${req.query.id} WHERE id=${req.params.id}`, (err, re) => {
    res.json(re.rows.favorite_place);
    cl.end();
  });
})

module.exports = router;
