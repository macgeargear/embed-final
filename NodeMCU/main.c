#include <Arduino.h>
  #include <ESP8266WiFi.h>
  #include <Firebase_ESP_Client.h>
  #include <SoftwareSerial.h>
  #include <NTPClient.h>
  #include <WiFiUdp.h>
  #include "addons/TokenHelper.h"
  #include "addons/RTDBHelper.h"

  #define WIFI_SSID "Kaopad"
  #define WIFI_PASSWORD "kaopadaroii"

  // Insert Firebase project API Key
  #define API_KEY "***"

  // Insert RTDB URLefine the RTDB URL */
  #define DATABASE_URL "***" 

  #define USER_EMAIL "***"
  #define USER_PASSWORD "***"


  //Define Firebase Data object
  FirebaseData fbdo;
  FirebaseAuth auth;
  FirebaseConfig config;

  EspSoftwareSerial::UART DataSerial;

  WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP);

  unsigned long sendDataPrevMillis = 0;
  String Data[3] = {"20","30","40"};
  String dataTypes[3] = {"temperature", "humidity", "co"};


  void setup(){
    Serial.begin(115200);
    DataSerial.begin(115200, EspSoftwareSerial::SWSERIAL_8N1, D1, D2, false, 100, 100);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED){
      Serial.print(".");
      delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();

    //start time client for current time
    timeClient.begin();

    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    config.token_status_callback = tokenStatusCallback; 
    
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  }

  void updateData(){
    if (DataSerial.available()){
        Serial.println("data from stm: ");
        int ind = 0;
        while(DataSerial.available()){
          char c = DataSerial.read();
          if (c=='p') break;
        }
        for (int i =0 ; i<3; i++){
          Data[i] = "";
        }
        while(DataSerial.available()){
          char c = DataSerial.read();
          if (c == '-')ind++;
          else if (c == 'e') break;
          else Data[ind] += c;
        }
        for (int i= 0; i<3; i++){
          Serial.printf(" data %d : ", i);
          Serial.print(Data[i]);
          Serial.println();
        }  
    }
  }
  void refreshToken(){
    if (Firebase.isTokenExpired()){
      Firebase.refreshToken(&config);
      Serial.println("Refresh token");
    }
  }

  void sendDataFirebase(){
    if (Firebase.ready() && (millis() - sendDataPrevMillis > 1000*30 || sendDataPrevMillis == 0)){
      sendDataPrevMillis = millis();
      timeClient.update();
      String currentTime = String(timeClient.getEpochTime());
      Serial.println(currentTime);
      for (int i =0 ; i<3; i++){
        String dataPath = "test/"+currentTime+"/"+dataTypes[i];
        if (Firebase.RTDB.setString(&fbdo, dataPath, Data[i])){
          Serial.print("sent ");
          Serial.print(dataTypes[i]);
          Serial.print(Data[i]);
          Serial.println();
        }
        else{
          Serial.println(fbdo.errorReason());
        }
      }
    }
  }

  void loop(){
    refreshToken();
    updateData();
    sendDataFirebase();
  }
