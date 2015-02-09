// ================================
// Home Template Helpers and Events
// ================================

/**
 * Setup for new fonts
 */
function newFontsCallback( error, result ) {
  if ( error ) {
    // TODO
  } else {
    Session.set( 'fontNameHeading', result.fontNameHeading );
    Session.set( 'fontNameBody', result.fontNameBody );

    // Set defaults
    var hash = result.fontNameHeading.name +
        '+' +
        result.fontNameBody.name
    Session.setDefault( 'hasUpvoted+' + hash, false );
    Session.setDefault( 'hasDownvoted+' + hash, false );

    // Load the fonts
    WebFont.load( {
      google: {
        families: [
          Session.get( 'fontNameHeading' ).name,
          Session.get( 'fontNameBody' ).name
        ]
      }
    } );

    // Set the hash so that we can read it later
    history.pushState(
        {
          fontNameHeading : result.fontNameHeading,
          fontNameBody : result.fontNameBody
        },
        result.fontNameHeading.name + " + " + result.fontNameBody.name,
        '#' + result.fontNameHeading.slug + "+" + result.fontNameBody.slug
    );
  }
}

/**
 * Upvote.
 *
 * Sets the sessions and calls the server
 */
function upvote() {
  var hash = Session.get( 'fontNameHeading' ).name +
      '+' +
      Session.get( 'fontNameBody' ).name;

  // Upvote
  Session.set( 'hasUpvoted+' + hash, true );
  Session.set( 'hasDownvoted+' + hash, false );

  Meteor.call(
      'upvote',
      Session.get( 'fontNameHeading' ),
      Session.get( 'fontNameBody' ),
      function ( error, result ) {
        if ( error ) {
          // TODO undo upvote
        } else {
          
        }
      }
  );
}

function unUpvote() {
  var hash = Session.get( 'fontNameHeading' ).name +
      '+' +
      Session.get( 'fontNameBody' ).name;

  Session.set( 'hasUpvoted+' + hash, false );
  Session.set( 'hasDownvoted+' + hash, false );

  Meteor.call(
      'unUpvote',
      Session.get( 'fontNameHeading' ),
      Session.get( 'fontNameBody' ),
      function ( error, result ) {
        if ( error ) {
          // TODO undo upvote
        } else {
          
        }
      }
  );
}

function downvote() {
  var hash = Session.get( 'fontNameHeading' ).name +
      '+' +
      Session.get( 'fontNameBody' ).name;

  Session.set( 'hasUpvoted+' + hash, false );
  Session.set( 'hasDownvoted+' + hash, true );

  Meteor.call(
    'downvote',
    Session.get( 'fontNameHeading' ),
    Session.get( 'fontNameBody' ),
    function ( error, result ) {
      if ( error ) {
        // TODO
      } else {
        
      }
    }
  );
}

function unDownvote() {
  var hash = Session.get( 'fontNameHeading' ).name +
      '+' +
      Session.get( 'fontNameBody' ).name;

  Session.set( 'hasUpvoted+' + hash, false );
  Session.set( 'hasDownvoted+' + hash, false );

  Meteor.call(
      'unDownvote',
      Session.get( 'fontNameHeading' ),
      Session.get( 'fontNameBody' ),
      function ( error, result ) {
        if ( error ) {
          // TODO undo upvote
        } else {
          
        }
      }
  );
}

Template._fontMatcher.rendered = function () {
  // generate the first set of fonts
  Meteor.call( 'fonts', newFontsCallback );

  // TODO load fonts if they are in the hashes instead of Meteor.call
};

Template._fontMatcher.helpers( {
  // TODO using `.name` directly will sometimes throw
  // an error because our fonts might not have come back
  // from the server yet!
  fontNameHeading : function () {
    return Session.get( 'fontNameHeading' ).name;
  },
  fontNameBody : function () {
    return Session.get( 'fontNameBody' ).name;
  },
  fontHeading : function () {
    var currentFont = Session.get( 'fontNameHeading' );
    return "font-family: '" + currentFont.name + "';";
  },
  fontBody : function () {
    var currentFont = Session.get( 'fontNameBody' );
    return "font-family: '" + currentFont.name + "';";
  },
  hasUpvoted : function () {
    if ( Meteor.userId() ) {
      // TODO if the user is logged in, check if they have
      // upvoted for this particular set of fonts
    } else {
      // Not logged in, just use Sessions
      var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name
      return Session.get( 'hasUpvoted+' + hash );
    }
  },
  hasDownvoted : function () {
    if ( Meteor.userId() ) {
      // TODO if the user is logged in, check if they have
      // downvoted for this particular set of fonts
    } else {
      // Not logged in, just use Sessions
      var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name
      return Session.get( 'hasDownvoted+' + hash );
    }
  },
  hasFavorited : function () {
    // TODO
    return false;
  }
} );

Template._fontMatcher.events( {
  'click [data-action=upvote]' : function ( e ) {
    e.preventDefault();

    var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name

    if ( $( e.currentTarget ).is( ':not(.assertive' ) ) {
      // before we upvote, we need to undo our downvote if we have one
      if ( Session.get( 'hasDownvoted+' + hash ) ) {
        // Undownvote
        unDownvote();
      }

      upvote();
      
    } else {
      // Undo upvote
      unUpvote();
    }
    
  },
  'click [data-action=downvote]' : function ( e ) {
    e.preventDefault();

    var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name

    if ( $( e.currentTarget ).is( ':not(.assertive)' ) ) {
      // TODO before we downvote, we need to undo our upvote if we have one
      if ( Session.get( 'hasUpvoted+' + hash ) ) {
        // Unupvote
        unUpvote();
      }

      downvote();
    } else {
      // Undo downvote
      unDownvote();
    }
  },
  'click [data-action=new-font-set]' : function ( e ) {
    e.preventDefault();

    // load a new set of fonts
    Meteor.call( 'fonts', newFontsCallback );
  }
} );
