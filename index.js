'use strict'

const prompt = require('cli-fuzzy-search')
const fuzzy = require('cli-fuzzy-search/lib/fuzzy')
const opn = require('opn');

// The search function

const data = require('./starred_repos_stuf.json')
const pagination = 8
const search = (query, page) => new Promise(resolve => {
	setTimeout(() => {
		const results = filter(query)
		resolve({
			total: results.length,
			data: results.slice((page - 1) * pagination, page * pagination),
			more: results.length > page * pagination
		})
	}, 250)
})
// Use our fuzzy-matching but remove extra properties from result
const filter = query => fuzzy(data, query.split('')).map(item => {
	item.label = item.full_name;
	return item
})


console.log('Search function takes 250 ms each call returning ' + pagination + ' results')

prompt({
		search
	})
	.then(item => {
		console.log('Selected item:', item)
		opn(`https://github.com/${item.full_name}`, {wait: false}).then(() => {
			process.exit(0)
		});
	})
	.catch(e => {
		console.error('Error:', e)
		process.exit(1)
	})
