Meteor.methods( {
  favorite : function ( headingSlug, bodySlug ) {
    var headingFont = Fonts.findOne( {
      slug : headingSlug
    } );

    var bodyFont = Fonts.findOne( {
      slug : bodySlug
    } );

    var favorite = Favorites.insert( {
      headingSlug : headingSlug,
      bodySlug : bodySlug,
      headingFont : headingFont,
      bodyFont : bodyFont,
      ownerId : Meteor.userId()
    } );

    return favorite;
  },
  unFavorite : function ( headingSlug, bodySlug ) {
    Favorites.remove( {
      headingSlug : headingSlug,
      bodySlug : bodySlug,
      ownerId : Meteor.userId()
    } );

    return true;
  } 
} );
