UI.registerHelper( 'isShortWindow', function () {
  var totalHeight = 0;
  $( '.content' ).children().each( function () {
    totalHeight = totalHeight + $( this ).outerHeight();
  } );

  totalHeight += $('.bar-header').first().height();
  totalHeight += ( $('.content').innerHeight() - $('.content').height() )

  return totalHeight > rwindow.innerHeight();
} );