function CategoryViewModel(name, items) {
    var self = this;
    self.name = ko.observable(name);
    self.items = ko.observableArray(items);
    self.isExpanded = ko.observable(false);
    self.isDragging = ko.observable(false);

    self.toggleCategory = function() {
        self.isExpanded(!self.isExpanded());
    };

    // method to move category
    self.moveCategory = function(newIndex) {
        var parentViewModel = ko.dataFor(document.getElementById('documents-app'));
        var currentIndex = parentViewModel.categories.indexOf(self);
        
        if (currentIndex >= 0 && newIndex >= 0 && newIndex < parentViewModel.categories().length) {
            // remove category and insert new index
            var removedCategory = parentViewModel.categories.splice(currentIndex, 1)[0];
            parentViewModel.categories.splice(newIndex, 0, removedCategory);
        }
    };

    // method to move item within the same category
    self.moveItemInCategory = function(item, newIndex) { };

}

function ItemViewModel(name, category) {
    var self = this;
    self.name = ko.observable(name);
    self.category = ko.observable(category);
}

function AppViewModel() {
    var self = this;

    self.categories = ko.observableArray([
        new CategoryViewModel("Обязательные для всех", [
            new ItemViewModel("Паспорт"),
            new ItemViewModel("Инн")
        ]),
        new CategoryViewModel("Обязательные для трудоустройства", [
            new ItemViewModel("Паспорт"),
        ]),
        new CategoryViewModel("Специальные", [
            new ItemViewModel("Паспорт"),
        ])
    ]);

    self.draggedCategory = null;
    self.hoveredCategory = ko.observable(null); // Track hovered category

    // mouse down event handler
    self.handleCategoryMouseDown = function(category, event) {
        if (event.which === 1) {
            self.draggedCategory = category;
            self.draggedCategory.isDragging(true);
            self.isMouseButtonDown = true;
        }
    };

    // mouse up event handler
    self.handleCategoryMouseUp = function(category, event) {
        if (self.isMouseButtonDown && self.draggedCategory) {
            var draggedIndex = self.categories.indexOf(self.draggedCategory);

            var targetIndex = self.categories.indexOf(category);
            
            if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
                self.categories.splice(draggedIndex, 1);
                self.categories.splice(targetIndex, 0, self.draggedCategory);
            }

            self.draggedCategory.isDragging(false);
            self.hoveredCategory(false);
            self.draggedCategory = null;
            self.isMouseButtonDown = false;

            // reset drop target state after a short delay
            setTimeout(function() {
                category.resetDropTarget();
            }, 100);
        }
    };

    // mouse move event handler to update hovered category
    self.handleCategoryMouseMove = function(category, event) {
        if (self.isMouseButtonDown && self.draggedCategory && category !== self.draggedCategory) {
            self.hoveredCategory(category);
        }
    };
}

ko.applyBindings(new AppViewModel());
