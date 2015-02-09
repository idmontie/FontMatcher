// ================
// Votes Collection
// ================

Votes = new Mongo.Collection( 'votes' );

if ( Meteor.isServer ) {
  Meteor.publish( 'votes', function (  ) {
    var search = {
      ownerId : this.userId
    };

    return Votes.find( search )
  } )
}

if ( Meteor.isClient ) {
  Meteor.subscribe( 'votes' );
}