angularJs.searchFilter
======================

Easy (add new item) filter

![alt tag](https://raw.github.com/JTOne123/angularJs.searchFilter/master/searchFilter.png)

How to use:

Html:
<pre><code>
	&lt;searchfilter items="filterItems" init-filter="initFilter" search-action="doSearch" /&gt;
</code></pre>

Controller:
<pre><code>
	$scope.filterItems =
	[
		{ name: '_id', display: 'FileID', type: 'string' },
		{ name: 'status', display: 'Status', type: 'dropdown', values: { 'New': 'new', 'Completed': 'completed', 'Deleted': 'deleted' } },
		{ name: '_created.$dt', display: 'Created', type: 'date' },
		{
			name: '_$orderBy', display: '[Order By]', type: 'dropdown', values: {
				'Created descent': {
					field: '_created.$dt',
					direction: 'desc'
				},
				'Created ascent': {
					field: '_created.$dt',
					direction: 'asc'
				}
			}
		},
		{ name: 'originalFileName', display: 'Original filename', type: 'string' },
		{ name: 'extId', display: 'ExternalID' },
		{ name: 'size', display: 'Size' },
		{ name: '_modified.$dt', display: 'Modified', type: 'date' },
		{ name: 'lastAccess.$dt', display: 'Last access', type: 'date' },
		{ name: 'mappings.storage', display: 'Storage', type: 'dropdown', values: StorageService.getStorageMap() }
	];
</code></pre>

CSS: By defaults used a twitter bootstrap
