(function(){'use strict';angular.module('northstar',[]).controller('PortalController',['$http',function($http){
 const vm=this;vm.year=new Date().getFullYear();vm.loading=true;vm.clients=[];vm.metrics=[];
 const path=decodeURIComponent(window.location.pathname);const match=path.match(/^\/clients\/([A-Za-z0-9-]+)\/?$/);
 vm.page=match?'detail':path.replace(/\/$/,'')==='/clients'?'clients':'home';
 const endpoint=match?'/api/clients/'+encodeURIComponent(match[1]):vm.page==='clients'?'/api/clients':'/api/metrics';
 $http.get(endpoint).then(function(response){if(vm.page==='detail')vm.client=response.data;else if(vm.page==='clients')vm.clients=response.data;else{const m=response.data;vm.metrics=[{label:'Total clients',value:m.totalClients},{label:'Portfolio value',value:new Intl.NumberFormat('en-CA',{style:'currency',currency:'CAD',maximumFractionDigits:0}).format(m.totalPortfolioValue)},{label:'High-risk clients',value:m.highRisk},{label:'KYC pending',value:m.kycPending}];}}).catch(function(error){vm.error=error.status===404?'Client not found.':'Unable to load client data. Please try again.';}).finally(function(){vm.loading=false;});
 }]);})();
