angular.module('app')
.run(runBlock);

runBlock.$inject = ['$rootScope', '$state', '$window'];
function runBlock ($rootScope, $state, $window) {
    $rootScope.stateIsLoading = false;
    $rootScope.$on('$stateChangeStart', function() {
        $rootScope.stateIsLoading = true;
    });
    $rootScope.$on('$stateChangeSuccess', function() {
        $rootScope.stateIsLoading = false;
    });
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){ 
        $rootScope.stateIsLoading = false;
        // this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
        event.preventDefault();
        console.log('error caught by $stateChangeError is:'); 
        console.log(error); 
   		if (angular.isObject(error) && angular.isString(error.code)) {
            switch (error.code) {
                case 'NOT_AUTHENTICATED':
                    // go to the login page
      				console.log('case NOT_AUTHENTICATED');
                    $state.get('app.error').error = error;
                    $state.go('app.error');
                    break;
                default:
                    // set the error object on the error state and go there
                    //console.log('case default');
                    $state.get('app.error').error = error;
                    $state.go('app.error');
            }
        }
        else {
            // unexpected error
            //console.log('case unexpected error');
            $state.go('app.error');
        }	
    });

    $window.onbeforeunload = function () {
        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        if (event.defaultPrevented) {
            return confirmation.message;
        }
    };      

    angular.element($window).bind('resize', function(){
     $rootScope.$broadcast('window-resize');
    });

}