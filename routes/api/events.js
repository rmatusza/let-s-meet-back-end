const express = require('express');
const {asyncHandler} = require('../../utils.js')
const db = require('../../db/models')
const { Event, Event_Member } = db
const router = express.Router();
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get(`/test`, asyncHandler( async(req, res) => {
  const message = {message: 'hello'}
  res.json({message})
}))


// returns all events for a particular date

router.get(`/:date`, asyncHandler( async(req, res) => {
  let date = req.params.date
  let formattedDate = date.split('-').join('/')
  console.log('HERE IS THE DATE:' , formattedDate)
  const events = await Event.findAll({
    where: {
      date_start: formattedDate
    }
  })

  res.json({events})
}))


// allows user to attend an event

router.post('/:id/attend', asyncHandler( async (req, res) => {
  const event_id = req.params.id
  console.log('EVENT ID:', event_id)
  const {member_id} = req.body;
  await Event_Member.create({
    event_id,
    member_id
  });
  res.json({message: 'success'});
}));


// allows user to un-attend an event

router.post('/:event_id/unattend', asyncHandler( async(req, res) => {

  const event_id = req.params.event_id
  const {member_id} = req.body;

  await Event_Member.destroy({
    where: {
      [Op.and]: [{event_id}, {member_id}]
    }
  });
  // res.status(200);
  res.json({message: 'success'})
}));

// allows user to create an event

// "10/29/2020"

router.post(`/create`, asyncHandler( async(req, res) => {
  const {name, description, date_start, date_end, group_id} = req.body
  await Event.create({
    name,
    description,
    date_start,
    date_end,
    group_id
  });
  // res.status(201);
  res.json({message: 'success'})
}));

// allows user to delete an event

router.delete(`/:id/delete`, asyncHandler( async(req, res) => {
 const event_id = req.params.id
  await Event.destroy({
    where: {
      id: event_id
    }
  });
  // res.status(200);
  res.json({message: 'success'})
}));


// provides info to the front end about a users event status

router.get(`/:eventId/:member_id`, asyncHandler(async(req, res) => {
  const event_id = req.params.eventId
  const member_id = req.params.member_id
  // const {member_id} = req.body
  // console.log('GROUP ID:', group_id)
  console.log('MEMBER ID:', member_id)
  const isMember = await Event_Member.findAll({
    where: {
      [Op.and]: [{event_id}, {member_id}]
    }
  })
  console.log('IS MEMBER:', isMember)
  isMember.length > 0 ? res.json({content: 'content'}) : res.json({})

}))

module.exports = router;
