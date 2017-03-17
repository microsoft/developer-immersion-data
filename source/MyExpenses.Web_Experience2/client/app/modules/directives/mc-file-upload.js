(function () {
    'use strict';

    angular.module('expensesApp').directive('mcFileUpload', [
        mcFileUpload
    ]);

    function mcFileUpload() {

        var directive = {
            restrict: 'A',
            template: '<div class="image-preview"><img class="preview" src="/images/updateReceipt.png" style="max-width: 100%" /><input type="file" class="custom-uploader-input"/></div>',
            link: link
        };

        return directive;

        function link(scope, element, attrs, controller) {

            var fileReader = new FileReader();
            var container = element.find('.image-preview');

            fileReader.onload = function (event) {
                var result = event.target.result;
                scope.model.picture = getImageData(result);
                preview(container, result);
            };

            var fileInput = element.find('input[type="file"]');
            fileInput.bind('change', function (e) {
                var file = e.target.files[0];
                if (file) {
                    fileReader.readAsDataURL(file);
                }
            });

            if (scope.model.picture) {
                preview(container, getSrc(scope.model.picture));
            }
        }

        function preview(element, src) {
            element.find('img').remove();
            element.prepend($('<img class="preview" src="' + src + '"></img>'));
        }

        function getImageData(fileReaderResult) {
            var index = fileReaderResult.indexOf(',');

            if (index) {
                return fileReaderResult.substr(index + 1);
            } else {
                return fileReaderResult;
            }
        }

        function getSrc(data) {
            return 'data:image/jpg;base64,' + data;
        }
    }

}());