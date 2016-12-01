use meetup 
db.users.aggregate(
  [
    {
      $match: {_id: 3}
    },
    {
      $unwind: "$friends"
    },
    { "$graphLookup" : {
      from : "users",
      startWith : "$friends.id",
      connectFromField : "friends.id",
      connectToField : "_id",
      maxDepth : 1, 
      depthField : "depth",
      as : "target"}
    },
    {
      $unwind: "$target"
    },
    {
      $project: {
        _id: 0,
        "target._id": 1,
        "target.meetupCount": {$size: "$target.meetups"},
        requestIntroFrom: "$friends"
      }
    },
    {
      $sort: {"target.meetupCount": -1}
    },
    {
      $limit: 1
    },
    {
      $lookup: {
        from: "users",
        localField: "requestIntroFrom.id",
        foreignField: "_id",
        as: "requestIntroFrom.details"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "target._id",
        foreignField: "_id",
        as: "target.details"
      }
    },
    {
      $project: {
        "requestIntroFrom.id": 1,
        "requestIntroFrom.details.firstName": 1,
        "requestIntroFrom.details.lastName": 1,
        "requestIntroFrom.details.contact": 1,
        "target._id": 1,
        "target.meetupCount": 1,
        "target.details.firstName": 1,
        "target.details.lastName": 1
      }
    }
  ],
 {allowDiskUse: true}).pretty()