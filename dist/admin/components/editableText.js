angular.module("app.component").component("editableText",{bindings:{editableText:"=",editMode:"=",placeholder:"@",onChange:"&"},transclude:!0,template:'<span ng-class="{\'is-placeholder\': placeholder && !$ctrl.editingValue}"><input ng-show="$ctrl.isEditing" ng-blur="isEditing=false;" ng-keypress="($event.which === 13) && (isEditing = false)" ng-model="editingValue" placeholder="{{$ctrl.placeholder}}"/><span ng-hide="$ctrl.isEditing || $ctrl.isWorking" class="original-text" tabindex="0" ng-click="$ctrl.isEditing=true" ng-focus="$ctrl.isEditing=true;">{{placeholder ? ($ctrl.editingValue ? $ctrl.editingValue : placeholder) : $ctrl.editingValue}}</span><span ng-hide="$ctrl.isEditing" ng-transclude></span><span ng-show="$ctrl.isWorking" class="">12</span></span>',controller:function(){var e=this;e.delete=function(){e.onDelete({hero:e.hero})},e.update=function(n,i){e.onUpdate({hero:e.hero,prop:n,value:i})}}});