// ================================
// Home Template Helpers and Events
// ================================

function newFontsCallback( error, result ) {
  if ( error ) {
    // TODO
  } else {
    Session.set( 'fontNameHeading', result.fontNameHeading );
    Session.set( 'fontNameBody', result.fontNameBody );

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

Template._fontMatcher.events( {
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
