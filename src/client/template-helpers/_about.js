Template._about.onRendered(function () {
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
});
