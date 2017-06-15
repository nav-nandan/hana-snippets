
-- Fuzzy Search --

create column table data_explorer.nodes (node_id varchar(100), location ST_Point(4326), timestamp timestamp, node_attribute_1 varchar(5000));
create column table data_explorer.edges (edge_id integer, node_1 varchar(100), node_2 varchar(100), relation varchar(100), edge_attribute_1 varchar(100));

alter table data_explorer.nodes alter (node_id varchar(100) primary key);

drop fulltext index data_explorer.node_attribute_1_index;
create fulltext index data_explorer.node_attribute_1_index
	on data_explorer.nodes (node_attribute_1) search only on fuzzy search index on;

select node_id, TO_DECIMAL(SCORE(),3,2) as score, node_attribute_1, snippets(node_attribute_1) from data_explorer.nodes
	where CONTAINS(node_attribute_1, 'robbry', FUZZY(0.65, 'textSearch=fulltext')) order by score desc;



-- Graph Modeling --

alter table edges alter (edge_id integer unique not null);
alter table edges alter (node_1 varchar(100) not null);
alter table edges alter (node_2 varchar(100) not null);

CREATE GRAPH WORKSPACE GRAPH
 EDGE TABLE edges
 SOURCE COLUMN node_1
 TARGET COLUMN node_2
 KEY COLUMN edge_id
 VERTEX TABLE nodes
 KEY COLUMN node_id;



-- Graph Algorithm --

drop CALCULATION SCENARIO "DATA_EXPLORER"."GET_NEIGHBORHOOD_EXAMPLE" cascade;
CREATE CALCULATION SCENARIO "DATA_EXPLORER"."GET_NEIGHBORHOOD_EXAMPLE" USING '
<?xml version="1.0"?>
<cubeSchema version="2" operation="createCalculationScenario"
defaultLanguage="en">
 <calculationScenario schema="DATA_EXPLORER" name="GET_NEIGHBORHOOD_EXAMPLE">
 <calculationViews>
 <graph name="get_neighborhood_node" defaultViewFlag="true" schema="DATA_EXPLORER" workspace="GRAPH" action="GET_NEIGHBORHOOD">
 <expression>
 <![CDATA[{
 "parameters": {
	 "startVertices": $$startVertices$$,
	 "direction": "$$direction$$",
	 "minDepth": $$minDepth$$,
	 "maxDepth": $$maxDepth$$,
	 "vertexFilter" : "$$vertexFilter$$",
	 "edgeFilter" : "$$edgeFilter$$"
 }
 }]]>
 </expression>
 <viewAttributes>
 <viewAttribute name="NODE_ID" datatype="string"/>
 <viewAttribute name="DEPTH" datatype="int"/>
 </viewAttributes>
 </graph>
 </calculationViews>
 <variables>
	 <variable name="$$startVertices$$" type="graphVariable"/>
	 <variable name="$$direction$$" type="graphVariable">
	 <defaultValue>any</defaultValue>
	 </variable>
	 <variable name="$$minDepth$$" type="graphVariable">
	 <defaultValue>0</defaultValue>
	 </variable>
	 <variable name="$$maxDepth$$" type="graphVariable"/>
	 <variable name="$$vertexFilter$$" type="graphVariable">
	 <defaultValue></defaultValue>
	 </variable>
	 <variable name="$$edgeFilter$$" type="graphVariable">
	 <defaultValue></defaultValue>
	 </variable>
 </variables>
 </calculationScenario>
</cubeSchema>
' WITH PARAMETERS ('EXPOSE_NODE'=('get_neighborhood_node', 'GET_NEIGHBORHOOD_EXAMPLE'));


SELECT * FROM "DATA_EXPLORER"."GET_NEIGHBORHOOD_EXAMPLE" ORDER BY "DEPTH" WITH
PARAMETERS (
	'placeholder' = ('$$startVertices$$', '["C110"]'),
	'placeholder' = ('$$maxDepth$$', '2')
);


-- Link Prediction --
create column table input_link_prediction as (select source as node_1, target as node_2 from relationships);
create column table output_link_prediction (node_1 varchar(100), node_2 varchar(100), prediction_score double);

select * from data_explorer.output_link_prediction where prediction_score != 1 order by prediction_score desc;
