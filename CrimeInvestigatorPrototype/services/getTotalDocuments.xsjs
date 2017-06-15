
var connection = $.db.getConnection();

var query = "select count(*) "
			+ " from data_explorer.nodes";

var statement = connection.prepareStatement(query);

var resultSet = statement.executeQuery();

var matching_count = 0;

while(resultSet.next()) {
	matching_count = resultSet.getInteger(1);
}

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(matching_count);
