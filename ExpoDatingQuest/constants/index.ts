/**
 * App-wide Constants
 * 
 * This file contains all constant values used throughout the app:
 * - Colors and gradients for UI
 * - Layout dimensions
 * - Animation timings
 * 
 * By centralizing these values, we can:
 * 1. Maintain consistent design across the app
 * 2. Easily change theme colors in one place
 * 3. Ensure all components use the same spacing/sizing
 */

/**
 * Colors - Main color palette for the app
 * 
 * These colors define the visual theme. Change them here to theme the entire app!
 */
export const Colors = {
  // Core brand colors
  primary: '#8b5cf6',           // Purple - main accent color
  secondary: '#f093fb',         // Pink - secondary accent
  
  // Background colors
  background: '#1a1a2e',        // Dark blue-gray - main background
  surface: '#2d3748',           // Lighter gray - card/surface background
  
  // Text colors
  text: '#ffffff',              // White - primary text
  textSecondary: '#ffffff',     // Light gray - secondary text
  
  // Accent colors
  accent: '#FFD700',            // Gold - main accent (progress, selected items, highlights)
  
  // Status colors
  success: '#10b981',           // Green - success messages
  warning: '#f59e0b',           // Orange - warning messages
  error: '#ef4444',             // Red - error messages
  
  /**
   * Gradients - Beautiful gradient combinations for action buttons
   * Each action type has its own unique gradient to make it visually distinct
   */
  gradients: {
    // Background: Main app background gradient
    background: ['#f5576c', '#f093fb', '#764ba2', '#667eea'],
    
    // Approach: Purple gradient (confident, bold)
    approach: ['#667eea', '#764ba2'],
    
    // Contact: Blue gradient (communication, connection)
    contact: ['#4facfe', '#00f2fe'],
    
    // Instant Date: Pink/red gradient (romantic, exciting)
    instantDate: ['#f093fb', '#f5576c'],
    
    // Missed Opportunity: Dark gradient (regret, learning)
    missedOpportunity: ['#2d3748', '#1a202c'],
  },
} as const;

/**
 * ActionColors - Solid colors for each action type
 * Used for map markers, charts, and other visualizations
 * 
 * These match the first color in each gradient above for consistency
 */
export const ActionColors = {
  approach: '#667eea',          // Purple
  contact: '#4facfe',           // Blue
  instantDate: '#f093fb',       // Pink
  missedOpportunity: '#2d3748', // Dark gray
} as const;

/**
 * MapTrail - Configuration for the trail line on the map
 */
export const MapTrail = {
  display: false,               // Show/hide trail line
  color: '#10b981',             // Green - trail color connecting markers
  width: 1,                     // Line thickness
} as const;

/**
 * ActionIcons - Icon names for each action type
 * Centralized icon configuration for app-wide consistency
 * Icons from lucide-react-native
 */
export const ActionIcons = {
  approach: 'Users',
  contact: 'MessageCircle',
  instantDate: 'Heart',
  missedOpportunity: 'Clock',
} as const;

/**
 * Layout - Spacing and sizing constants
 * Keep these consistent for a polished UI
 */
export const Layout = {
  padding: 16,              // Standard padding for containers
  borderRadius: 12,         // Standard border radius for rounded corners
  buttonHeight: 120,        // Standard height for buttons
  iconSize: 24,             // Standard size for icons
  
  // Counter button specific sizes
  counterWidth: 180,        // Width of each counter button
  counterHeight: 220,       // Height of each counter button
} as const;

/**
 * Animation - Timing constants for animations
 * Adjust these to make animations faster/slower
 */
export const Animation = {
  pageTransitionMs: 600,    // How long page slide animations take
  buttonPressMs: 100,       // How long button press animations take
  fadeMs: 200,              // How long fade in/out animations take
} as const;

/**
 * App - App-wide settings
 */
export const App = {
  currentLevel: null as number | null, // Set to a number (0-5) for testing, null for automatic
  
  levels: [
    { level: 0, base: 0, goal: 1 },
    { level: 1, base: 1, goal: 10 },
    { level: 2, base: 10, goal: 15 },
    { level: 3, base: 15, goal: 20 },
    { level: 4, base: 20, goal: 25 },
    { level: 5, base: 25, goal: 30 },
  ],
  
  streakThresholds: {
    twoFires: 2,
    threeFires: 3,
  },
};

/**
 * Map - Map-related constants
 */
export const Map = {
  initialScale: 1000,       // Initial map scale in meters (radius from center)
  
  clusterRadius: 10,        // Cluster markers within this radius (meters)
  
  testMode: {
    enabled: false,       // Automatically enable for dev builds. Set to false to disable, or true to force enable in production
    radiusMeters: 500,     // Radius in meters for random coordinates (1000m = 1km)
  },
  
  textColor: '#d4aa04',     // Map text color (street names, labels, etc.)
} as const;


