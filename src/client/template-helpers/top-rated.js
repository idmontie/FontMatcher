Template.topRated.rendered = function () {
  Meteor.call( 'getTopRatedFonts', function ( error, result ) {
    if ( error ) {
      alert( error );
    } else {
      Session.set( 'topRatedFonts', result );

      var fonts = [];
      _.map( result, function ( fontCombo ) {
        if ( fontCombo.fontHeading )
          fonts.push( fontCombo.fontHeading.name );
        if ( fontCombo.fontBody )
          fonts.push( fontCombo.fontBody.name );
      } );

      fonts = _.uniq( fonts );

      // Load the fonts
      WebFont.load( {
        google: {
          families: fonts
        }
      } );
    }
  } );
};

Template.topRated.helpers( {
  topRatedFonts : function () {
    return Session.get( 'topRatedFonts' );
  }
} );

Template.topRated.events( {
  'click [data-action=navigate]' : function ( e ) {
    e.preventDefault();

    Router.go( '/fontcombo' + '#' + 
      this.fontHeading.slug + '+' + 
      this.fontBody.slug );
  }
} );