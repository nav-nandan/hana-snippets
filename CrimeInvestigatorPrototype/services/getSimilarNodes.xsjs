
var node_id = $.request.parameters.get('node_id');

var connection = $.db.getConnection();

var query = "select * from data_explorer.output_link_prediction where prediction_score > 0 and (node_1 = ? or node_2 = ?)";

var statement = connection.prepareStatement(query);

statement.setString(1, node_id);
statement.setString(2, node_id);

var resultSet = statement.executeQuery();

var graph = [];

var nodes = [];
var edges = [];

var node = {};
var edge = {};

var node_id = [];

while (resultSet.next()) {
	if(node_id.indexOf(resultSet.getString(1)) < 0) {
		node_id.push(resultSet.getString(1));

		node = {};
		node.id = resultSet.getString(1);
		node.title = resultSet.getString(1);
		node.label = resultSet.getString(1);
		
		nodes.push(node);
	}
	if(node_id.indexOf(resultSet.getString(2)) < 0) {
		node_id.push(resultSet.getString(2));
		
		node = {};
		node.id = resultSet.getString(2);
		node.title = resultSet.getString(2);
		node.label = resultSet.getString(2);
		
		nodes.push(node);
	}
	
	edge = {};
	edge.id = resultSet.getString(1) + ":" + resultSet.getString(2) + ":" + resultSet.getString(3);
	edge.from = resultSet.getString(1);
	edge.to = resultSet.getString(2);
	edge.title = 'jaccard_similarity = ' + resultSet.getString(3).substring(0, 4);
	edge.dashes = true;
	
	edges.push(edge);
}

graph.push(nodes);
graph.push(edges);

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(JSON.stringify(graph));
