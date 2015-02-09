// ====================
// Favorites Collection
// ====================

Favorites = new Mongo.Collection( 'favorites' );

if ( Meteor.isServer ) {
  Meteor.publish( 'favorites', function (  ) {
    var search = {
      ownerId : this.userId
    };

    return Favorites.find( search )
  } )
}

if ( Meteor.isClient ) {
  Meteor.subscribe( 'favorites' );
}