// ======
// Router
// ======

Router.configure( {
  layoutTemplate: 'layout',
  trackPageView: true
} );

Meteor.startup(function () {
  if (Meteor.isClient) {
    var location = Iron.Location.get();
    if (location.queryObject.platformOverride) {
      Session.set('platformOverride', location.queryObject.platformOverride);
    }
  }
});

Router.route( '/', {
  name : 'home'
} );

Router.route( '/fontcombo/', {
  name : 'fontCombo'
} );

Router.route( '/fontcombo/top', {
  name : 'topRated'
} );