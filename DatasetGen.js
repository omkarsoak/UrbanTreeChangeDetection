// Define the center point for Raleigh, North Carolina
var center = ee.Geometry.Point([-78.66638044690248, 35.80269787969758]);

// Define the bounding box with a buffer radius (2560 meters for 512x512 pixels at 10m resolution)
var geometry = center.buffer(2560).bounds();

// Load Sentinel-2 MSI Level-2A as imageCollection
var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
  .filterBounds(geometry)
  .filterDate('2019-08-01', '2019-08-30')  // Specify a date range
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))  // Filter low cloud cover
  .median();  // Use median to create a composite image


//TO GET THE DATES
// // Load Sentinel-2 MSI Level-2A as imageCollection
// var sentinel2 = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
//   .filterBounds(geometry)
//   .filterDate('2018-08-01', '2024-08-30')  // Specify a date range
//   .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));  // Filter low cloud cover
  
// // Map over the collection to get the dates
// var dates = sentinel2.map(function(image) {
//   return ee.Feature(null, {'date': image.date().format("YYYY-MM-dd")});
// });

// // Print all dates
// print('Available Dates:', dates.aggregate_array('date'));


// Calculate NDVI
var ndvi = sentinel2.normalizedDifference(['B8', 'B4']).rename('NDVI');

// Classify NDVI into three categories
var ndviClassified = ndvi.expression(
  "(ndvi < 0.4) ? 1 : (ndvi <= 0.7) ? 2 : 3", 
  {'ndvi': ndvi}
).rename('NDVI_Classified');

// Visualization parameters for the classified NDVI
var ndviClassVis = {
  min: 1,
  max: 3,
  palette: ['white', 'lightgreen', 'darkgreen']  // Assign colors to each class
};

//calculate base image
//Enhance each band by a different factor
var enhancedRGB = sentinel2.select('B4').multiply(2.0)  // Enhance Red
                  .addBands(sentinel2.select('B3').multiply(2.0))  // Enhance Green
                  .addBands(sentinel2.select('B2').multiply(2.0));  // Enhance Blue

var vizParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 3000,
  gamma: 1
};

// Center map on the region and display layers
Map.centerObject(geometry, 13);
Map.addLayer(enhancedRGB.clip(geometry),vizParams, 'EnhancedRGB');
Map.addLayer(ndviClassified.clip(geometry), ndviClassVis, 'NDVI Classified');

// Export EnhancedRGB Layer to Google Drive
Export.image.toDrive({
  image: enhancedRGB.clip(geometry).visualize(vizParams),
  description: 'EnhancedRGB',
  region: geometry,
  fileFormat: 'GEOTIFF',
  crs: 'EPSG:3857',
  dimensions: '512x512'
});

// Export the classified NDVI as a single-band image
Export.image.toDrive({
  image: ndviClassified.clip(geometry),
  description: 'NDVI_Classified',
  region: geometry,
  fileFormat: 'GEOTIFF',
  crs: 'EPSG:3857',
  dimensions: '512x512'
});
