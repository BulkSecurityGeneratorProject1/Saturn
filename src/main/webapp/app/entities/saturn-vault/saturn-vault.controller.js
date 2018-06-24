(function () {
    'use strict';

    angular
        .module('saturnApp')
        .controller('SaturnVaultController', SaturnVaultController);

    SaturnVaultController.$inject = ['$scope', '$state', 'SaturnVault', 'ParseLinks', 'AlertService', 'paginationConstants', 'pagingParams'];

    function SaturnVaultController($scope, $state, SaturnVault, ParseLinks, AlertService, paginationConstants, pagingParams) {
        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.toggleVisible = toggleVisible;
        vm.copyToClip = copyToClip;

        loadAll();

        function loadAll() {
            SaturnVault.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }

            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.saturnPasses = data;
                vm.saturnPasses.forEach(pass => {
                    pass.show = false
                });
                vm.page = pagingParams.page;
            }

            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage(page) {
            vm.page = page;
            vm.transition();
        }

        function toggleVisible(id) {
            //TODO show password and change eye icon
            vm.saturnPasses.forEach(pass => {
                if(pass.id === id){
                    pass.show = !pass.show
                }
            })
        }

        function copyToClip(text){
            var fakeInput = document.createElement("input");
            fakeInput.value = text;
            document.body.appendChild(fakeInput);
            fakeInput.focus();
            fakeInput.select();
            document.execCommand("copy");
            console.debug("Copied pass to clipboard")
            document.body.removeChild(fakeInput);
        }

        function transition() {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }
    }
})();
