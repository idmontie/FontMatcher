// ================================
// Home Template Helpers and Events
// ================================

// TODO better error messages

/**
 * Setup for new fonts
 */
function newFontsCallback( error, result, noPush ) {
  if ( error ) {
    alert( error.reason );
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
    if ( noPush != true ) {
      ga( 'send', 'event', 'button', 'click', 'new fonts', 1 );

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
}

function newFontsCallbackNoPush( error, result ) {
  newFontsCallback( error, result, true );
}

/**
 * Upvote.
 *
 * Sets the sessions and calls the server
 */
 // TODO refactor un/up/downvote code, its 90% the same
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
          // undo upvote
          Session.set( 'hasUpvoted+' + hash, false );
          alert( error.reason );
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
          Session.set( 'hasUpvoted+' + hash, true );
          alert( error.reason );
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
        Session.set( 'hasDownvoted+' + hash, false );
        alert( error.reason );
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
          Session.set( 'hasDownvoted+' + hash, true );
          alert( error.reason );
        }
      }
  );
}

Template._fontMatcher.rendered = function () {
  // load fonts if they are in the hashes instead of Meteor.call
  if ( window.location.hash && window.location.hash.length > 2 ) {
    var fontSlugs = window.location.hash.replace( '#', '' ).split( '+' );
    Meteor.call( 'fonts', fontSlugs[0], fontSlugs[1], newFontsCallback );
  } else {
    // generate the first set of fonts
    Meteor.call( 'fonts', newFontsCallback );
  }

  window.onpopstate = function ( event ) {
    console.log( event );
    Meteor.call(
      'fonts', 
      event.state.fontNameHeading.slug,
      event.state.fontNameBody.slug,
      newFontsCallbackNoPush
    );
  }
};

Template._fontMatcher.helpers( {
  fontNameHeading : function () {
    var heading = Session.get( 'fontNameHeading');
    if ( heading ) {
      return heading.name;
    }

    return '';
  },
  fontNameBody : function () {
    var body = Session.get( 'fontNameBody' );
    if ( body ) {
      return body.name;
    }

    return '';
  },
  fontHeading : function () {
    var currentFont = Session.get( 'fontNameHeading' );
    if ( currentFont ) {
      return "font-family: '" + currentFont.name + "';";
    }
    
    return '';
  },
  fontBody : function () {
    var currentFont = Session.get( 'fontNameBody' );
    if ( currentFont ) {
      return "font-family: '" + currentFont.name + "';";  
    }
    
    return '';
  },
  hasUpvoted : function () {
    var heading = Session.get( 'fontNameHeading' );
    var body    = Session.get( 'fontNameBody' );

    if ( heading && body ) {
      if ( Meteor.userId() ) {
        // if the user is logged in, check if they have
        // upvoted for this particular set of fonts
        var vote = Votes.findOne( {
          'heading.slug' : heading.slug,
          'body.slug' : body.slug,
          upvote : true
        } );
        
        if ( vote ) {
          return true;
        }
      } else {
        // Not logged in, just use Sessions
      
        var hash = heading.name + '+' + body.name
        return Session.get( 'hasUpvoted+' + hash );
      }      
    }

    return false;
  },
  hasDownvoted : function () {
    var heading = Session.get( 'fontNameHeading' );
    var body    = Session.get( 'fontNameBody' );

    if ( heading && body ) {
      if ( Meteor.userId() ) {
        // if the user is logged in, check if they have
        // downvoted for this particular set of fonts
        var vote = Votes.findOne( {
            'heading.slug' : heading.slug,
            'body.slug' : body.slug,
            downvote : true
          } );
          
          if ( vote ) {
            return true;
          }
      } else {
        // Not logged in, just use Sessions
        
        var hash = heading.name + '+' + body.name;
        return Session.get( 'hasDownvoted+' + hash );  
      }
    }

    return false;
  },
  hasFavorited : function () {
    if ( Meteor.userId() ) {
      var heading = Session.get( 'fontNameHeading' );
      var body    = Session.get( 'fontNameBody' );

      if ( heading && body ) {
        var favorite = Favorites.findOne( {
          headingSlug : heading.slug,
          bodySlug : body.slug
        } );

        return ( favorite != null );
      }
    }

    return false;
  }
} );

Template._fontMatcher.events( {
  'click [data-action=upvote]' : function ( e ) {
    e.preventDefault();

    var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name

    if ( $( e.currentTarget ).is( ':not(.assertive)' ) ) {
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
      // before we downvote, we need to undo our upvote if we have one
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
  },
  'click [data-action=favorite]' : function ( e ) {
    e.preventDefault();

    if ( $( e.currentTarget ).is( ':not(.assertive)' ) ) {
      // Favorite
      Meteor.call(
        'favorite',
        Session.get( 'fontNameHeading' ).slug,
        Session.get( 'fontNameBody' ).slug,
        function ( error, result ) {
          if ( error ) {
            alert( error.reason );
          }
        } 
      );
    } else {
      // Unfavorite
      Meteor.call(
        'unFavorite',
        Session.get( 'fontNameHeading' ).slug,
        Session.get( 'fontNameBody' ).slug,
        function ( error, result ) {
          if ( error ) {
            alert( error.reason );
          }
        }
      );
    }
  },
  'click [data-action=details]' : function ( e ) {
    e.preventDefault();
  }
} );
