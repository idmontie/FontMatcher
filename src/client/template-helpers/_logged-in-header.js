Template._loggedInHeaderPopover.events( {
  'click [data-action=logout]' : function ( e ) {
    e.preventDefault();
    
    Meteor.logout();
    IonPopover.hide();
  }
} );