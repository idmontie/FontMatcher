Meteor.methods( {
  upvote : function ( heading, body ) {
    // add an uptick to fontHeading+fontBody
    FontCombo.update( 
        {
          heading : heading,
          body : body
        },
        {
          $setOnInsert : {
            heading : heading,
            body : body,
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

    // if the user is signed in, set their vote
    if ( Meteor.userId() ){
      Votes.update(
          {
            heading : heading,
            body : body,
            ownerId : Meteor.userId()
          },
          {
            $setOnInsert : {
              heading : heading,
              body : body,
              ownerId : Meteor.userId()
            },
            $set : {
              upvote : true,
              downvote : false
            }
          },
          {
            multi : false,
            upsert : true
          }
      );
    }

    return true;
  },
  unUpvote : function ( heading, body ) {
    // undo the uptick to fontHeading+fontBody

    FontCombo.update( 
        {
          heading : heading,
          body : body
        },
        {
          $setOnInsert : {
            heading : heading,
            body : body,
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

    // if the user is signed in, set their vote
    if ( Meteor.userId() ){
      Votes.update(
          {
            heading : heading,
            body : body,
            ownerId : Meteor.userId()
          },
          {
            $setOnInsert : {
              heading : heading,
              body : body,
              ownerId : Meteor.userId()
            },
            $set : {
              downvote : false,
              upvote : false
            }
          },
          {
            multi : false,
            upsert : true
          }
      );
    }

    return true;
  },
  downvote : function ( heading, body ) {
    // add a downtick to fontHeading+fontBody

    FontCombo.update( 
        {
          heading : heading,
          body : body
        },
        {
          $setOnInsert : {
            heading : heading,
            body : body,
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

    // if the user is signed in, set their vote
    if ( Meteor.userId() ){
      Votes.update(
          {
            heading : heading,
            body : body,
            ownerId : Meteor.userId()
          },
          {
            $setOnInsert : {
              heading : heading,
              body : body,
              ownerId : Meteor.userId()
            },
            $set : {
              upvote : false,
              downvote : true
            }
          },
          {
            multi : false,
            upsert : true
          }
      );
    }

    return true;
  },
  unDownvote : function ( heading, body ) {
    // undo the downtick to fontHeading+fontBody

    FontCombo.update( 
        {
          heading : heading,
          body : body
        },
        {
          $setOnInsert : {
            heading : heading,
            body : body,
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

    // if the user is signed in, set their vote
    if ( Meteor.userId() ){
      Votes.update(
          {
            heading : heading,
            body : body,
            ownerId : Meteor.userId()
          },
          {
            $setOnInsert : {
              heading : heading,
              body : body,
              ownerId : Meteor.userId()
            },
            $set : {
              upvote : false,
              downvote : false
            }
          },
          {
            multi : false,
            upsert : true
          }
      );
    }

    return true;
  },
  fonts : function ( optionalFontHeading, optionalFontBody ) {
    // XXX one day Meteor will provide a better
    // way to do this, but 675 isn't that big.
    var arr     = Fonts.find().fetch();
    var count   = arr.length;
    var heading = null;
    var body    = null;

    if ( optionalFontHeading ) {
      heading = Fonts.findOne( {
        slug : optionalFontHeading
      } );
    } else {
      var randomIndex1 = Math.floor( Random.fraction() * ( count - 1 ) );
      heading = arr[ randomIndex1 ];
    }
    
    if ( optionalFontBody ) {
      body = Fonts.findOne( {
        slug : optionalFontBody
      } );
    } else {
      var randomIndex2 = Math.floor( Random.fraction() * ( count - 1 ) );
      body = arr[ randomIndex2 ];
    }

    return {
      fontNameHeading : heading,
      fontNameBody : body
    };
  },
  getVotes : function ( heading, body ) {
    var combo = FontCombo.findOne( {
        heading : heading,
        body : body
    } );

    if ( combo ) {
      return {
        up : combo.upticks,
        down : combo.downticks
      };
    } else {
      return {
        up : 0,
        down : 0
      }
    }
  }
} );