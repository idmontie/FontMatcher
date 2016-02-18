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
 * Get new fonts
 */
function newFonts() {
  var lockHeading = Session.get( 'lockedHeading' );
  var lockBody    = Session.get( 'lockedBody' );
  var heading = null;
  var body    = null;

  if ( lockHeading ) {
    heading = Session.get( 'fontNameHeading' ).slug;
  }

  if ( lockBody ) {
    body = Session.get( 'fontNameBody' ).slug;
  }

  Meteor.call( 'fonts', heading, body, newFontsCallback );
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
    newFonts();
  }

  window.onpopstate = function ( event ) {
    if ( event.state && event.state.fontNameHeading ) {
      Meteor.call(
        'fonts', 
        event.state.fontNameHeading.slug,
        event.state.fontNameBody.slug,
        newFontsCallbackNoPush
      );
    } else if (window.location.pathname === '/fontcombo') {
      window.history.back();
    }
  }

  // ==============
  // Global Hotkeys
  // ==============

  globalHotkeys = new Hotkeys();

  globalHotkeys.add( {
    combo : 'w',
    callback : function () {
      var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name

      if ( Session.get( 'hasUpvoted+' + hash ) ) {
        unUpvote();
      } else {
        upvote();
      }
    }
  } );

  globalHotkeys.add( {
    combo : 's',
    callback : function () {
      var hash = Session.get( 'fontNameHeading' ).name +
        '+' +
        Session.get( 'fontNameBody' ).name

      if ( Session.get( 'hasDownvoted+' + hash ) ) {
        unDownvote();
      } else {
        downvote();
      }
    }
  } );
  
  globalHotkeys.add( {
    combo : 'd',
    callback : function () {
      // load a new set of fonts
      newFonts();
    }
  } );

  // only if current user
  // TODO need to do this reactively to add the hotkey when users log in.
  if ( Meteor.userId() ) {
    globalHotkeys.add( {
      combo : 'f',
      callback : function () {
        var heading = Session.get( 'fontNameHeading' );
        var body    = Session.get( 'fontNameBody' );

        var favorite = Favorites.findOne( {
          headingSlug : heading.slug,
          bodySlug : body.slug
        } );

        if ( favorite == null ) {
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
      }
    } );
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
  },
  lockedHeading : function () {
    return Session.get( 'lockedHeading' );
  },
  lockedBody : function () {
    return Session.get( 'lockedBody' );
  }
} );

Template._fontMatcher.events( {
  'mouseenter [data-tooltip-content]' : function ( e ) {
    // is NOT a touch device
    var isTouchDevice = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch;
    if ( ! isTouchDevice ) {
      // does NOT have tooltip
      var hasTooltip = $( e.currentTarget ).data( 'has-tooltip' ) === true;

      if ( ! hasTooltip ) {
        // show tooltip
        var position = $( e.currentTarget ).attr('data-tooltip-position') || 'bottom';

        $( e.currentTarget ).data( 'has-tooltip', true );

        Tipped.create(
          $( e.currentTarget ), 
          $( e.currentTarget ).attr('data-tooltip-content'), 
          {
            position: position 
          }
        );  
      }
    }
  },
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
    newFonts();
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
  },
  'click [data-action=lock-heading]' : function ( e ) {
    e.preventDefault();

    Session.set( 'lockedHeading', true );
  },
  'click [data-action=unlock-heading]' : function ( e ) {
    e.preventDefault();

    Session.set( 'lockedHeading', false );
  },
  'click [data-action=lock-body]' : function ( e ) {
    e.preventDefault();

    Session.set( 'lockedBody', true );
  },
  'click [data-action=unlock-body]' : function ( e ) {
    e.preventDefault();

    Session.set( 'lockedBody', false );
  },
  /**
   * Hack to allow hotkeys after editting a contenteditable.
   * In a perfect world, this code would not need to exist.
   */
  'blur [contenteditable]' : function ( e ) {
    $( e.currentTarget ).removeAttr('contenteditable').blur();
    window.getSelection().removeAllRanges();

    setTimeout( function () {
      $( e.currentTarget ).attr('contenteditable', true);
    }, 100 );
  }
} );
