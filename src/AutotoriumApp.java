import ui.ConfiguratorView;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class AutotoriumApp extends Application {

    @Override
    public void start(Stage primaryStage) {
        ConfiguratorView root = new ConfiguratorView();
        Scene scene = new Scene(root, 950, 650);

        primaryStage.setTitle("Autotorium - JDM Vehicle Configurator");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}