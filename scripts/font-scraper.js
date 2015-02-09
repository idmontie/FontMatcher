// =====================
// Google Fonts Scraper
//
// Ivan Montiel
// Feb 8, 2015
// =====================

// Pretty sure this violates some sort of terms
// of service EULA.

// Get the font elements
var fels = document.getElementsByClassName( 'fontcard' );
var fontNames = [];

for ( var i = 0; i < fels.length; i++ ) {
  // Get the fontname elements
  // There should only be one object in fnels.
  var fnels = fels[i].getElementsByClassName( 'fontname' );
  var sels  = fnels[0].getElementsByTagName( 'span' );
  var fontName = sels[0].textContent;


  // Get the preview element
  var pels = fels[i].getElementsByClassName( 'preview' );

  // Get the font slug based on the class name
  // Should be good for now, but will probably
  // change in the future (i.e. if this script
  // stops working, this is why)
  var fontSlug = pels[0].classList[1];
  fontNames.push( {
    name : fontName,
    slug: fontSlug 
  } );
}

// TODO some how scrape whether the font is serif or sans-serif

console.log( JSON.stringify( fontNames ) );