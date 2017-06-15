
var connection = $.db.getConnection();

var query = "select distinct(node_1) from data_explorer.edges"
    		+ " union select distinct(node_2) from data_explorer.edges";

var statement = connection.prepareStatement(query);

var resultSet = statement.executeQuery();

var case_id_list = [];

while(resultSet.next()) {
	case_id_list.push(resultSet.getString(1));
}

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(JSON.stringify(case_id_list));
