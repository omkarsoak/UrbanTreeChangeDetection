
### Commands for conversion of GeoTiff images to PNG format
### Using `gdal_translate` tool from OSGEO4W shell (which comes with QGIS software)
### GDAL works on in C:\ drive (so bring the image to `Downloads` folder to run gdal)

### Run the following commands in OSGEO4W shell 

### Convert individual 3 band RGB image to PNG
gdal_translate -of PNG -ot UInt16 -scale 0 8 -b 1 -b 2 -b 3 -co worldfile=no image3.tif output5.png

### If it is giving dark image
gdal_translate -of PNG -ot UInt16 -scale 0 1 -b 1 -b 2 -b 3 -co worldfile=no image3.tif output5.png

### Convert entire directory of 3 band RGB images to PNG images
##### Note: We have to run this command inside the directory which we are converting & the output images are also stored in same directory
for %i in (*.tif) do gdal_translate -of PNG -ot UInt16 -scale 0 8 -b 1 -b 2 -b 3 -co worldfile=no %i %~ni_compressed.png

### Convert individual 1 band image (mask image) to PNG
gdal_translate -of PNG -scale -co worldfile=no mask2.tif output6.png

### Convert entire directory of 1 band (mask images) to PNG
##### Note: We have to run this command inside the directory which we are converting & the output images are also stored in same directory
for %i in (*.tif) do gdal_translate -of PNG -scale -co worldfile=no %i %~ni_compressed.png

### If the above returns black images try the command given below
for %i in (*.tif) do gdal_translate -of PNG -scale 0 255 -co worldfile=no %i %~ni_compressed.png