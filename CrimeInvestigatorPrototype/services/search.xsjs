
var search_term = $.request.parameters.get('search_term');
var fuzziness_score = $.request.parameters.get('fuzziness_score');

var limit = 100;

var connection = $.db.getConnection();

var query = "select node_id, TO_DECIMAL(SCORE(),3,2) AS score, snippets(node_attribute_1), location.ST_X(), location.ST_Y()"
			+ " from data_explorer.nodes"
			+ " where CONTAINS(node_attribute_1, ?, FUZZY(?, 'textSearch=fulltext'))"
			+ " order by score desc limit ?";

var statement = connection.prepareStatement(query);

statement.setString(1, search_term);
statement.setString(2, fuzziness_score);
statement.setInteger(3, limit);

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
	
	coordinates.push(resultSet.getDouble(4));
	coordinates.push(resultSet.getDouble(5));
	properties.id = resultSet.getString(1);
	properties.score = resultSet.getDouble(2);
//	properties.data = resultSet.getString(3).substring(0, 50);
	properties.data = resultSet.getString(3);
	
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
