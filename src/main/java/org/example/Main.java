import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

public class Main {

    private static double gold = 4212.29;
    private static double silver = 4208.54;

    private static double accuracy = 85.60;
    private static double error = 1.45;
    private static int samples = 70;


    public static void main(String[] args) {

        try {

            HttpServer server =
                    HttpServer.create(new InetSocketAddress(5000), 0);

            server.createContext("/pricesGandS", new Prices());

            server.setExecutor(null);
            server.start();

            System.out.println("Server started on port 5000");

        } catch (Exception e) {

            System.out.println("Server error: " + e.getMessage());

        }
    }


    static class Prices implements HttpHandler {

        @Override
        public void handle(HttpExchange exchange) throws IOException {

            String goldSignal = "SELL";
            String silverSignal = "HOLD";

            String data = "{"
                    + "\"pax-gold\": {\"usd\": " + gold + "},"
                    + "\"tether-gold\": {\"usd\": " + silver + "},"
                    + "\"gold-prediction-signal\": \"" + goldSignal + "\","
                    + "\"silver-prediction-signal\": \"" + silverSignal + "\","
                    + "\"ml-performance-metrics\": {"
                    + "\"accuracy-pct\": " + accuracy + ","
                    + "\"mape-error\": " + error + ","
                    + "\"training-samples\": " + samples
                    + "}"
                    + "}";


            exchange.getResponseHeaders()
                    .set("Content-Type", "application/json");

            exchange.getResponseHeaders()
                    .set("Access-Control-Allow-Origin", "*");


            exchange.sendResponseHeaders(200, data.length());


            try (OutputStream out = exchange.getResponseBody()) {
                out.write(data.getBytes());
            }
        }
    }
}