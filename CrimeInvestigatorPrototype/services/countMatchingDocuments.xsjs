var search_term = $.request.parameters.get('search_term');
var fuzziness_score = $.request.parameters.get('fuzziness_score');

var connection = $.db.getConnection();

var query = "select count(*) "
			+ " from data_explorer.nodes"
			+ " where CONTAINS(node_attribute_1, ?, FUZZY(?, 'textSearch=fulltext'))";

var statement = connection.prepareStatement(query);

statement.setString(1, search_term);
statement.setString(2, fuzziness_score);

var resultSet = statement.executeQuery();

var matching_count = 0;

while(resultSet.next()) {
	matching_count = resultSet.getInteger(1);
}

statement.close();
connection.close();

$.response.contentType = "text/html";
$.response.setBody(matching_count);
