Template._signIn.events( {
  'click [data-action=sign-in]' : function ( e ) {
    e.preventDefault();

    Meteor.loginWithGithub( { loginStyle: "redirect" } );
  }
} );
