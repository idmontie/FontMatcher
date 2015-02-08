Meteor.methods( {
  upvote : function ( fontNameHeading, fontNameBody ) {
    // TODO add an uptick to fontNameHeading+fontNameBody
  },
  downvote : function ( fontNameHeading, fontNameBody ) {
    // TODO add a downtick to fontNameHeading+fontNameBody
  },
  fonts : function () {
    return {
      // TODO randomly get some fonts
      fontNameHeading : {
        name : 'Open Sans',
        slug : 'Open-Sans-normal-400'
      },
      fontNameBody : {
        name : 'Slabo 27px',
        slug : 'Slabo-27px-normal-400'
      }
    }
  }
} );