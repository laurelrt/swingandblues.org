'use strict';

function PaymentCtrl(session, $scope, $http, rsvpFlow) {
    rsvpFlow.setScreen(rsvpFlow.screens.payment);

    $scope.payment = session.payment;
    $scope.isSubmitting = false;

    $scope.finish = function () {
        if ($scope.isSubmitting) {
            // do nothing
            return;
        }
        $scope.isSubmitting = true;

        session.payment = $scope.payment;
        session.save();

        $http.put('/rsvp/data/payment', session.payment)
        .success(function () {
            // TODO: Disabled for deployment preview
            // $http.post('/rsvp/data/submit')
            // .success(function () {
                $scope.isSubmitting = false;

                session.meta.submitted = true;
                session.save();
                
                rsvpFlow.next(session);    
            // });
        });
    };

    $scope.setPayment = function (method) {
        $scope.payment.method = method;
    };

    $scope.isPayment = function (method) {
        return ($scope.payment.method === method);
    };
}
PaymentCtrl.$inject = ['session','$scope', '$http', 'rsvpFlow'];