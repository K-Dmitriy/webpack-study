import * as $ from 'jquery';
import Post from '@models/post';
import './style/style.css';
import './style/less.less';
import './style/scss.scss';
import WebpackLogo from '@/assets/webpack-logo';
// import json from './assets/json';
// import xml from './assets/data.xml';
// import csv from './assets/data.csv';

const post = new Post('Webpack Post Title', WebpackLogo);

$('pre').addClass('code').html(post.toString());

// console.log('Post to String: ', post.toString());
// console.log('JSON: ', json);
// console.log('XML: ', xml);
// console.log('CSV: ', csv);