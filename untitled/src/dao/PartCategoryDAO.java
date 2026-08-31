package dao;

import model.PartCategory;
import java.util.ArrayList;
import java.util.List;

public class PartCategoryDAO {
    private List<PartCategory> categories = new ArrayList<>();

    public PartCategoryDAO() {
        // Load mock categories (categoryId, categoryName)
        categories.add(new PartCategory(101, "Performance"));
        categories.add(new PartCategory(102, "Exterior"));
        categories.add(new PartCategory(103, "Interior"));
        categories.add(new PartCategory(104, "Wheels"));
    }

    public List<PartCategory> getAllCategories() {
        return categories;
    }
}

/*What it does: Stores the structural categories used to organize upgrades
initializes hardcoded partCategory object into a list
getAllCategories: provides the list of categories so your user interface knows how to group options.
 */