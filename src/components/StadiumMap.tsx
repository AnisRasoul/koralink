import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Star, Navigation } from "lucide-react";
import { Button } from "./ui/button";

// Fix for default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Stadium {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
  rating: number;
  size: number;
  distance?: string;
  availableSlots: number;
  lat?: number;
  lng?: number;
}

interface StadiumMapProps {
  stadiums: Stadium[];
  selectedStadium?: string | null;
  onStadiumSelect?: (stadiumId: string) => void;
}

// Component to handle map view changes
const MapController = ({ center }: { center: LatLngExpression }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

const StadiumMap = ({ stadiums, selectedStadium, onStadiumSelect }: StadiumMapProps) => {
  // Default center: Algiers, Algeria
  const defaultCenter: LatLngExpression = [36.7538, 3.0588];
  
  // Add coordinates to stadiums if they don't have them (mock data)
  const stadiumsWithCoords = stadiums.map((stadium, index) => ({
    ...stadium,
    lat: stadium.lat || 36.7538 + (Math.random() - 0.5) * 0.1,
    lng: stadium.lng || 3.0588 + (Math.random() - 0.5) * 0.1,
  }));

  // Custom marker icon for stadiums
  const stadiumIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.2"/>
        <circle cx="12" cy="12" r="6" fill="#22c55e"/>
        <path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" stroke="white" stroke-width="2"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {stadiumsWithCoords.map((stadium) => (
          <Marker
            key={stadium.id}
            position={[stadium.lat!, stadium.lng!]}
            icon={stadiumIcon}
            eventHandlers={{
              click: () => {
                if (onStadiumSelect) {
                  onStadiumSelect(stadium.id);
                }
              },
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-base mb-1">{stadium.name}</h3>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {stadium.location}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium">{stadium.rating}</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {stadium.pricePerHour} DZD/hr
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {stadium.size}v{stadium.size} • {stadium.availableSlots} slots available
                </div>
                <Button
                  size="sm"
                  className="w-full mt-2 h-7 text-xs"
                  onClick={() => {
                    if (onStadiumSelect) {
                      onStadiumSelect(stadium.id);
                    }
                  }}
                >
                  View Details
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border z-[1000]">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Stadium Location</span>
        </div>
      </div>

      {/* Center on user location button */}
      <Button
        size="sm"
        className="absolute top-4 right-4 z-[1000] h-9 w-9 p-0"
        variant="secondary"
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log("User location:", position.coords);
                // You can add logic to center map on user location
              },
              (error) => {
                console.error("Error getting location:", error);
              }
            );
          }
        }}
      >
        <Navigation className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default StadiumMap;
