Migrations.add( 'fix-popular-fonts-v5', function () {
  FontCombo.update( {}, {
    $rename : {
      'bodySlug' : 'body',
      'headingSlug' : 'heading'
    }
  } );

  FontCombo.update( {}, {
    $rename : {
      'fontBody': 'body',
      'fontHeading': 'heading'
    }
  } );
}, 1 );