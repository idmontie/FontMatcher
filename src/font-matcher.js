function googleFontWrap( font ) {
  var fontPre = "<link href='http://fonts.googleapis.com/css?family=";
  var fontPost = "' rel='stylesheet' type='text/css'>";

  font = font.replace( ' ', '+' );
  return fontPre + font + fontPost;
}

if (Meteor.isClient) {
  function newFontsCallback( error, result ) {
    if ( error ) {
      // TODO
    } else {
      Session.set( 'fontNameHeading', result.fontNameHeading );
      Session.set( 'fontNameBody', result.fontNameBody );

      WebFont.load( {
        google: {
          families: [
            Session.get( 'fontNameHeading' ).name,
            Session.get( 'fontNameBody' ).name
          ]
        }
      } );
    }
  }

  Template.matcher.rendered = function () {
    // generate the first set of fonts
    Meteor.call( 'fonts', newFontsCallback );
  };

  Template.matcher.helpers( {
    fontHeading : function () {
      var currentFont = Session.get( 'fontNameHeading' );
      return "font-family: '" + currentFont.name + "';";
    },
    fontBody : function () {
      var currentFont = Session.get( 'fontNameBody' );
      return "font-family: '" + currentFont.name + "';";
    },
    numberOfVotes : function () {
      // TODO return the sum of upvotes - downvotes
      return 0;
    },
    hasUpvoted : function () {
      // TODO if the user is logged in, check if they have
      // upvoted for this particular set of fonts
      return false;
    },
    hasDownvoted : function () {
      // TODO if the user is logged in, check if they have
      // downvoted for this particular set of fonts

      return false;
    },
    hasFavorited : function () {
      // TODO
      return false;
    }
  } );

  Template.matcher.events( {
    'click [data-action=upvote]:not(.active)' : function ( e ) {
      e.preventDefault();

      $( e.target ).addClass( 'active' );

      Meteor.call(
          'upvote',
          Session.get( 'fontNameHeading' ),
          Session.get( 'fontNameBody' )
      );
    },
    'click [data-action=downvote]:not(.active)' : function ( e ) {
      e.preventDefault();

      $( e.target ).addClass( 'active' );

      Meteor.call(
        'downvote',
        Session.get( 'fontNameHeading' ),
        Session.get( 'fontNameBody' )
      );
    }
  } );

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

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
}
