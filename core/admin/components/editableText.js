/**
 * Created by zeev on 2016/7/23 0023.
 */

angular.module('app.component')
	.component('editableText', {
		bindings  : {
			editableText: '=',
			editMode    : '=',
			placeholder : '@',
			onChange    : '&'
		},
		transclude: true,
		template  : '<span ng-class="{\'is-placeholder\': placeholder && !$ctrl.editingValue}">' +
		'<input ng-show="$ctrl.isEditing" ng-blur="isEditing=false;" ng-keypress="($event.which === 13) && (isEditing = false)" ng-model="editingValue" placeholder="{{$ctrl.placeholder}}"/>' +
		'<span ng-hide="$ctrl.isEditing || $ctrl.isWorking" class="original-text" tabindex="0" ng-click="$ctrl.isEditing=true" ng-focus="$ctrl.isEditing=true;">{{placeholder ? ($ctrl.editingValue ? $ctrl.editingValue : placeholder) : $ctrl.editingValue}}</span>' +
		'<span ng-hide="$ctrl.isEditing" ng-transclude></span>' +
		'<span ng-show="$ctrl.isWorking" class="">' + 12 + '</span>' +
		'</span>',
		controller: function () {
			var ctrl = this;

			ctrl.delete = function () {
				ctrl.onDelete({ hero: ctrl.hero });
			};
			ctrl.update = function (prop, value) {
				ctrl.onUpdate({ hero: ctrl.hero, prop: prop, value: value });
			};
		}
	})
