import javafx.collections.FXCollections;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.scene.paint.Color;
import javafx.scene.shape.Circle;
import javafx.scene.shape.Rectangle;
import javafx.scene.text.Font;
import javafx.scene.text.FontWeight;
import model.*;
import service.ConfiguratorService;

import java.util.ArrayList;
import java.util.List;

public class ConfiguratorView extends BorderPane {

    private final ConfiguratorService service = new ConfiguratorService();
    private Vehicle selectedVehicle;
    private PartCategory activeCategory;
    private final List<Part> selectedParts = new ArrayList<>();

    // Top Header Controls
    private final Button navVehiclesBtn = new Button("Vehicles");
    private final Button navBuildBtn = new Button("Build");
    private final Button navGarageBtn = new Button("Garage (0)");
    private final Button navTicketsBtn = new Button("Shop Tickets");
    private final Label headerSubLabel = new Label("Select a starting vehicle");
    private final Label livePricePill = new Label("$0");

    // Screen 2 (Build) Controls
    private final VBox categorySidebar = new VBox(8);
    private final Label buildCarTitle = new Label();
    private final Label buildCarSubtitle = new Label();
    private final Label categoryHeading = new Label();
    private final VBox partCardsContainer = new VBox(12);
    private final Label compatibilityDetailLabel = new Label();
    private final TextField buildNameInput = new TextField();

    // Screen 3 (Garage) Controls
    private final ListView<GarageBuild> garageListView = new ListView<>();
    private final TextArea garageDetailsArea = new TextArea();
    private final TextField customerNameField = new TextField();

    // Screen 4 (Tickets) Controls
    private final ListView<BuildTicket> ticketListView = new ListView<>();
    private final TextArea ticketSpecArea = new TextArea();
    private final ComboBox<String> ticketStatusBox = new ComboBox<>();

    public ConfiguratorView() {
        setStyle("-fx-background-color: #ffffff; -fx-font-family: 'Arial';");
        setTop(buildTopNavBar());

        // Pre-select first vehicle in background so Build tab works immediately if clicked
        List<Vehicle> vehicles = service.getAllVehicles();
        if (!vehicles.isEmpty()) {
            selectedVehicle = vehicles.get(0);
        }

        showVehiclesScreen();
    }

    // =========================================================
    // DARK TOP NAVIGATION BAR (Matches Driveform Header)
    // =========================================================
    private HBox buildTopNavBar() {
        HBox navBar = new HBox(20);
        navBar.setAlignment(Pos.CENTER_LEFT);
        navBar.setPadding(new Insets(14, 28, 14, 28));
        navBar.setStyle("-fx-background-color: #0b0f17;");

        Label brand = new Label("AUTOTORIUM");
        brand.setFont(Font.font("Arial", FontWeight.BOLD, 18));
        brand.setTextFill(Color.WHITE);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        headerSubLabel.setTextFill(Color.web("#cbd5e1"));
        headerSubLabel.setFont(Font.font("Arial", 13));

        styleNavButton(navVehiclesBtn, true);
        styleNavButton(navBuildBtn, false);
        styleNavButton(navGarageBtn, false);
        styleNavButton(navTicketsBtn, false);

        navVehiclesBtn.setOnAction(e -> showVehiclesScreen());
        navBuildBtn.setOnAction(e -> showBuildScreen());
        navGarageBtn.setOnAction(e -> showGarageScreen());
        navTicketsBtn.setOnAction(e -> showTicketsScreen());

        livePricePill.setPadding(new Insets(6, 18, 6, 18));
        livePricePill.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        livePricePill.setTextFill(Color.web("#38bdf8"));
        livePricePill.setStyle("-fx-background-color: #1e293b; -fx-background-radius: 16;");

        navBar.getChildren().addAll(
                brand,
                spacer,
                headerSubLabel,
                navVehiclesBtn,
                navBuildBtn,
                navGarageBtn,
                navTicketsBtn,
                livePricePill
        );
        return navBar;
    }

    private void styleNavButton(Button btn, boolean active) {
        btn.setFont(Font.font("Arial", active ? FontWeight.BOLD : FontWeight.NORMAL, 13));
        btn.setStyle(active
                ? "-fx-background-color: transparent; -fx-text-fill: #ffffff; -fx-cursor: hand;"
                : "-fx-background-color: transparent; -fx-text-fill: #94a3b8; -fx-cursor: hand;");
    }

    private void updateNavHighlight(Button activeBtn) {
        styleNavButton(navVehiclesBtn, activeBtn == navVehiclesBtn);
        styleNavButton(navBuildBtn, activeBtn == navBuildBtn);
        styleNavButton(navGarageBtn, activeBtn == navGarageBtn);
        styleNavButton(navTicketsBtn, activeBtn == navTicketsBtn);
    }

    // =========================================================
    // SCREEN 1: CHOOSE YOUR VEHICLE (Card Grid)
    // =========================================================
    private void showVehiclesScreen() {
        updateNavHighlight(navVehiclesBtn);
        headerSubLabel.setText("");
        livePricePill.setText("$0");

        VBox container = new VBox(20);
        container.setPadding(new Insets(30, 40, 30, 40));
        container.setStyle("-fx-background-color: #ffffff;");

        VBox headingBox = new VBox(6);
        Label title = new Label("Choose your vehicle");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 28));
        title.setTextFill(Color.web("#0f172a"));

        Label subtitle = new Label("Your selection controls which parts are available.");
        subtitle.setFont(Font.font("Arial", 14));
        subtitle.setTextFill(Color.web("#64748b"));
        headingBox.getChildren().addAll(title, subtitle);

        FlowPane cardGrid = new FlowPane(20, 20);
        cardGrid.setPrefWrapLength(920);

        for (Vehicle v : service.getAllVehicles()) {
            cardGrid.getChildren().add(createVehicleCard(v));
        }

        ScrollPane scroll = new ScrollPane(cardGrid);
        scroll.setFitToWidth(true);
        scroll.setStyle("-fx-background-color: transparent; -fx-background: #ffffff;");

        container.getChildren().addAll(headingBox, scroll);
        setCenter(container);
    }

    private VBox createVehicleCard(Vehicle vehicle) {
        boolean isSelected = (selectedVehicle != null && selectedVehicle.getVehicleId() == vehicle.getVehicleId());

        VBox card = new VBox(14);
        card.setPrefWidth(275);
        card.setPadding(new Insets(18));
        card.setStyle(isSelected
                ? "-fx-background-color: #eff6ff; -fx-border-color: #2563eb; -fx-border-width: 2; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;"
                : "-fx-background-color: #ffffff; -fx-border-color: #e2e8f0; -fx-border-width: 1.5; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;");

        // Clean geometric car silhouette matching slide style
        StackPane silhouette = buildCarGraphic(isSelected ? "#93c5fd" : "#cbd5e1", 190, 65);

        HBox infoRow = new HBox();
        infoRow.setAlignment(Pos.CENTER_LEFT);

        VBox nameBox = new VBox(3);
        Label nameLbl = new Label(vehicle.getName());
        nameLbl.setFont(Font.font("Arial", FontWeight.BOLD, 15));
        nameLbl.setTextFill(Color.web("#0f172a"));

        Label typeLbl = new Label(vehicle.getType() + " • JDM Spec");
        typeLbl.setFont(Font.font("Arial", 12));
        typeLbl.setTextFill(Color.web("#64748b"));
        nameBox.getChildren().addAll(nameLbl, typeLbl);

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label priceLbl = new Label(String.format("$%,.0f", vehicle.getBasePrice()));
        priceLbl.setFont(Font.font("Arial", FontWeight.BOLD, 15));
        priceLbl.setTextFill(Color.web("#2563eb"));

        infoRow.getChildren().addAll(nameBox, spacer, priceLbl);
        card.getChildren().addAll(silhouette, infoRow);

        card.setOnMouseClicked(e -> {
            selectedVehicle = vehicle;
            selectedParts.clear();
            buildNameInput.clear();
            activeCategory = null;
            showBuildScreen();
        });

        return card;
    }

    // =========================================================
    // SCREEN 2: CUSTOMIZE WITH LIVE COMPATIBILITY
    // =========================================================
    private void showBuildScreen() {
        if (selectedVehicle == null) {
            showVehiclesScreen();
            return;
        }

        updateNavHighlight(navBuildBtn);
        headerSubLabel.setText(selectedVehicle.getName() + " • " + selectedVehicle.getType());
        updateLivePrice();

        BorderPane buildLayout = new BorderPane();
        buildLayout.setStyle("-fx-background-color: #ffffff;");

        // Left Sidebar ("BUILD" + Categories)
        categorySidebar.getChildren().clear();
        categorySidebar.setPrefWidth(190);
        categorySidebar.setPadding(new Insets(28, 16, 28, 20));
        categorySidebar.setStyle("-fx-background-color: #f8fafc; -fx-border-color: #e2e8f0; -fx-border-width: 0 1 0 0;");

        Label sidebarTitle = new Label("BUILD");
        sidebarTitle.setFont(Font.font("Arial", FontWeight.BOLD, 11));
        sidebarTitle.setTextFill(Color.web("#64748b"));
        sidebarTitle.setPadding(new Insets(0, 0, 6, 10));
        categorySidebar.getChildren().add(sidebarTitle);

        List<PartCategory> categories = service.getAllCategories();
        if (activeCategory == null && !categories.isEmpty()) {
            activeCategory = categories.get(0);
        }

        for (PartCategory cat : categories) {
            Button catBtn = new Button(cat.getName());
            catBtn.setMaxWidth(Double.MAX_VALUE);
            catBtn.setAlignment(Pos.CENTER_LEFT);
            catBtn.setPadding(new Insets(10, 14, 10, 14));
            boolean isCurrent = (activeCategory != null && activeCategory.getCategoryId() == cat.getCategoryId());
            catBtn.setFont(Font.font("Arial", isCurrent ? FontWeight.BOLD : FontWeight.NORMAL, 14));
            catBtn.setStyle(isCurrent
                    ? "-fx-background-color: #e0e7ff; -fx-text-fill: #2563eb; -fx-background-radius: 10; -fx-cursor: hand;"
                    : "-fx-background-color: transparent; -fx-text-fill: #334155; -fx-cursor: hand;");

            catBtn.setOnAction(e -> {
                activeCategory = cat;
                showBuildScreen();
            });
            categorySidebar.getChildren().add(catBtn);
        }

        buildLayout.setLeft(categorySidebar);

        // Center + Right Split Content
        HBox mainStage = new HBox(30);
        mainStage.setPadding(new Insets(28, 35, 24, 35));

        // Center Vehicle Viewport
        VBox centerViewport = new VBox(16);
        centerViewport.setPrefWidth(360);
        buildCarTitle.setText(selectedVehicle.getName());
        buildCarTitle.setFont(Font.font("Arial", FontWeight.BOLD, 24));
        buildCarTitle.setTextFill(Color.web("#0f172a"));

        buildCarSubtitle.setText(selectedVehicle.getType() + " • Factory Base Spec");
        buildCarSubtitle.setFont(Font.font("Arial", 13));
        buildCarSubtitle.setTextFill(Color.web("#64748b"));

        StackPane largeCarGraphic = buildCarGraphic("#cbd5e1", 280, 115);
        largeCarGraphic.setPadding(new Insets(25, 0, 15, 0));

        buildNameInput.setPromptText("Name this build (e.g., Track Spec)");
        buildNameInput.setStyle("-fx-padding: 8 12; -fx-border-color: #cbd5e1; -fx-border-radius: 8; -fx-background-radius: 8;");

        centerViewport.getChildren().addAll(buildCarTitle, buildCarSubtitle, largeCarGraphic, new Label("Build Label:"), buildNameInput);

        // Right Part Packages Panel
        VBox rightPanel = new VBox(14);
        HBox.setHgrow(rightPanel, Priority.ALWAYS);

        categoryHeading.setText(activeCategory != null ? activeCategory.getName() + " packages" : "Packages");
        categoryHeading.setFont(Font.font("Arial", FontWeight.BOLD, 22));
        categoryHeading.setTextFill(Color.web("#0f172a"));

        partCardsContainer.getChildren().clear();
        List<Part> compatibleParts = service.getCompatiblePartsForVehicle(selectedVehicle.getVehicleId());

        // Add "Stock / Included" option for Wheels (104)
        if (activeCategory != null && activeCategory.getCategoryId() == 104) {
            boolean hasCustomWheel = selectedParts.stream().anyMatch(p -> p.getCategoryId() == 104);
            partCardsContainer.getChildren().add(createStockWheelCard(!hasCustomWheel));
        }

        for (Part part : compatibleParts) {
            if (activeCategory != null && part.getCategoryId() == activeCategory.getCategoryId()) {
                partCardsContainer.getChildren().add(createPartOptionCard(part));
            }
        }

        ScrollPane partsScroll = new ScrollPane(partCardsContainer);
        partsScroll.setFitToWidth(true);
        partsScroll.setStyle("-fx-background-color: transparent; -fx-background: #ffffff;");
        VBox.setVgrow(partsScroll, Priority.ALWAYS);

        // Bottom Compatibility Badge + Save to Garage CTA
        HBox footerRow = new HBox(12);
        footerRow.setAlignment(Pos.CENTER_LEFT);
        footerRow.setPadding(new Insets(10, 0, 0, 0));

        Label compatibleBadge = new Label("Compatible");
        compatibleBadge.setPadding(new Insets(6, 14, 6, 14));
        compatibleBadge.setFont(Font.font("Arial", FontWeight.BOLD, 12));
        compatibleBadge.setTextFill(Color.web("#15803d"));
        compatibleBadge.setStyle("-fx-background-color: #dcfce7; -fx-background-radius: 14;");

        compatibilityDetailLabel.setText("Fits " + selectedVehicle.getName());
        compatibilityDetailLabel.setFont(Font.font("Arial", 12));
        compatibilityDetailLabel.setTextFill(Color.web("#64748b"));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Button saveToGarageBtn = new Button("Save to Garage →");
        saveToGarageBtn.setPadding(new Insets(10, 22, 10, 22));
        saveToGarageBtn.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        saveToGarageBtn.setTextFill(Color.WHITE);
        saveToGarageBtn.setStyle("-fx-background-color: #2563eb; -fx-background-radius: 10; -fx-cursor: hand;");
        saveToGarageBtn.setOnAction(e -> handleSaveToGarage());

        footerRow.getChildren().addAll(compatibleBadge, compatibilityDetailLabel, spacer, saveToGarageBtn);

        rightPanel.getChildren().addAll(categoryHeading, partsScroll, footerRow);
        mainStage.getChildren().addAll(centerViewport, rightPanel);
        buildLayout.setCenter(mainStage);

        setCenter(buildLayout);
    }

    private HBox createStockWheelCard(boolean isSelected) {
        HBox card = new HBox(14);
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(14, 18, 14, 18));
        card.setStyle(isSelected
                ? "-fx-background-color: #eff6ff; -fx-border-color: #2563eb; -fx-border-width: 2; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;"
                : "-fx-background-color: #ffffff; -fx-border-color: #e2e8f0; -fx-border-width: 1.5; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;");

        Rectangle swatch = new Rectangle(28, 28, isSelected ? Color.web("#2563eb") : Color.web("#cbd5e1"));
        swatch.setArcWidth(8);
        swatch.setArcHeight(8);

        Label nameLbl = new Label("Factory OEM Wheels");
        nameLbl.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        nameLbl.setTextFill(Color.web("#0f172a"));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label priceLbl = new Label("Included");
        priceLbl.setFont(Font.font("Arial", FontWeight.BOLD, 13));
        priceLbl.setTextFill(Color.web("#64748b"));

        card.getChildren().addAll(swatch, nameLbl, spacer, priceLbl);
        card.setOnMouseClicked(e -> {
            selectedParts.removeIf(p -> p.getCategoryId() == 104);
            showBuildScreen();
        });
        return card;
    }

    private HBox createPartOptionCard(Part part) {
        boolean isSelected = selectedParts.stream().anyMatch(p -> p.getPartId() == part.getPartId());

        HBox card = new HBox(14);
        card.setAlignment(Pos.CENTER_LEFT);
        card.setPadding(new Insets(14, 18, 14, 18));
        card.setStyle(isSelected
                ? "-fx-background-color: #eff6ff; -fx-border-color: #2563eb; -fx-border-width: 2; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;"
                : "-fx-background-color: #ffffff; -fx-border-color: #e2e8f0; -fx-border-width: 1.5; -fx-border-radius: 12; -fx-background-radius: 12; -fx-cursor: hand;");

        Rectangle swatch = new Rectangle(28, 28, isSelected ? Color.web("#2563eb") : Color.web("#cbd5e1"));
        swatch.setArcWidth(8);
        swatch.setArcHeight(8);

        Label nameLbl = new Label(part.getName());
        nameLbl.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        nameLbl.setTextFill(Color.web("#0f172a"));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label priceLbl = new Label(String.format("+$%,.0f", part.getPriceModifier()));
        priceLbl.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        priceLbl.setTextFill(isSelected ? Color.web("#2563eb") : Color.web("#64748b"));

        card.getChildren().addAll(swatch, nameLbl, spacer, priceLbl);

        card.setOnMouseClicked(e -> {
            if (part.getCategoryId() == 104) {
                // Wheels are single-select
                selectedParts.removeIf(p -> p.getCategoryId() == 104);
                selectedParts.add(part);
            } else {
                // Other categories toggle on/off
                if (isSelected) {
                    selectedParts.removeIf(p -> p.getPartId() == part.getPartId());
                } else {
                    selectedParts.add(part);
                }
            }
            showBuildScreen();
        });

        return card;
    }

    // =========================================================
    // SCREEN 3: MY GARAGE (Pre-Checkout Storage)
    // =========================================================
    private void showGarageScreen() {
        updateNavHighlight(navGarageBtn);
        headerSubLabel.setText("Pre-Checkout Vehicle Storage");
        updateLivePrice();

        SplitPane split = new SplitPane();
        split.setPadding(new Insets(25, 35, 25, 35));
        split.setStyle("-fx-background-color: #ffffff;");

        VBox leftBox = new VBox(12);
        leftBox.setPadding(new Insets(10));
        Label title = new Label("Saved Builds in Garage");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 20));

        garageListView.setItems(FXCollections.observableArrayList(service.getGarageBuilds()));
        garageListView.getSelectionModel().selectedItemProperty().addListener((obs, oldVal, newVal) -> {
            if (newVal == null) {
                garageDetailsArea.clear();
            } else {
                StringBuilder sb = new StringBuilder();
                sb.append("Build Name: ").append(newVal.getBuildName()).append("\n");
                sb.append("Vehicle:    ").append(newVal.getVehicle().getName())
                  .append(" ($").append(String.format("%,.2f", newVal.getVehicle().getBasePrice())).append(")\n\n");
                sb.append("Selected Modifications:\n");
                if (newVal.getInstalledParts().isEmpty()) {
                    sb.append("  • Stock Factory Build\n");
                } else {
                    for (Part p : newVal.getInstalledParts()) {
                        sb.append(String.format("  • %s (+$%,.2f)\n", p.getName(), p.getPriceModifier()));
                    }
                }
                sb.append("\nTotal Build Estimate: $").append(String.format("%,.2f", newVal.getTotalPrice()));
                garageDetailsArea.setText(sb.toString());
            }
        });
        leftBox.getChildren().addAll(title, garageListView);

        VBox rightBox = new VBox(12);
        rightBox.setPadding(new Insets(10));
        Label detailTitle = new Label("Build Review & Checkout");
        detailTitle.setFont(Font.font("Arial", FontWeight.BOLD, 20));

        garageDetailsArea.setEditable(false);
        garageDetailsArea.setPrefHeight(260);

        customerNameField.setPromptText("Customer Name (e.g., Alex Rivera)");

        Button checkoutBtn = new Button("Checkout & Submit Ticket →");
        checkoutBtn.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-padding: 10 18; -fx-background-radius: 8;");
        checkoutBtn.setOnAction(e -> handleCheckout());

        Button removeBtn = new Button("Remove Car");
        removeBtn.setStyle("-fx-padding: 10 14; -fx-background-radius: 8;");
        removeBtn.setOnAction(e -> {
            GarageBuild selected = garageListView.getSelectionModel().getSelectedItem();
            if (selected != null) {
                service.removeFromGarage(selected);
                refreshCounts();
                showGarageScreen();
            }
        });

        HBox btnRow = new HBox(10, checkoutBtn, removeBtn);
        rightBox.getChildren().addAll(detailTitle, garageDetailsArea, new Label("Customer Name:"), customerNameField, btnRow);

        split.getItems().addAll(leftBox, rightBox);
        split.setDividerPositions(0.45);
        setCenter(split);
    }


// SCREEN 4: SHOP FLOOR KANBAN BAY BOARD
private void showTicketsScreen() {
        updateNavHighlight(navTicketsBtn);
        headerSubLabel.setText("Shop Floor Bay Tracker — Live Modification Queue");

        VBox boardWrapper = new VBox(16);
        boardWrapper.setPadding(new Insets(24, 32, 24, 32));
        boardWrapper.setStyle("-fx-background-color: #f8fafc;");

        HBox boardHeader = new HBox(12);
        boardHeader.setAlignment(Pos.CENTER_LEFT);
        Label title = new Label("Shop Floor Build Bays");
        title.setFont(Font.font("Arial", FontWeight.BOLD, 22));
        title.setTextFill(Color.web("#0f172a"));

        Label subtitle = new Label("Advance vehicles across bays as technicians complete modifications");
        subtitle.setFont(Font.font("Arial", 13));
        subtitle.setTextFill(Color.web("#64748b"));
        boardHeader.getChildren().addAll(title, subtitle);

        HBox columnsRow = new HBox(18);
        HBox.setHgrow(columnsRow, Priority.ALWAYS);
        VBox.setVgrow(columnsRow, Priority.ALWAYS);

        VBox queuedCol = createKanbanColumn("1. Queued (Pending)", "PENDING", "#f59e0b", "#fef3c7");
        VBox inBayCol = createKanbanColumn("2. In the Bay (Building)", "IN_PROGRESS", "#2563eb", "#dbeafe");
        VBox readyCol = createKanbanColumn("3. Ready for Pickup", "COMPLETED", "#16a34a", "#dcfce7");

        HBox.setHgrow(queuedCol, Priority.ALWAYS);
        HBox.setHgrow(inBayCol, Priority.ALWAYS);
        HBox.setHgrow(readyCol, Priority.ALWAYS);

        columnsRow.getChildren().addAll(queuedCol, inBayCol, readyCol);
        boardWrapper.getChildren().addAll(boardHeader, columnsRow);
        setCenter(boardWrapper);
    }

    private VBox createKanbanColumn(String columnTitle, String statusFilter, String accentHex, String badgeBgHex) {
        VBox column = new VBox(12);
        column.setPadding(new Insets(14));
        column.setPrefWidth(290);
        column.setStyle("-fx-background-color: #f1f5f9; -fx-border-color: #e2e8f0; -fx-border-radius: 12; -fx-background-radius: 12;");

        List<BuildTicket> matchingTickets = new ArrayList<>();
        for (BuildTicket t : service.getAllTickets()) {
            if (statusFilter.equals(t.getStatus())) {
                matchingTickets.add(t);
            }
        }

        HBox colHeader = new HBox(8);
        colHeader.setAlignment(Pos.CENTER_LEFT);
        Label headerLbl = new Label(columnTitle);
        headerLbl.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        headerLbl.setTextFill(Color.web("#0f172a"));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label countBadge = new Label(String.valueOf(matchingTickets.size()));
        countBadge.setPadding(new Insets(2, 10, 2, 10));
        countBadge.setFont(Font.font("Arial", FontWeight.BOLD, 12));
        countBadge.setTextFill(Color.web(accentHex));
        countBadge.setStyle("-fx-background-color: " + badgeBgHex + "; -fx-background-radius: 12;");

        colHeader.getChildren().addAll(headerLbl, spacer, countBadge);

        VBox cardsList = new VBox(10);
        if (matchingTickets.isEmpty()) {
            Label emptyLbl = new Label("No vehicles in this bay");
            emptyLbl.setFont(Font.font("Arial", 12));
            emptyLbl.setTextFill(Color.web("#94a3b8"));
            emptyLbl.setPadding(new Insets(12, 0, 12, 0));
            cardsList.getChildren().add(emptyLbl);
        } else {
            for (BuildTicket ticket : matchingTickets) {
                cardsList.getChildren().add(createKanbanTicketCard(ticket, accentHex));
            }
        }

        ScrollPane scroll = new ScrollPane(cardsList);
        scroll.setFitToWidth(true);
        scroll.setStyle("-fx-background-color: transparent; -fx-background: transparent;");
        VBox.setVgrow(scroll, Priority.ALWAYS);

        column.getChildren().addAll(colHeader, scroll);
        return column;
    }

    private VBox createKanbanTicketCard(BuildTicket ticket, String accentHex) {
        VBox card = new VBox(8);
        card.setPadding(new Insets(14));
        card.setStyle("-fx-background-color: #ffffff; -fx-border-color: #cbd5e1; -fx-border-width: 1 1 1 4; "
                + "-fx-border-left-color: " + accentHex + "; -fx-border-radius: 8; -fx-background-radius: 8;");

        // Top row: Ticket ID + Customer
        HBox topRow = new HBox();
        topRow.setAlignment(Pos.CENTER_LEFT);
        Label idLbl = new Label("Ticket #" + ticket.getTicketId());
        idLbl.setFont(Font.font("Arial", FontWeight.BOLD, 12));
        idLbl.setTextFill(Color.web(accentHex));

        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        Label custLbl = new Label(ticket.getCustomerName());
        custLbl.setFont(Font.font("Arial", 12));
        custLbl.setTextFill(Color.web("#64748b"));
        topRow.getChildren().addAll(idLbl, spacer, custLbl);

        // Vehicle & Build Name
        Label carLbl = new Label(ticket.getBuild().getVehicle().getName());
        carLbl.setFont(Font.font("Arial", FontWeight.BOLD, 14));
        carLbl.setTextFill(Color.web("#0f172a"));

        Label buildNameLbl = new Label("\"" + ticket.getBuild().getBuildName() + "\"");
        buildNameLbl.setFont(Font.font("Arial", 12));
        buildNameLbl.setTextFill(Color.web("#475569"));

        // Modification Checklist for Builders
        VBox modsBox = new VBox(3);
        modsBox.setPadding(new Insets(6, 0, 6, 0));
        if (ticket.getBuild().getInstalledParts().isEmpty()) {
            Label stockLbl = new Label("• Stock OEM Delivery (No Mods)");
            stockLbl.setFont(Font.font("Arial", 11));
            stockLbl.setTextFill(Color.web("#64748b"));
            modsBox.getChildren().add(stockLbl);
        } else {
            for (Part p : ticket.getBuild().getInstalledParts()) {
                Label partLbl = new Label("• [Part #" + p.getPartId() + "] " + p.getName());
                partLbl.setWrapText(true);
                partLbl.setFont(Font.font("Arial", 11));
                partLbl.setTextFill(Color.web("#334155"));
                modsBox.getChildren().add(partLbl);
            }
        }

        card.getChildren().addAll(topRow, carLbl, buildNameLbl, new Separator(), modsBox);

        // Action Button to Move Card Across Bays
        if ("PENDING".equals(ticket.getStatus())) {
            Button startBtn = new Button("Move to Bay →");
            startBtn.setMaxWidth(Double.MAX_VALUE);
            startBtn.setStyle("-fx-background-color: #2563eb; -fx-text-fill: white; -fx-font-weight: bold; -fx-background-radius: 6; -fx-cursor: hand;");
            startBtn.setOnAction(e -> {
                service.updateTicketStatus(ticket, "IN_PROGRESS");
                showTicketsScreen();
            });
            card.getChildren().add(startBtn);
        } else if ("IN_PROGRESS".equals(ticket.getStatus())) {
            Button completeBtn = new Button("Mark Build Ready ✓");
            completeBtn.setMaxWidth(Double.MAX_VALUE);
            completeBtn.setStyle("-fx-background-color: #16a34a; -fx-text-fill: white; -fx-font-weight: bold; -fx-background-radius: 6; -fx-cursor: hand;");
            completeBtn.setOnAction(e -> {
                service.updateTicketStatus(ticket, "COMPLETED");
                showTicketsScreen();
            });
            card.getChildren().add(completeBtn);
        } else {
            Label doneLbl = new Label("✓ Ready for Customer Pickup");
            doneLbl.setFont(Font.font("Arial", FontWeight.BOLD, 12));
            doneLbl.setTextFill(Color.web("#15803d"));
            card.getChildren().add(doneLbl);
        }

        return card;
    }
