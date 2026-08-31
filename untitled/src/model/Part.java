package model;

public class Part {
    private int partId;
    private int categoryId;
    private String name;
    private double priceModifier;
    private String imageUrl;

    public Part(int partId, int categoryId, String name, double priceModifier, String imageUrl) {
        this.partId = partId;
        this.categoryId = categoryId;
        this.name = name;
        this.priceModifier = priceModifier;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public int getPartId() { return partId; }
    public void setPartId(int partId) { this.partId = partId; }

    public int getCategoryId() { return categoryId; }
    public void setCategoryId(int categoryId) { this.categoryId = categoryId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPriceModifier() { return priceModifier; }
    public void setPriceModifier(double priceModifier) { this.priceModifier = priceModifier; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}