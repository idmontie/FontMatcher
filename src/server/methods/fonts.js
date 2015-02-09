Meteor.methods( {
  upvote : function ( fontNameHeading, fontNameBody ) {
    // TODO add an uptick to fontNameHeading+fontNameBody
    return true;
  },
  unUpvote : function ( fontNameHeading, fontNameBody ) {
    // TODO undo the uptick to fontNameHeading+fontNameBody
    return true;
  },
  downvote : function ( fontNameHeading, fontNameBody ) {
    // TODO add a downtick to fontNameHeading+fontNameBody
    return true;
  },
  unDownvote : function ( fontNameHeading, fontNameBody ) {
    // TODO undo the downtick to fontNameHeading+fontNameBody
    return true;
  },
  fonts : function () {
    // TODO one day Meteor will provide a better
    // way to do this, but 675 isn't that big.
    var count = Fonts.find().fetch().length;
    var randomIndex1 = Math.floor( Random.fraction() * ( count - 1 ) );
    var randomIndex2 = Math.floor( Random.fraction() * ( count - 1 ) );
    var arr = Fonts.find().fetch();
    return {
      fontNameHeading: arr[ randomIndex1 ],
      fontNameBody: arr[ randomIndex2 ]
    }
  }
} );