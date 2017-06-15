
/* Author: Naveen Nandan, HANA Solution Center, Singapore */

var node_id = $.request.parameters.get('node_id');

var node_ids = node_id.split(",");

var node_id_list = "";

var i;

for(i=0; i < node_ids.length; i++) {
	node_id_list = node_id_list + "'" + node_ids[i] + "'" + ",";
}

node_id_list = node_id_list.substring(0, node_id_list.length - 1);

var connection = $.db.getConnection();

var query = "";

if(node_id === '*') {
	query = "select * from data_explorer.edges where node_1 like '%' or node_2 like '%' limit 400";
} else {
	query = "select * from data_explorer.edges where node_1 in (" + node_id_list + ") or node_2 in (" + node_id_list + ")";
}

var statement = connection.prepareStatement(query);

var resultSet = statement.executeQuery();

var graph = [];

var nodes = [];
var edges = [];

var node = {};
var edge = {};

var nodes_id = [];

while (resultSet.next()) {
	if(nodes_id.indexOf(resultSet.getString(2)) < 0) {
		nodes_id.push(resultSet.getString(2));

		node = {};
		node.id = resultSet.getString(2);
		node.title = resultSet.getString(2);
		node.label = resultSet.getString(2);
		
		nodes.push(node);
	}
	if(nodes_id.indexOf(resultSet.getString(3)) < 0) {
		nodes_id.push(resultSet.getString(3));
		
		node = {};
		node.id = resultSet.getString(3);
		node.title = resultSet.getString(3);
		node.label = resultSet.getString(3);
		
		nodes.push(node);
	}
	
	edge = {};
	edge.id = resultSet.getInteger(1);
	edge.from = resultSet.getString(2);
	edge.to = resultSet.getString(3);
	edge.title = resultSet.getString(4);
	
	edges.push(edge);
}

graph.push(nodes);
graph.push(edges);

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(JSON.stringify(graph));
