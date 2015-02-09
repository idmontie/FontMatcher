Migrations.add( 'populate-fonts-v1', function () {
  // add in all of the fonts.

  var fonts = JSON.parse( Assets.getText( 'google-fonts.json' ) );

  for ( var i = 0; i < fonts.length; i++ ) {
    Fonts.insert( fonts[i] );
  }
} );