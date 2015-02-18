Template._signIn.events( {
  'click [data-action=sign-in]' : function ( e ) {
    e.preventDefault();

    if ( Meteor.isCordova ) {
      Meteor.loginWithGithub( { loginStyle: "popup" } );
    } else {
      Meteor.loginWithGithub( { loginStyle: "redirect" } );
    }

    IonModal.close();
  }
} );
