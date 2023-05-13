/*

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, If not, see <https://www.gnu.org/licenses/>.

*/

var textField = document.getElementById('actualize-progress');
var tabBar = document.getElementById('tab-bar');
var tabView = document.getElementById('tab-view');
var curLangIdx;
var activeTable;

var submissions;
var sortedSubmissions = {};

var currentSort = [];

var difficulties = [];
difficulties[1] = 'Easy';
difficulties[2] = 'Medium';
difficulties[3] = 'Hard';

var difficultyColors = [];
difficultyColors[1] = '#5cb85c';
difficultyColors[2] = '#f0ad4e';
difficultyColors[3] = '#d9534f';

function sortSubmissions() {
	sortedSubmissions['byProblemName'] = {}
	sortedSubmissions['byProblemName']['ascending'] = clone(submissions);
	sortedSubmissions['byProblemName']['ascending'].forEach(function(submissions) {
		submissions['submissions'].sort(function (a, b) {
			return a['problemName'].localeCompare(b['problemName']);
		});
	});
	sortedSubmissions['byBeats'] = {}
	sortedSubmissions['byBeats']['ascending'] = clone(submissions);
	sortedSubmissions['byBeats']['ascending'].forEach(function(submissions) {
		submissions['submissions'].sort(function (a, b) {
			if (isNaN(a['beats'])) return -1;
			if (isNaN(b['beats'])) return 1;
			return a['beats'] - b['beats'];
		});
	});
	sortedSubmissions['byRuntime'] = {}
	sortedSubmissions['byRuntime']['ascending'] = clone(submissions);
	sortedSubmissions['byRuntime']['ascending'].forEach(function(submissions) {
		submissions['submissions'].sort(function (a, b) {
			return a['runtime'] - b['runtime'];
		});
	});
	sortedSubmissions['byDifficulty'] = {}
	sortedSubmissions['byDifficulty']['ascending'] = clone(submissions);
	sortedSubmissions['byDifficulty']['ascending'].forEach(function(submissions) {
		submissions['submissions'].sort(function (a, b) {
			return a['difficulty'] - b['difficulty'];
		});
	});
	
	sortedSubmissions['byProblemName']['descending'] = clone(sortedSubmissions['byProblemName']['ascending']);
	sortedSubmissions['byProblemName']['descending'].forEach(function(submissions) {
		submissions['submissions'].reverse();
	});
	sortedSubmissions['byBeats']['descending'] = clone(sortedSubmissions['byBeats']['ascending']);
	sortedSubmissions['byBeats']['descending'].forEach(function(submissions) {
		submissions['submissions'].reverse();
	});
	sortedSubmissions['byRuntime']['descending'] = clone(sortedSubmissions['byRuntime']['ascending']);
	sortedSubmissions['byRuntime']['descending'].forEach(function(submissions) {
		submissions['submissions'].reverse();
	});
	sortedSubmissions['byDifficulty']['descending'] = clone(sortedSubmissions['byDifficulty']['ascending']);
	sortedSubmissions['byDifficulty']['descending'].forEach(function(submissions) {
		submissions['submissions'].reverse();
	});
	
	currentSort = [];
	submissions.forEach(function(submission) {
		newSort = {};
		newSort['lang'] = submission['lang'];
		newSort['sortBy'] = 'noSort';
		newSort['sortOrder'] = 'ascending';
		currentSort.push(newSort);
	});
}

function loadSubmissions() {
	request = new XMLHttpRequest();
	request.open('GET', '/api/submissions/cached');
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if (this.status == 200) {
				submissions = JSON.parse(this.responseText);
				if (submissions.length > 0) {
					sortSubmissions();
					visualizeSubmissions(submissions);
				}
			} else {
				textField.innerHTML = this.responseText;
			}
		}
	};
	request.send();
}

function visualizeSubmissions(submissions) {
	tabBar.innerHTML = '';
	tabView.innerHTML = '';
	
	submissions.forEach(function(submission) {
		let lang = submission['lang']
		
		tabBar.innerHTML += '<div class="tab-button">'+lang+'</div>'
		
		let table = '<table id="'+lang+'">' +
			'<thead>' +
				'<tr>' +
					'<th onclick="onSortSubmissions(event)" sort="byProblemName"><span>Problem name</span><span></span></th>' +
					'<th onclick="onSortSubmissions(event)" sort="byBeats"><span>Your runtime beats % of submissions</span><span></span></th>' +
					'<th onclick="onSortSubmissions(event)" sort="byRuntime"><span>Runtime (ms)</span><span></span></th>' +
					'<th onclick="onSortSubmissions(event)" sort="byDifficulty"><span>Difficulty</span><span></span></th>' +
				'</tr>' +
			'</thead>' +
			'<tbody>' + 
			'</tbody>' +
		'</table>';
		
		tabView.innerHTML += table;
	});
	
	tabBar.firstChild.classList.add('selected');
	tabView.firstChild.classList.add('selected');
	
	activeTable = tabView.firstChild;
	
	tabBar.childNodes.forEach(function(node) {
		if (!node.classList.contains('selected')) {
			node.addEventListener('click', onTabButtonClick);
		}
	});
	
	document.querySelectorAll('table').forEach(function(table) {
		let submissionsWithLang = submissions.find(function (submission) {
			return submission['lang'] == table.id;
		})['submissions'];
		populateTableBody(table.querySelector('tbody'), submissionsWithLang);
	});
	
	curLangIdx = 0;
}

function populateTableBody(tableBody, submissions) {
	let rows = '';
	submissions.forEach(function (submission) {
		rows += `<tr>
				<td><a href="https://leetcode.com/problems/${submission['slug']}/">${submission['problemName']}</a></td>
				<td>${submission['beats']}</td>
				<td>${submission['runtime']}</td>
				<td style="background-color:${difficultyColors[submission['difficulty']]};">${difficulties[submission['difficulty']]}</td>
			</tr>`;
	});
	
	tableBody.innerHTML = rows;
}

function onTabButtonClick(e) {
	tabBar.childNodes.forEach(function(tabButton) {
		tabButton.classList.remove('selected');
		tabButton.addEventListener('click', onTabButtonClick);
	});
	e.target.classList.add('selected');
	e.target.removeEventListener('click', onTabButtonClick);
	tabView.childNodes.forEach(function(table) {
		table.classList.remove('selected');
	});
	activeTable = document.getElementById(e.target.innerHTML);
	activeTable.classList.add('selected');
	
	curLangIdx = submissions.findIndex(function(submission) {
		return submission['lang'] == activeTable.id;
	});
}

function onSortSubmissions(e) {
	let curSort = currentSort.find(function(sort) {
		return sort['lang'] == activeTable.id;
	});
	let tableBody = activeTable.querySelector('tbody');
	let sortSpan = e.target.lastChild;
	let sortBy = e.target.getAttribute('sort');
	
	activeTable.querySelectorAll('th').forEach(function (th){
		th.lastChild.innerHTML = '';
	});
	
	if (curSort['sortBy'] === sortBy) {
		if (curSort['sortOrder'] === 'descending') {
			populateTableBody(tableBody, sortedSubmissions[sortBy]['ascending'][curLangIdx]['submissions']);
			curSort['sortOrder'] = 'ascending';
			sortSpan.innerHTML = '&uarr;';
		} else if (curSort['sortOrder'] === 'ascending') {
			let submissionsWithLang = submissions.find(function (submission) {
				return submission['lang'] == activeTable.id;
			})['submissions'];
			populateTableBody(tableBody, submissionsWithLang);
			curSort['sortBy'] = 'noSort;';
			sortSpan.innerHTML = '';
		} else {
			populateTableBody(tableBody, sortedSubmissions[sortBy]['descending'][curLangIdx]['submissions']);
			curSort['sortBy'] = sortBy;
			curSort['sortOrder'] = 'descending';
			sortSpan.innerHTML = '&darr;';
		}
	} else {
		populateTableBody(tableBody, sortedSubmissions[sortBy]['descending'][curLangIdx]['submissions']);
		curSort['sortBy'] = sortBy;
		curSort['sortOrder'] = 'descending';
		sortSpan.innerHTML = '&darr;';
	}
}

document.getElementById('actualize').addEventListener('click', function(e) {
	e.target.disabled = true;
	request = new XMLHttpRequest();
	request.open('POST', '/api/submissions/actualize', true);
	
	request.onreadystatechange = function() {
		if(this.readyState == 4) {
			if (this.status == 200) {
				textField.innerHTML = '';
				e.target.disabled = false;
				loadSubmissions();
			} else {
				textField.innerHTML = this.responseText;
			}
		}
	};
	
	request.onprogress = function(e) {
		textField.innerHTML = 'progress: ' + e.loaded + '/' + e.total;
	};
	
	request.send();
});

function clone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

loadSubmissions();
