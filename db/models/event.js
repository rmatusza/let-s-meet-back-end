'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    name: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    description: {
      allowNull: true,
      type: Sequelize.TEXT
    },
    date_start: {
      allowNull: false,
      type: Sequelize.DATE
    },
    date_end: {
      allowNull: false,
      type: Sequelize.DATE
    },
    group_id: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
  }, {});
  Event.associate = function(models) {
    // associations can be defined here
    Event.belongsTo(models.Group, {foreignKey: "group_id"})
    Event.hasMany(models.Event_Member, {foreignKey: "event_id"})
  };
  return Event;
};
