const {asyncHandler} = require('../utils.js')
const { Event, Event_Member } = db
const router = express.Router();
const Op = Sequelize.Op


// allows user to attend an event

router.post(`/:eventId/attend`, asyncHandler( async (req, res) => {
  const event_id = parseInt(req.params.id, 10)
  const {member_id} = req.body;
  await Event_Member.create({
    event_id,
    member_id
  });
  res.status(201);
}));


// allows user to un-attend an event

router.delete(`/:eventId/unattend`, asyncHandler( async(req, res) => {
  const event_id = parseInt(req.params.id, 10)
  const {member_id} = req.body;
  await Event_Member.delete({
    where :{
      [Op.and]: [{event_id}, {member_id}]
    }
  });
  res.status(200);
}));

// allows user to create an event

router.post(`/create`, asyncHandler( async(req, res) => {
  const {description, date_start, date_end, group_id} = req.body
  await Event.create({
    description,
    date_start,
    date_end,
    group_id
  });
  res.status(201);
}));

// allows user to delete an event

router.delete(`/delete`, asyncHandler( async(req, res) => {
  const {group_id} = req.body
  await Event.delete({
    where: {
      group_id
    }
  });
  res.status(201);
}));


module.exports = router;
