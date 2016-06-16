var express = require('express');
var fs = require('fs');
var child_process = require('child_process');

var app = express();

app.get('/', function(req, res) {
  res.send('OK\n');
});

app.post('/ssid', function(req, res) {
  var ssid = req.query.ssid;
  var password = req.query.password;
  console.log('ssid is ' + ssid + '. pass is ' + password);
  var interfaceFile = "/etc/network/interfaces.d/wlan0";
  fs.writeFile(
      interfaceFile,
      "iface wlan0 inet dhcp\n"
          + "    wpa-ssid " + ssid + "\n"
          + "    wpa-psk " + password + "\n",
          // + "    wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf\n",
      function(err) {
        if(err) {
            res.send(500);
            return console.log(err);
        }

        console.log("Saved " + interfaceFile);
        child_process.exec("ifdown wlan0 && ifup wlan0",
            function(stdout, stderr) {
              if (stderr) {
                res.send(500);
                return console.log("ifdownup error: " + stderr);
              } else {
                console.log("ifdownup successful");
                if (stdout) {
                  console.log("ifdownup: " + stdout);
                }
                res.end();
              }
            });
        res.end();
      });
});

app.listen(3000, function () {
  console.log('Server running at http://127.0.0.1:3000/');
});

