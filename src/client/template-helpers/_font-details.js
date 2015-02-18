// TODO generalize for non-google fonts

function fontCodeWrap ( name ) {
  var html = '<link href="https://fonts.googleapis.com/';
  html    += 'css?family=';
  html    += name.replace( ' ', '+' );
  html    += '" rel="stylesheet" type="text/css" />';
  return html;
}

function fontLinkWrap ( name ) {
  var link = 'http://www.google.com/fonts/specimen/';
  link += name.replace( ' ', '+' );
  return link;
}

Template._fontDetails.rendered = function () {
  if ( Meteor.isCordova ) {
    $( 'a[target="_blank"]' ).click( function ( e ) {
      e.preventDefault();

      window.open(
          $( e.currentTarget ).attr( 'href' ),
          '_system',
          ''
      );
    } );
  }
};

Template._fontDetails.helpers( {
  fontHeading : function () {
    var heading = Session.get( 'fontNameHeading');
    if ( heading ) {
      return heading.name;
    }

    return '';
  },
  fontBody : function () {
    var body = Session.get( 'fontNameBody' );
    if ( body ) {
      return body.name;
    }

    return '';
  },
  fontHeadingCode : function () {
    var heading = Session.get( 'fontNameHeading');
    if ( heading ) {
      return fontCodeWrap( heading.name );
    }

    return '';
  },
  fontBodyCode : function () {
    var body = Session.get( 'fontNameBody' );
    if ( body ) {
      return fontCodeWrap( body.name );
    }

    return '';
  },
  fontHeadingLink : function () {
    var heading = Session.get( 'fontNameHeading' );
    if ( heading ) {
      return fontLinkWrap( heading.name );
    }

    return '';
  },
  fontBodyLink : function () {
    var body = Session.get( 'fontNameBody' );
    if ( body ) {
      return fontLinkWrap( body.name );
    }

    return '';
  },
  rating : function () {
    // total upvotes - 0.5 total downvotes
    // normalize between -100 and 100

    Tracker.autorun( function () {
      var heading = Session.get( 'fontNameHeading');
      var body = Session.get( 'fontNameBody' );
      if ( heading && body ) {
        Meteor.call(
            'getVotes',
            Session.get( 'fontNameHeading'),
            Session.get( 'fontNameBody'),
            function ( error, result ) {
              if ( error ) {
                alert( error.reason );
              } else {
                // Force reactivity

                Session.set( 'ratingsUp', result.up );
                Session.set( 'ratingsDown', result.down );

                var weight =  result.up - ( 0.5 * result.down ); 
                var total = result.up + result.down;
                var normal =  ( 200.0 * ( weight + total ) ) / ( 2.0 * total ) - 100.0;

                $( '#rating-slider' ).val( Math.floor( normal ) );
              }
            }
        );
      }
    } );

    var up = Session.get( 'ratingsUp' );
    var down = Session.get( 'ratingsDown' );

    return Math.ceil( up - ( 0.5 * down ) );
  }
} );
