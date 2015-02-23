Template.fontCombo.helpers( {
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
  }
} );

