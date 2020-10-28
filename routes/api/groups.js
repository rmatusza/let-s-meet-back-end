const express = require('express');
const {asyncHandler} = require('../../utils.js')
const db = require('../../db/models')
const { Group, Group_Member, Organizer, Event } = db
const router = express.Router();
const Sequelize = require('sequelize')
const Op = Sequelize.Op



// returns all group data releated to the user once the group tab is clicked

router.get(`/`, asyncHandler( async(req, res) => {
  const{group_id, member_id} = req.body
  const groups = await Group_Member.findAll({
    where: {
      member_id
    },
    include: [{model: Group}]
  })

  res.json({groups})
}))


// returns all info about the selected group and the events that belong to it

router.get(`/:id`, asyncHandler( async(req, res) => {
  const group_id = req.params.id
  console.log('HERE IS THE ID:', group_id)
  const group = await Group.findOne({
    where: {
      id: group_id
    }
  })

  const events = await Event.findAll({
    where: {
      group_id
    }
  })

  res.json({groupData: group,
    eventData: events})
}))

// allows user to create a group
// two-step process where first an organizer must be created
// followed by a group that is linked to the organizer's primary key

router.post(`/create`, asyncHandler( async(req, res) => {
  const {member_id, name, description, city, category} = req.body
 await Organizer.create({
    member_id
  })

  await Group.create({
    name,
    description,
    city,
    category,
    organizer_id: member_id
  })

  // res.status(201)
  res.json({message: "group was made"})
}))


// allows user to delete a group

router.delete(`/:id/delete`, asyncHandler( async(req, res) => {
  const group_id = req.params.id
  await Group.destroy({
    where: {
      id: group_id
    }
  })

  res.json({message: "group was deleted"})
}))


// allows a user to subscribe to a group

router.post(`/:groupId/subscribe`, asyncHandler( async(req, res) => {
  const group_id = req.params.groupId
  const {member_id} = req.body

  await Group_Member.create({
    group_id,
    member_id
  })

  // res.status(200)
  res.json({message: "Member joined group!"})
}))


// allows a user to unsubscribe to a group

router.post(`/:groupId/unsubscribe`, asyncHandler( async(req, res) => {
  const group_id = req.params.groupId
  const {member_id} = req.body

  await Group_Member.destroy({
    where: {
      [Op.and]: [{group_id}, {member_id}]
    }
  })

  // res.status(200)
  res.json({message: "Member left group!"})
}))

module.exports = router;
