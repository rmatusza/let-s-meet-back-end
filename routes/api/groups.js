const {asyncHandler} = require('../utils.js')
const { Group, Group_Member, Organizer } = db
const router = express.Router();
const Op = Sequelize.Op



// returns all group data releated to the user once the group tab is clicked

router.get(`/`, asyncHandler( async(req, res) => {
  const{group_id, member_id} = req.body
  const groups = await Group.findAll({
    where: {
      where: {
        [Op.and]: [{group_id}, {member_id}]
      }
    },
    include: [{model: Group_Member}]
  })

  res.json({groups})
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

  res.status(201)
}))


// allows user to delete a group

router.delete(`/delete`, asyncHandler( async(req, res) => {
  const {member_id} = req.body
  await Group.delete({
    where: {
      organizer_id: member_id
    }
  })
}))


// allows a user to subscribe to a group

router.post(`/:groupId/subscribe`, asyncHandler( async(req, res) => {
  const group_id = parseInt(req.params.id, 10)
  const {member_id} = req.body

  await Group_Member.create({
    group_id,
    member_id
  })

  res.status(200)
}))


// allows a user to unsubscribe to a group

router.post(`/:groupId/unsubscribe`, asyncHandler( async(req, res) => {
  const group_id = parseInt(req.params.id, 10)
  const {member_id} = req.body

  await Group_Member.delete({
    where: {
      [Op.and]: [{group_id}, {member_id}]
    }
  })

  res.status(200)
}))
