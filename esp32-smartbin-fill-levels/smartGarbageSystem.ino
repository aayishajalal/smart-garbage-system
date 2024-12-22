#include <Arduino.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebServer.h>
#include <Firebase_ESP_Client.h>


// Firebase credentials
#define WIFI_SSID "YOUR_HOTSPOT_NAME"
#define WIFI_PASSWORD "YOUR_HOTSPOT_PASSWORD"
#define API_KEY "AIzaSyB7ofZHHKeK8APJqLImmlVPqKrAtaezeis"
#define DATABASE_URL "https://test-a36af-default-rtdb.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
int count = 0;
bool signupOK = false;

const int irSensorPin1 = 15; //25
const int irSensorPin2 = 2; //50
const int irSensorPin3 = 4; //75
const int irSensorPin4 = 5; // 100 Pin connected to the output of the IR sensor

int irSensorState1 = 0;
int irSensorState2 = 0;
int irSensorState3 = 0;
int irSensorState4 = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }

  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("Firebase sign up successful");
    signupOK = true;
  } else {
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }


  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  pinMode(irSensorPin1, INPUT);
  pinMode(irSensorPin2, INPUT); 
  pinMode(irSensorPin3, INPUT); 
  pinMode(irSensorPin4, INPUT);  // Set IR sensor pin as input
}

void loop() {
  // Read the state of the IR sensor
  irSensorState1 = digitalRead(irSensorPin1);
  irSensorState2 = digitalRead(irSensorPin2);
  irSensorState3 = digitalRead(irSensorPin3);
  irSensorState4 = digitalRead(irSensorPin4);

  // Check if IR sensor is triggered
  if (irSensorState1==0 && irSensorState2==1 && irSensorState3==1 && irSensorState4==1) {
    Serial.println("25% dustbin fill");
  } 
  else if (irSensorState1==0 && irSensorState2==0 && irSensorState3==1 && irSensorState4==1) {
    Serial.println("50% dustbin fill");
  }
   else if (irSensorState1==0 && irSensorState2==0 && irSensorState3==0 && irSensorState4==1) {
    Serial.println("75% dustbin fill");
  }
  else if (irSensorState1==0 && irSensorState2==0 && irSensorState3==0 && irSensorState4==0) {
    Serial.println("100% dustbin fill");
  }
  else {
    Serial.println("dustbin is parrtially full");
  }
  delay(500);
  
  if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 500 || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Firebase RTDB write
    if (Firebase.RTDB.setInt(&fbdo, "IR/1", irSensorState1) &&
        Firebase.RTDB.setInt(&fbdo, "IR/2", irSensorState2) &&
        Firebase.RTDB.setInt(&fbdo, "IR/3 ", irSensorState3) &&
        Firebase.RTDB.setInt(&fbdo, "IR/4", irSensorState4)) {
      Serial.println("Data uploaded successfully");
    } else {
      Serial.println("Failed to upload data");
      Serial.println("REASON: " + fbdo.errorReason());
    }
    count++;
  }
}
