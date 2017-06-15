
var latitude = $.request.parameters.get('latitude');
var longitude = $.request.parameters.get('longitude');

var limit = 25;

var connection = $.db.getConnection();

var query = "select node_id, node_attribute_1, location.ST_X(), location.ST_Y(),"
			+ " location.ST_Distance(new ST_Point(" + longitude + ", " + latitude + " ))"
			+ " as dist from data_explorer.nodes"
			+ " where location.ST_Distance(new ST_Point(" + longitude + ", " + latitude + " )) > 0"
			+ " order by dist limit ?";

var statement = connection.prepareStatement(query);

statement.setInteger(1, limit);

var resultSet = statement.executeQuery();

var featureCollection = {};
featureCollection.type = "FeatureCollection";
featureCollection.features = [];

var features = [];
var feature = {};
var geometry = {};
var coordinates = [];
var properties = {};

while(resultSet.next()) {
	feature = {};
	feature.type = "Feature";
	feature.geometry = {};
	feature.properties = {};
	geometry = {};
	geometry.type = "Point";
	geometry.coordinates = [];
	coordinates = [];
	properties = {};
	
	coordinates.push(resultSet.getDouble(3));
	coordinates.push(resultSet.getDouble(4));
	properties.id = resultSet.getString(1);
	properties.data = resultSet.getString(2);
	
	geometry.coordinates = coordinates;
	feature.geometry = geometry;
	feature.properties = properties;
	features.push(feature);
}

featureCollection.features = features;

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(JSON.stringify(featureCollection));
