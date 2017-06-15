
var start_node = $.request.parameters.get('start_node');
var depth = $.request.parameters.get('depth');

var nodes = [];

var connection = $.db.getConnection();

var query = "select * FROM \"DATA_EXPLORER\".\"GET_NEIGHBORHOOD_EXAMPLE\" b ORDER BY \"DEPTH\" WITH"
			+ " PARAMETERS ("
			+ " 'placeholder' = ('$$startVertices$$', '[\"" + start_node + "\"]'),"
			+ " 'placeholder' = ('$$maxDepth$$', '" + depth + "')"
			+ " )";

var statement = connection.prepareStatement(query);

var resultSet = statement.executeQuery();

while(resultSet.next()) {
	nodes.push(resultSet.getString(1));
}

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(JSON.stringify(nodes));
