Meteor.methods( {
  upvote : function ( fontHeading, fontBody ) {
    // add an uptick to fontHeading+fontBody

    FontCombo.update( 
        {
          fontHeading : fontHeading,
          fontBody : fontBody
        },
        {
          $setOnInsert : {
            fontHeading : fontHeading,
            fontBody : fontBody,
            downticks : 0
          },
          $inc : {
            upticks : 1
          }
        },
        {
          multi : false,
          upsert : true
        }
    );

    return true;
  },
  unUpvote : function ( fontHeading, fontBody ) {
    // undo the uptick to fontHeading+fontBody

    FontCombo.update( 
        {
          fontHeading : fontHeading,
          fontBody : fontBody
        },
        {
          $setOnInsert : {
            fontHeading : fontHeading,
            fontBody : fontBody,
            downticks : 0
          },
          $inc : {
            upticks : -1
          }
        },
        {
          multi : false,
          upsert : true
        }
    );

    return true;
  },
  downvote : function ( fontHeading, fontBody ) {
    // add a downtick to fontHeading+fontBody

    FontCombo.update( 
        {
          fontHeading : fontHeading,
          fontBody : fontBody
        },
        {
          $setOnInsert : {
            fontHeading : fontHeading,
            fontBody : fontBody,
            upticks : 0
          },
          $inc : {
            downticks : 1
          }
        },
        {
          multi : false,
          upsert : true
        }
    );

    return true;
  },
  unDownvote : function ( fontHeading, fontBody ) {
    // undo the downtick to fontHeading+fontBody

    FontCombo.update( 
        {
          fontHeading : fontHeading,
          fontBody : fontBody
        },
        {
          $setOnInsert : {
            fontHeading : fontHeading,
            fontBody : fontBody,
            upticks : 0
          },
          $inc : {
            downticks : -1
          }
        },
        {
          multi : false,
          upsert : true
        }
    );

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