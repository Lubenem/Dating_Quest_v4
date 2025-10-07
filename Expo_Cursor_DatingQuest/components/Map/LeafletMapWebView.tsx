import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useActionsContext } from '../../contexts/ActionsContext';

export const LeafletMapWebView: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const { actions, userLocation, dailyGoal } = useActionsContext();

  useEffect(() => {
    if (webViewRef.current && userLocation) {
      const today = new Date().toDateString();
      const todayActions = actions.filter(action => 
        new Date(action.timestamp).toDateString() === today
      );

      const data = {
        userLocation,
        actions: todayActions,
        dailyGoal
      };

      webViewRef.current.postMessage(JSON.stringify(data));
    }
  }, [actions, userLocation, dailyGoal]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
        #map { width: 100%; height: 100%; background: #1a1a1a; }
        .leaflet-container { background: #1a1a1a; }
        .leaflet-tile-pane { filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([40.7128, -74.0060], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: ['a', 'b', 'c']
        }).addTo(map);

        let markers = [];
        let userMarker = null;

        const getProgressColor = (actionIndex, dailyGoal) => {
          const progress = Math.min(actionIndex / dailyGoal, 1);
          
          if (progress <= 0.33) {
            const intensity = progress / 0.33;
            return \`rgb(\${Math.round(30 + intensity * 70)}, \${Math.round(100 + intensity * 155)}, \${Math.round(200 + intensity * 55)})\`;
          } else if (progress <= 0.66) {
            const intensity = (progress - 0.33) / 0.33;
            return \`rgb(\${Math.round(100 + intensity * 155)}, \${Math.round(200 + intensity * 55)}, \${Math.round(30 + intensity * 70)})\`;
          } else {
            const intensity = (progress - 0.66) / 0.34;
            return \`rgb(255, \${Math.round(200 + intensity * 55)}, 0)\`;
          }
        };

        const createIcon = (number, dailyGoal, isLatest = false) => {
          const color = getProgressColor(number - 1, dailyGoal);
          const size = isLatest ? 24 : 20;
          
          return L.divIcon({
            html: \`<div style="
              background: \${color};
              width: \${size}px;
              height: \${size}px;
              border-radius: 50%;
              border: \${isLatest ? '4px solid #000' : '3px solid white'};
              box-shadow: \${isLatest ? '0 4px 12px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0,0,0,0.3)'};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: \${isLatest ? '14px' : '12px'};
            ">\${number}</div>\`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
          });
        };

        const createUserLocationIcon = () => {
          return L.divIcon({
            html: \`<div style="
              background: #000;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 2px 10px rgba(0,0,0,0.4);
            "></div>\`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
        };

        window.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);
          
          markers.forEach(marker => map.removeLayer(marker));
          markers = [];
          
          if (userMarker) {
            map.removeLayer(userMarker);
          }

          if (data.userLocation) {
            const { latitude, longitude } = data.userLocation;
            map.setView([latitude, longitude], 15);
            
            userMarker = L.marker([latitude, longitude], {
              icon: createUserLocationIcon(),
              interactive: false,
              zIndexOffset: -1000
            }).addTo(map);
          }

          const sortedActions = data.actions
            .filter(action => action.type !== 'missedOpportunity')
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          sortedActions.forEach((action, index) => {
            const isLatest = index === sortedActions.length - 1;
            const marker = L.marker(
              [action.location.latitude, action.location.longitude],
              { icon: createIcon(index + 1, data.dailyGoal, isLatest) }
            ).addTo(map);
            
            const date = new Date(action.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            
            marker.bindPopup(\`
              <div style="padding: 5px;">
                <b>\${action.type.charAt(0).toUpperCase() + action.type.slice(1)}</b><br/>
                \${timeStr}<br/>
                \${action.notes || ''}
              </div>
            \`);
            
            markers.push(marker);
          });
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  webview: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});
