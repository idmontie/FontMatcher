Template.topRated.rendered = function () {
  Meteor.call( 'getTopRatedFonts', function ( error, result ) {
    if ( error ) {
      alert( error );
    } else {
      Session.set( 'topRatedFonts', result );

      var fonts = [];
      _.map( result, function ( fontCombo ) {
        if ( fontCombo.heading )
          fonts.push( fontCombo.heading.name );
        if ( fontCombo.body )
          fonts.push( fontCombo.body.name );
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
      this.heading.slug + '+' + 
      this.body.slug );
  }
} );