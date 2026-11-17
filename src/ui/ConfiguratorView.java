package ui;
import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import model.Part;
import model.PartCategory;
import model.Vehicle;
import service.ConfiguratorService;

import java.util.ArrayList;
import java.util.List;

public class ConfiguratorView extends BorderPane {

    private final ConfiguratorService service = new ConfiguratorService();
    private Vehicle selectedVehicle;
    private final List<Part> selectedParts = new ArrayList<>();

    // UI Components
    private final ComboBox<Vehicle> vehicleSelector = new ComboBox<>();
    private final TabPane categoryTabs = new TabPane();
    private final Label basePriceLabel = new Label("$0.00");
    private final Label upgradesPriceLabel = new Label("$0.00");
    private final Label totalPriceLabel = new Label("$0.00");
    private final Label vehicleTitleLabel = new Label();
    private final Label selectedBuildLabel = new Label("No upgrades selected");

    public ConfiguratorView() {
        setPadding(new Insets(15));
        setTop(buildHeaderAndCarSelect());
        setCenter(buildCenterWorkspace());
        setBottom(buildSummaryBar());

        loadVehicles();
    }

    private VBox buildHeaderAndCarSelect() {
        VBox topBox = new VBox(10);
        topBox.setPadding(new Insets(0, 0, 15, 0));

        Label title = new Label("AUTOTORIUM // JDM CONFIGURATOR");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 20));

        HBox selectRow = new HBox(10);
        selectRow.setAlignment(Pos.CENTER_LEFT);
        Label selectLabel = new Label("Select Vehicle:");

        vehicleSelector.setPrefWidth(320);
        vehicleSelector.setOnAction(e -> handleVehicleChange());

        Button resetBtn = new Button("Reset Build");
        resetBtn.setOnAction(e -> handleVehicleChange());

        selectRow.getChildren().addAll(selectLabel, vehicleSelector, resetBtn);
        topBox.getChildren().addAll(title, selectRow, new Separator());
        return topBox;
    }

    private SplitPane buildCenterWorkspace() {
        SplitPane splitPane = new SplitPane();

        // Left Panel: Car Display & Live Build Manifest
        VBox carPreviewBox = new VBox(12);
        carPreviewBox.setAlignment(Pos.CENTER);
        carPreviewBox.setPadding(new Insets(20));
        carPreviewBox.setStyle("-fx-border-color: #cccccc; -fx-border-radius: 5;");

        vehicleTitleLabel.setFont(Font.font("Arial", FontWeight.BOLD, 16));

        Label previewLabel = new Label("[ Vehicle Viewport / Image Placeholder ]");
        previewLabel.setStyle("-fx-text-fill: #777777; -fx-font-style: italic;");

        Separator sep = new Separator();
        Label buildHeader = new Label("Current Build Sheet:");
        buildHeader.setFont(Font.font("Arial", FontWeight.BOLD, 13));

        selectedBuildLabel.setWrapText(true);
        selectedBuildLabel.setStyle("-fx-text-fill: #333333;");

        carPreviewBox.getChildren().addAll(
                vehicleTitleLabel,
                previewLabel,
                sep,
                buildHeader,
                selectedBuildLabel
        );

        // Right Panel: Tabbed Compatible Upgrades
        categoryTabs.setTabClosingPolicy(TabPane.TabClosingPolicy.UNAVAILABLE);

        splitPane.getItems().addAll(carPreviewBox, categoryTabs);
        splitPane.setDividerPositions(0.45);
        return splitPane;
    }

    private HBox buildSummaryBar() {
        HBox bottomBar = new HBox(30);
        bottomBar.setAlignment(Pos.CENTER_RIGHT);
        bottomBar.setPadding(new Insets(15, 0, 0, 0));

        VBox baseBox = new VBox(2, new Label("Base MSRP:"), basePriceLabel);
        VBox upgradeBox = new VBox(2, new Label("Selected Options:"), upgradesPriceLabel);
        VBox totalBox = new VBox(2, new Label("TOTAL ESTIMATE:"), totalPriceLabel);

        totalPriceLabel.setFont(Font.font("Arial", FontWeight.BOLD, 18));

        bottomBar.getChildren().addAll(baseBox, upgradeBox, totalBox);
        return bottomBar;
    }

    private void loadVehicles() {
        List<Vehicle> vehicles = service.getAllVehicles();
        vehicleSelector.setItems(FXCollections.observableArrayList(vehicles));

        vehicleSelector.setCellFactory(lv -> new ListCell<>() {
            @Override
            protected void updateItem(Vehicle v, boolean empty) {
                super.updateItem(v, empty);
                setText(empty || v == null ? null : v.getName() + " - $" + String.format("%,.2f", v.getBasePrice()));
            }
        });
        vehicleSelector.setButtonCell(vehicleSelector.getCellFactory().call(null));

        if (!vehicles.isEmpty()) {
            vehicleSelector.getSelectionModel().selectFirst();
            handleVehicleChange();
        }
    }

    private void handleVehicleChange() {
        selectedVehicle = vehicleSelector.getSelectionModel().getSelectedItem();
        selectedParts.clear();
        if (selectedVehicle != null) {
            vehicleTitleLabel.setText(selectedVehicle.getName() + " (" + selectedVehicle.getType() + ")");
        }
        refreshCategoriesAndParts();
        updatePriceSummary();
    }

    private void refreshCategoriesAndParts() {
        categoryTabs.getTabs().clear();
        if (selectedVehicle == null) return;

        List<PartCategory> categories = service.getAllCategories();
        List<Part> compatibleParts = service.getCompatiblePartsForVehicle(selectedVehicle.getVehicleId());

        for (PartCategory cat : categories) {
            Tab tab = new Tab(cat.getName());
            VBox optionsList = new VBox(10);
            optionsList.setPadding(new Insets(15));

            // Wheels (104) are mutually exclusive; other categories allow multiple upgrades
            boolean isSingleSelectCategory = (cat.getCategoryId() == 104);

            if (isSingleSelectCategory) {
                ToggleGroup wheelGroup = new ToggleGroup();

                RadioButton stockOption = new RadioButton("Stock OEM Wheels (+$0.00)");
                stockOption.setToggleGroup(wheelGroup);
                stockOption.setSelected(true);
                stockOption.setOnAction(e -> {
                    selectedParts.removeIf(p -> p.getCategoryId() == cat.getCategoryId());
                    updatePriceSummary();
                });
                optionsList.getChildren().add(stockOption);

                for (Part part : compatibleParts) {
                    if (part.getCategoryId() == cat.getCategoryId()) {
                        RadioButton rb = new RadioButton(part.getName() + " (+$" + String.format("%,.2f", part.getPriceModifier()) + ")");
                        rb.setToggleGroup(wheelGroup);
                        rb.setOnAction(e -> {
                            selectedParts.removeIf(p -> p.getCategoryId() == cat.getCategoryId());
                            if (rb.isSelected()) {
                                selectedParts.add(part);
                            }
                            updatePriceSummary();
                        });
                        optionsList.getChildren().add(rb);
                    }
                }
            } else {
                for (Part part : compatibleParts) {
                    if (part.getCategoryId() == cat.getCategoryId()) {
                        CheckBox cb = new CheckBox(part.getName() + " (+$" + String.format("%,.2f", part.getPriceModifier()) + ")");
                        cb.setOnAction(e -> {
                            if (cb.isSelected()) {
                                selectedParts.add(part);
                            } else {
                                selectedParts.remove(part);
                            }
                            updatePriceSummary();
                        });
                        optionsList.getChildren().add(cb);
                    }
                }
            }

            ScrollPane scrollPane = new ScrollPane(optionsList);
            scrollPane.setFitToWidth(true);
            tab.setContent(scrollPane);
            categoryTabs.getTabs().add(tab);
        }
    }

    private void updatePriceSummary() {
        if (selectedVehicle == null) return;
        List<PartCategory> categories = service.getAllCategories();
        List<Part> compatibleParts = service.getCompatiblePartsForVehicle(selectedVehicle.getVehicleId());

        for (PartCategory cat : categories) {
            Tab tab = new Tab(cat.getName());
            VBox optionsList = new VBox(10);
            optionsList.setPadding(new Insets(15));

            ToggleGroup radioGroup = new ToggleGroup();

            for (Part part : compatibleParts) {
                if (part.getCategoryId() == cat.getCategoryId()) {
                    RadioButton rb = new RadioButton(part.getName() + " (+$" + String.format("%,.2f", part.getPriceModifier()) + ")");
                    rb.setToggleGroup(radioGroup);
                    rb.setOnAction(e -> {
                        // Mutually exclusive: remove previously selected part in this category
                        selectedParts.removeIf(p -> p.getCategoryId() == cat.getCategoryId());
                        if (rb.isSelected()) {
                            selectedParts.add(part);
                        }
                        updatePriceSummary();
                    });
                    optionsList.getChildren().add(rb);
                }
            }

            ScrollPane scrollPane = new ScrollPane(optionsList);
            scrollPane.setFitToWidth(true);
            tab.setContent(scrollPane);
            categoryTabs.getTabs().add(tab);
        }
    }

    private void updatePriceSummary() {
        if (selectedVehicle == null) return;

        double total = service.calculateTotalPrice(selectedVehicle, selectedParts);
        double upgrades = total - selectedVehicle.getBasePrice();

        basePriceLabel.setText(String.format("$%,.2f", selectedVehicle.getBasePrice()));
        upgradesPriceLabel.setText(String.format("$%,.2f", upgrades));
        totalPriceLabel.setText(String.format("$%,.2f", total));

        if (selectedParts.isEmpty()) {
            selectedBuildLabel.setText("No upgrades selected");
        } else {
            StringBuilder sb = new StringBuilder();
            for (Part p : selectedParts) {
                sb.append("• ").append(p.getName())
                  .append(" (+$").append(String.format("%,.2f", p.getPriceModifier())).append(")\n");
            }
            selectedBuildLabel.setText(sb.toString().trim());
        }
    }
}
