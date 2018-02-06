var express = require('express');
var router = express.Router();
var Note = require('../model/note').Note


router.get('/notes', function (req, res, next) {
  var query = { raw: true }
  if (req.session.user) {
    query.where = {
      uid: req.session.user.id
    }
  }

  Note.findAll(query).then(function (notes) {
    res.send({ status: 0, data: notes })
  }).catch(function () {
    res.send({ status: 1, errorMsg: '数据库异常' })
  })
});

router.get('/notesreverse', function (req, res, next) {
  var query = { raw: true }
  if (req.session.user) {
    query.where = {
      uid: req.session.user.id
    }
  }

  Note.findAll(query).then(function (notes) {
    res.send({ status: 0, data: notes.reverse() })
  }).catch(function () {
    res.send({ status: 1, errorMsg: '数据库异常' })
  })
});

router.post('/notes/add', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }
  if (!req.body.note) {
    return res.send({ status: 2, errorMsg: '内容不能为空' })
  }

  var note = req.body.note
  var time = req.body.time
  var index = req.body.index
  var uid = req.session.user.id

  Note.create({ text: note, uid: uid, time: time, index: index }).then(
    Note.findAll({ raw: true, where: { uid: uid } }).then(function (notes) {
      var id = notes[notes.length - 1].id
      res.send({ status: 0, id: id })
    })).catch(function () {
      res.send({ status: 1, errorMsg: '数据库异常' })
    })
})

router.post('/notes/modify', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }
  if (!req.body.note) {
    return res.send({ status: 2, errorMsg: '内容不能为空' })
  }

  var note = req.body.note
  var time = req.body.time
  var noteId = req.body.id
  var index = req.body.index
  var uid = req.session.user.id

  Note.update({ text: note, time: time, index: index }, { where: { id: noteId, uid: uid } }).then(function () {
    res.send({ status: 0 })
  }).catch(function () {
    res.send({ status: 3, errorMsg: '数据库异常或权限不足' })
  })
})

router.post('/notes/fulfil', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }

  var noteId = req.body.id
  var complete = req.body.complete
  var uid = req.session.user.id
  Note.update({ complete: complete }, { where: { id: noteId, uid: uid } }).then(function () {
    res.send({ status: 0 })
  }).catch(function () {
    res.send({ status: 3, errorMsg: '数据库异常或权限不足' })
  })
})

router.post('/notes/delete', function (req, res, next) {
  if (!req.session.user) {
    return res.send({ status: 1, errorMsg: '请先登录' })
  }

  var noteId = req.body.id
  var uid = req.session.user.id

  Note.destroy({ where: { id: noteId, uid: uid } }).then(function () {
    res.send({ status: 0 })
  }).catch(function () {
    res.send({ status: 1, errorMsg: '数据库异常或权限不足' })
  })
})

module.exports = router;
