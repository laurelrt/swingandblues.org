<!doctype html>
<html lang="en" ng-app="myApp">
<head>
  <meta charset="utf-8">
  <title>Admin</title>
  <!--#include virtual = "/inc/head-common.html" -->
  <link rel="stylesheet" href="css/app.css"/>
    <!--#include virtual = "/inc/head-analytics.aspx" -->
</head>
<body>
<!--#include virtual = "/inc/header.html" -->  
<div> 
<div style="background-color: white; margin: 3em; margin-top: 1em; padding: 3em; padding-top: 1em">
  <h1>Administration</h1>

  <ul class="menu">
    <li><a href="/data/admin/auth/google">Login</a></li>
    <li><a href="#/guests">Guest list</a></li>
    <li><a href="#/payments">Payments</a></li>
    <li><a href="#/housing">Housing</a></li>
    <li><a href="#/shirts">Shirts</a></li>
    <li><a href="#/train">Train</a></li>
    <li><a href="#/carpool">Carpool</a></li>
    <li><a href="#/volunteers">Volunteers</a></li>
    <li><a href="#/blues">Blues</a></li>
    <li><a href="#/all">All</a></li>
    <li><a href="/data/admin/auth/logout">Logout</a></li>
  </ul>

  <div ng-view></div>

  <div>Corvallis Swing &amp; Blues Administration: v<span app-version></span></div>

</div>
</div>
<!--#include virtual = "/inc/footer.html" -->  

  <!-- In production use:
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.0.2/angular.min.js"></script>
  -->
  <script src="lib/angular/angular.js"></script>
  <script src="js/app.js"></script>
  <script src="js/services.js"></script>
  <script src="js/controllers.js"></script>
  <script src="js/filters.js"></script>
  <script src="js/directives.js"></script>
</body>
</html>


</body>
</html>
