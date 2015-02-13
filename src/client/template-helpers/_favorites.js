Template._favorites.helpers( {
  favorites : function () {
    return Favorites.find();
  },
  noFavorites : function () {
    return Favorites.find().fetch().length === 0;
  }
} );

Template._favorites.events( {
  'click [data-action=navigate]' : function ( e ) {
    e.preventDefault();
    IonModal.close();
    window.location.href = document.location.href.match(/(^[^#]*)/)[0] +
        '#' + this.headingSlug + '+' + this.bodySlug;

    // TODO do this correctly with push states
    window.location.reload();
  },
  /**
   * Not used
   */
  'click [data-action=delete]' : function ( e ) {
    e.preventDefault();

    Meteor.call(
      'unFavorite',
      this.headingSlug,
      this.bodySlug,
      function ( error ) {
        if ( error ) {
          alert( error.reason );
        }
      }
    );
  }
} );