import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http, $log, $scope, socket) {
    this.$http = $http;
    this.$log = $log;
    this.$scope = $scope;
    this.socket = socket;
  }

  $onInit() {
    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
      });

    this.socket.on('name', data => {
      this.name = data;
      this.$log.log(data);
      this.$scope.$apply();
    });
    this.socket.open();
  }

  $onDestroy() {
    this.socket.removeAllListeners('name');
    this.socket.disconnect();
  }

  addThing() {
    if(this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('remoDiScaleApp.main', [uiRouter])
  .config(routing)
  .factory('socket', function() {
    var socket = io({reconnection: false});
    return socket;
  })
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
